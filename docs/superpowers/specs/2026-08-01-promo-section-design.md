# KeksPoint — Promo Section (seasonal picture promo) — Design

**Status:** Approved
**Scope:** Replace the `Promo.tsx` Phase 1 placeholder (currently just a "Seasonal Promo" title on a flat cream band) with a real, image-led seasonal promo section, positioned right after MenuCarousel ("the tray"). Data stays hardcoded in the component for now — this is a front-end-only change; the admin panel / Supabase table for editing this content is a later phase (see `KeksPoint_Website_Plan.md` section 5/6, "Promo control").

## Goal

A full-width picture promo with a heading + subline overlaid on top, built so the current hardcoded content is a trivial swap for admin-editable content later: 1-3 images, one row on desktop, auto-cycling on mobile.

## Out of scope

- Admin panel / Supabase `promo` table wiring (still a later phase)
- On/off toggle for the section (master plan describes this as conditional; that logic arrives with the admin panel — for now the section always renders)
- CTA button/link (not requested; can be added later without restructuring)
- Video media type (master plan's `media_type: image|video` — this pass is images only)

## Data shape

```ts
type PromoImage = { id: string; src: string; alt: string };

const PROMO_IMAGES: PromoImage[] = [
  { id: "beach", src: "/assets/beachCookie.jpg", alt: "..." },
  { id: "pump", src: "/assets/icecreamPump.jpg", alt: "..." },
  { id: "eating", src: "/assets/eatingIcecreamCookie.jpg", alt: "..." },
];
const PROMO_HEADING = "Soft serve with your favorite flavor";
const PROMO_SUBLINE = "Cookie serving made for hot summer days";
```

Placeholder data, marked with a comment (matching `MenuCarousel`'s `SLIDES` convention) noting it should swap for an admin/DB-backed fetch once the promo table exists. This shape maps directly onto the `promo` table already sketched in the master plan (`heading`, `body_text`) plus a new `promo_images(promo_id, url, sort_order)` child table replacing the single `media_url` column — no restructuring needed when that lands.

Images: `beachCookie.jpg` (already in `public/assets/`), `icecreamPump.jpg` and `eatingIcecreamCookie.jpg` (currently only in the root `/assets` source folder — need to be copied into `public/assets/` as part of implementation, matching how every other image in this repo is served).

## Layout & responsiveness

- **Full-bleed:** breaks out of the `max-w` container pattern other sections use (`Promo` currently uses `flex min-h-[40vh] items-center justify-center`) — pictures run edge-to-edge, no side padding on the images themselves.
- **Desktop (`sm:` and up):** all configured images render in one row (`flex`), equal width, filling the viewport width, each `object-cover` inside a fixed-height band. If only 1 image is configured, it fills the row alone — the row layout doesn't change, no forced 3-way split.
- **Mobile (below `sm:`):** single image at a time, `aspect-[3/4]`, auto-crossfading through `PROMO_IMAGES` on a timer (~5s), no arrows/dots/manual control ("auto only" — matches "the pictures change with time"). If only 1 image is configured, it's static (no cycling, no timer needed).
- **Text overlay:** one shared heading + subline block, absolutely centered over the row/image, same content and position on both breakpoints (not per-image).

## Text treatment

- Heading (`font-display`, large): "Soft serve with your favorite flavor"
- Subline (`font-sans`, smaller): "Cookie serving made for hot summer days"
- Contrast: dark gradient scrim (dark-to-transparent, heaviest at bottom/center) behind the text, cream-colored text on top — survives whichever photos land in this slot later without needing a boxed panel that reads like a sticker over the photography.

## Technical approach

- `next/image` with `fill` inside sized containers (row of flex items on desktop, single `aspect-[3/4]` container on mobile), `object-cover`.
- Mobile auto-cycle: `"use client"` component, `useState` + `useEffect`/`setInterval` cycling the active index every ~5s, crossfade via CSS opacity transition (matches the lightweight state approach `MenuCarousel` already uses, no new dependencies).
- Desktop row doesn't need the interval/state — it's a static flex row of all configured images.
- Reuse existing tokens only (`brand-red`, `cream`, `font-display`, `font-sans`) — no new design tokens, no new npm packages.
- Copy `icecreamPump.jpg` and `eatingIcecreamCookie.jpg` from `/assets` to `/public/assets` as part of implementation.

## Verification

- `pnpm dev` + check the rendered HTML contains the heading/subline text and all three `<img>`/`next/image` sources resolve (no 404s in the network tab/console).
- Headless-Chromium screenshots at desktop (~1440px, confirms one row of 3 images with centered overlay text) and mobile (~375px, confirms single 3:4 image with overlay text, and that it changes after waiting past the ~5s interval).
- Confirm no layout shift/overflow at both widths, and that the section still sits directly after MenuCarousel and before BestWayToEat with no gap/overlap regressions.
