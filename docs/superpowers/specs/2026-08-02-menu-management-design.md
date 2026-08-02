# KeksPoint — Menu Management (Public + Admin) — Design

**Status:** Approved
**Scope:** Sub-project of the KeksPoint website build (see `KeksPoint_Website_Plan.md` sections 5–6). Introduces the first real data layer (Supabase) and covers: the `menu_items` table + image storage, an unauthenticated admin CRUD UI at `/admin`, a new public `/menu` page, and wiring the existing homepage `MenuCarousel` to the same data instead of its hardcoded single slide.

## Goal

Let the owner add/edit/remove menu items (cookies, soft serve, the giant birthday cookie — all as plain rows, no category distinction) with a photo and allergen tags from `/admin`, and have those items show up as cards on a new public `/menu` page and cycle through the existing homepage tray carousel — with no manual deploy or code change required.

## Out of scope

- Admin login/auth — explicitly deferred. `/admin` is reachable by anyone who has the URL. Mitigated at the data layer (see "Security note" below), but there is no UI gate. A follow-up project should add Supabase Auth to `/admin` before this is treated as production-hardened.
- Promo section, order request form, site settings — still separate placeholders/sections per the master plan, untouched here.
- The existing homepage `BirthdayCookie.tsx` marketing section — stays as static editorial copy, not data-driven. The birthday cookie also gets its own row in `menu_items` so it appears in `/menu` and the carousel, but that row is independent of this section.
- Deleting/replacing storage objects on edit — uploading a new photo for an existing item just adds a new object and repoints `image_url`; the old object is left in the bucket (acceptable storage cost, avoids delete-race complexity).
- Any animation/motion polish for the new `/menu` page — deferred to the site-wide "Polish & QA" phase, consistent with how prior sections handled this.

## Data model (Supabase)

```sql
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(6,2) not null,
  image_url text,
  allergens text[] not null default '{}',  -- subset of: gluten, dairy, eggs, nuts, peanuts, soy
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
```

- Allergen values are constrained in the admin UI (fixed checklist: Gluten, Dairy, Eggs, Nuts, Peanuts, Soy) rather than at the DB level — a `check` constraint on array contents adds complexity for little benefit here.
- Storage bucket `menu-images` (public read) holds uploaded photos; `image_url` stores the public URL Supabase returns after upload.

### Security note (no admin auth)

Skipping a login screen does not mean the table is open to writes from anyone hitting the Supabase REST API with the public anon key:

- RLS on `menu_items`: `select` allowed to `anon` only where `is_active = true`. No `insert`/`update`/`delete` policy for `anon` at all.
- All mutations happen inside Next.js Server Actions using a **service-role** Supabase client (`SUPABASE_SERVICE_ROLE_KEY`), which lives only in server-side env vars and never reaches the browser bundle.
- Net effect: `/admin`'s UI is unprotected (anyone with the link can use the form), but the database itself can't be mutated by someone just inspecting network requests or the anon key — they'd need to find and use `/admin` itself.

## Backend setup

- Provision the Supabase project via the already-connected Supabase MCP integration (this repo isn't Vercel-linked, so the `vercel integration` CLI path doesn't apply here).
- Env vars in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- `lib/supabase/public.ts` — anon-key client factory, used for all public reads (menu page, homepage carousel data fetch).
- `lib/supabase/admin.ts` — service-role client factory, imported only from `"use server"` files.

## Admin (`/admin`)

Replaces the current placeholder page entirely.

- **Item list:** every row (active + inactive), showing thumbnail, name, price, allergen tags, best-seller/active toggle switches, edit and delete buttons.
- **Add/edit form:** name, description, price, allergen checkboxes (Gluten/Dairy/Eggs/Nuts/Peanuts/Soy), image file input, best-seller checkbox, active checkbox, sort order number. Same form component handles both create and edit (edit pre-fills from the row).
- **Server Actions** (`app/admin/actions.ts`, all `"use server"`, all using the service-role client):
  - `createMenuItem(formData)` — uploads the image to `menu-images` if present, inserts the row.
  - `updateMenuItem(id, formData)` — same, but updates; only re-uploads if a new file was chosen.
  - `deleteMenuItem(id)` — deletes the row (storage object left in place, per "out of scope" above).
  - `toggleField(id, field, value)` — quick toggle for `is_active`/`is_best_seller` from the list view without opening the full form.
  - Every action calls `revalidatePath("/menu")` and `revalidatePath("/")` so the public page and homepage carousel reflect changes immediately.

## Public `/menu` page

- New route: `app/(site)/menu/page.tsx`, a Server Component.
- Fetches `menu_items` where `is_active = true`, ordered by `sort_order`, using the anon client.
- Renders `FloatingNav` + `Footer` (same as the homepage) plus a card grid: photo, name, description, price, allergen tags, "Best Seller" badge when flagged.
- `FloatingNav`'s "Menu" link changes from `#menu` to `/menu`.

### FloatingNav fix required

`FloatingNav.tsx` currently only becomes visible after scrolling past an element with `id="menu"` (an `IntersectionObserver` on that specific ID, set up in `useEffect`). That element only exists on the homepage (the `MenuCarousel` section). On `/menu` there is no such element, so the observer setup silently no-ops and the nav would never appear. Fix: if `document.getElementById("menu")` isn't found, fall back to arming after a fixed scroll distance (e.g., past one viewport height) instead of returning early.

## Homepage carousel (`MenuCarousel.tsx`)

- `app/(site)/page.tsx` fetches active items server-side (anon client, same query as `/menu`) and passes them as a prop into `MenuCarousel`.
- `MenuCarousel` stays a client component (it owns the drag/arrow interaction state) but drops its hardcoded `SLIDES` array in favor of the prop. It cycles through **all** active items — cookies, soft serve, and the birthday cookie alike, not just cookies.
- Best-seller badge logic (currently keyed off a static `badge` field) switches to reading `is_best_seller` from the item.

## Error handling

- Server Actions return `{ error: string }` on failure (missing required fields, upload failure) instead of throwing, so the admin form can show inline feedback without a full error boundary.
- The admin form requires a photo on create, so `image_url` should always be set in normal use. As a defensive fallback (e.g. a row ever ends up without one), the public card and carousel slide render a plain `bg-cream` box in place of the image rather than a broken `next/image`.

## Testing / verification

- `pnpm dev`, then manually exercise the admin flow: add an item with a photo and allergens, confirm it appears on `/menu` and cycles into the homepage carousel without a restart (Server Action revalidation working).
- Toggle `is_active` off and confirm the item disappears from both public surfaces but still shows in the admin list.
- Toggle `is_best_seller` and confirm the badge appears/disappears on the card and carousel slide.
- Delete an item and confirm it's gone from both public surfaces.
- Headless-Chromium screenshots (desktop ~1440px, mobile ~375px) of `/menu` and the homepage carousel to confirm card grid and carousel rendering.
- Check browser console for errors on both viewports and on `/admin`.
