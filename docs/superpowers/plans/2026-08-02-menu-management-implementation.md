# KeksPoint — Menu Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin CRUD at `/admin`, the public `/menu` cards page, and dynamic wiring of the homepage `MenuCarousel`, all backed by the already-provisioned Supabase project, per `docs/superpowers/specs/2026-08-02-menu-management-design.md`.

**Architecture:** A shared `lib/menu.ts` data layer (types + `getActiveMenuItems()`) is read by Server Components on both public surfaces (`/menu` page and the homepage). `app/admin/actions.ts` holds all four Server Actions (`saveMenuItem`, `deleteMenuItem`, `toggleMenuItemField`, `getAllMenuItemsForAdmin`), each using a service-role Supabase client that never reaches the browser. `/admin` has no login gate (accepted tradeoff, see spec). Every mutation calls `revalidatePath` on `/`, `/menu`, and `/admin` so both public surfaces update immediately without a redeploy.

**Tech Stack:** Next.js App Router Server Actions · `@supabase/supabase-js` · `server-only` (guards the service-role client from client bundles) · React 19 `useActionState`/`useTransition` for the admin form/toggles · Tailwind CSS v4 (existing tokens only) · Supabase Storage for photo uploads

## Global Constraints

- Supabase project: `ujpzsbcxicbpghadccft` (already provisioned, `menu_items` table + `menu-images` public bucket + RLS already applied — see spec's "Backend setup" and "Security note")
- Env vars already in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` must be pasted in by the user from the Supabase dashboard before Task 3 can be exercised end-to-end — if it's still the placeholder value, admin mutations will fail with an auth error; note this to the user rather than treating it as a bug.
- No admin login/auth — explicitly out of scope per the spec
- All mutations go through Server Actions using the service-role client (`lib/supabase/admin.ts`), never a client-side Supabase call — this is the security boundary substituting for a login screen
- `next/image` for every image, with `fill` inside a `relative`-positioned container, a `sizes` prop, and descriptive `alt` text
- Tailwind v4 utility classes only, reusing existing tokens (`brand-red`, `cream`, `gold`, `font-display`, `font-sans`, `font-heading`, `font-script`) — no new design tokens
- Dev server: `pnpm dev`, stop with `taskkill //F //IM node.exe //T` (Windows/Git Bash environment)
- No unit test framework exists in this repo; verification follows the established pattern (curl/grep against rendered HTML, Playwright screenshots, and direct Supabase queries via `execute_sql` to confirm DB state) rather than pytest/jest-style tests

---

### Task 1: Install Supabase dependencies

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`

**Interfaces:**
- Produces: `@supabase/supabase-js` (client library) and `server-only` (build-time guard) available to import in later tasks

- [ ] **Step 1: Install packages**

```bash
pnpm add @supabase/supabase-js server-only
```

- [ ] **Step 2: Verify install and that the project still builds**

```bash
pnpm build
```

Expected: exits 0. Route list should still include `/`, `/admin`, `/_not-found`.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "Add @supabase/supabase-js and server-only dependencies"
```

---

### Task 2: Supabase clients and the menu data layer

**Files:**
- Create: `lib/supabase/public.ts`
- Create: `lib/supabase/admin.ts`
- Create: `lib/menu.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` env vars; `@supabase/supabase-js` (Task 1)
- Produces: `getPublicSupabaseClient()`, `getAdminSupabaseClient()`; `ALLERGENS` (readonly tuple), `type Allergen`, `type MenuItem`, `mapMenuItemRow(row)`, `getActiveMenuItems(): Promise<MenuItem[]>` — all consumed by Tasks 3–7

- [ ] **Step 1: Write the public (anon) client factory**

```ts
// lib/supabase/public.ts
import { createClient } from "@supabase/supabase-js";

export function getPublicSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 2: Write the admin (service-role) client factory**

```ts
// lib/supabase/admin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

export function getAdminSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
```

- [ ] **Step 3: Write the menu data layer**

```ts
// lib/menu.ts
import { getPublicSupabaseClient } from "./supabase/public";

export const ALLERGENS = ["gluten", "dairy", "eggs", "nuts", "peanuts", "soy"] as const;
export type Allergen = (typeof ALLERGENS)[number];

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  allergens: Allergen[];
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
};

type MenuItemRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  allergens: string[];
  is_best_seller: boolean;
  is_active: boolean;
  sort_order: number;
};

export const MENU_ITEM_COLUMNS =
  "id, name, description, price, image_url, allergens, is_best_seller, is_active, sort_order";

export function mapMenuItemRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    allergens: row.allergens.filter((value): value is Allergen =>
      (ALLERGENS as readonly string[]).includes(value),
    ),
    isBestSeller: row.is_best_seller,
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

export async function getActiveMenuItems(): Promise<MenuItem[]> {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load menu items", error);
    return [];
  }

  return (data ?? []).map(mapMenuItemRow);
}
```

- [ ] **Step 4: Verify types compile**

```bash
pnpm build
```

Expected: exits 0. (Nothing imports these files yet, so this only checks the files themselves are valid TypeScript — full runtime verification happens in Task 5 once a page calls `getActiveMenuItems()`.)

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/public.ts lib/supabase/admin.ts lib/menu.ts
git commit -m "Add Supabase clients and menu_items data layer"
```

---

### Task 3: Admin Server Actions

**Files:**
- Create: `app/admin/actions.ts`

**Interfaces:**
- Consumes: `getAdminSupabaseClient` (Task 2's `lib/supabase/admin.ts`), `ALLERGENS`, `type Allergen`, `type MenuItem`, `mapMenuItemRow`, `MENU_ITEM_COLUMNS` (Task 2's `lib/menu.ts`)
- Produces: `type ActionResult = { error: string } | { success: true }`; `getAllMenuItemsForAdmin(): Promise<MenuItem[]>`; `saveMenuItem(prevState: ActionResult | null, formData: FormData): Promise<ActionResult>`; `deleteMenuItem(id: string): Promise<ActionResult>`; `toggleMenuItemField(id: string, field: "is_active" | "is_best_seller", value: boolean): Promise<ActionResult>` — all consumed by Task 4

- [ ] **Step 1: Write the actions file**

```ts
// app/admin/actions.ts
"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import { ALLERGENS, MENU_ITEM_COLUMNS, mapMenuItemRow, type Allergen, type MenuItem } from "@/lib/menu";

export type ActionResult = { error: string } | { success: true };

const BUCKET = "menu-images";

function revalidateMenuPaths() {
  revalidatePath("/menu");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getAllMenuItemsForAdmin(): Promise<MenuItem[]> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load menu items for admin", error);
    return [];
  }

  return (data ?? []).map(mapMenuItemRow);
}

function parseAllergens(formData: FormData): Allergen[] {
  const values = formData.getAll("allergens").map(String);
  return ALLERGENS.filter((allergen) => values.includes(allergen));
}

async function uploadImage(file: File): Promise<string> {
  const supabase = getAdminSupabaseClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveMenuItem(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Number.parseFloat(String(formData.get("price") ?? ""));
  const sortOrder = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0;
  const isBestSeller = formData.get("is_best_seller") === "on";
  const isActive = formData.get("is_active") === "on";
  const allergens = parseAllergens(formData);
  const imageFile = formData.get("image");

  if (!name) return { error: "Name is required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };

  const hasImage = imageFile instanceof File && imageFile.size > 0;
  if (!id && !hasImage) return { error: "A photo is required for new items." };

  let imageUrl: string | undefined;
  try {
    if (hasImage) {
      imageUrl = await uploadImage(imageFile as File);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const supabase = getAdminSupabaseClient();
  const record = {
    name,
    description: description || null,
    price,
    allergens,
    is_best_seller: isBestSeller,
    is_active: isActive,
    sort_order: sortOrder,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  const { error } = id
    ? await supabase.from("menu_items").update(record).eq("id", id)
    : await supabase.from("menu_items").insert(record);

  if (error) return { error: error.message };

  revalidateMenuPaths();
  return { success: true };
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateMenuPaths();
  return { success: true };
}

export async function toggleMenuItemField(
  id: string,
  field: "is_active" | "is_best_seller",
  value: boolean,
): Promise<ActionResult> {
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ [field]: value })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateMenuPaths();
  return { success: true };
}
```

- [ ] **Step 2: Verify types compile**

```bash
pnpm build
```

Expected: exits 0. (Nothing calls these actions from the UI yet — Task 4 exercises them for real.)

- [ ] **Step 3: Commit**

```bash
git add app/admin/actions.ts
git commit -m "Add menu admin Server Actions (create/update/delete/toggle)"
```

---

### Task 4: Admin UI — replace the `/admin` placeholder with real CRUD

**Files:**
- Create: `app/admin/MenuItemForm.tsx`
- Create: `app/admin/MenuItemRow.tsx`
- Modify: `app/admin/page.tsx` (full replace)

**Interfaces:**
- Consumes: `saveMenuItem`, `deleteMenuItem`, `toggleMenuItemField`, `getAllMenuItemsForAdmin`, `type ActionResult` (Task 3); `ALLERGENS`, `type MenuItem` (Task 2)
- Produces: a working `/admin` page — used for manual verification in this task's Step 2, no other task imports from these files

- [ ] **Step 1: Write `MenuItemForm.tsx`**

```tsx
// app/admin/MenuItemForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveMenuItem, type ActionResult } from "./actions";
import { ALLERGENS, type MenuItem } from "@/lib/menu";

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  eggs: "Eggs",
  nuts: "Nuts",
  peanuts: "Peanuts",
  soy: "Soy",
};

type MenuItemFormProps = {
  item?: MenuItem;
  onSaved?: () => void;
};

export default function MenuItemForm({ item, onSaved }: MenuItemFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    saveMenuItem,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(item);

  useEffect(() => {
    if (state && "success" in state) {
      if (!isEdit) formRef.current?.reset();
      onSaved?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-xl border border-brand-red/15 p-4">
      {item && <input type="hidden" name="id" defaultValue={item.id} />}

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Name
        <input
          type="text"
          name="name"
          required
          defaultValue={item?.name}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Description
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={2}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Price (EUR)
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          required
          defaultValue={item?.price}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <fieldset className="flex flex-col gap-1 text-sm font-semibold">
        <legend>Allergens</legend>
        <div className="flex flex-wrap gap-3 font-normal">
          {ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="allergens"
                value={allergen}
                defaultChecked={item?.allergens.includes(allergen)}
              />
              {ALLERGEN_LABELS[allergen]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Photo {isEdit ? "(leave blank to keep current)" : ""}
        <input type="file" name="image" accept="image/*" required={!isEdit} />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Sort order
        <input
          type="number"
          name="sort_order"
          defaultValue={item?.sortOrder ?? 0}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="is_best_seller" defaultChecked={item?.isBestSeller} />
        Best Seller
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="is_active" defaultChecked={item?.isActive ?? true} />
        Active (visible on the site)
      </label>

      {state && "error" in state && (
        <p className="font-sans text-sm font-semibold text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-brand-red px-4 py-2 font-sans text-sm font-bold text-cream transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Add item"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Write `MenuItemRow.tsx`**

```tsx
// app/admin/MenuItemRow.tsx
"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import MenuItemForm from "./MenuItemForm";
import { deleteMenuItem, toggleMenuItemField } from "./actions";
import type { MenuItem } from "@/lib/menu";

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <div className="rounded-xl border border-brand-red/15 p-4">
        <MenuItemForm item={item} onSaved={() => setEditing(false)} />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-2 font-sans text-xs font-semibold underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-brand-red/15 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cream">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
        )}
      </div>

      <div className="min-w-32 flex-1">
        <p className="font-sans text-sm font-bold">{item.name}</p>
        <p className="font-sans text-xs text-brand-red/70">€{item.price.toFixed(2)}</p>
      </div>

      <label className="flex items-center gap-1.5 font-sans text-xs">
        <input
          type="checkbox"
          checked={item.isActive}
          disabled={isPending}
          onChange={(event) => {
            const checked = event.target.checked;
            startTransition(() => {
              toggleMenuItemField(item.id, "is_active", checked);
            });
          }}
        />
        Active
      </label>

      <label className="flex items-center gap-1.5 font-sans text-xs">
        <input
          type="checkbox"
          checked={item.isBestSeller}
          disabled={isPending}
          onChange={(event) => {
            const checked = event.target.checked;
            startTransition(() => {
              toggleMenuItemField(item.id, "is_best_seller", checked);
            });
          }}
        />
        Best Seller
      </label>

      <button type="button" onClick={() => setEditing(true)} className="font-sans text-xs font-semibold underline">
        Edit
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Delete "${item.name}"?`)) {
            startTransition(() => {
              deleteMenuItem(item.id);
            });
          }
        }}
        className="font-sans text-xs font-semibold text-red-700 underline"
      >
        Delete
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Replace `app/admin/page.tsx`**

```tsx
// app/admin/page.tsx
import { getAllMenuItemsForAdmin } from "./actions";
import MenuItemForm from "./MenuItemForm";
import MenuItemRow from "./MenuItemRow";

export default async function AdminPage() {
  const items = await getAllMenuItemsForAdmin();

  return (
    <div className="min-h-screen bg-cream px-6 py-12 font-sans text-brand-red">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-display text-3xl">Menu Admin</h1>

        <section id="add-item" className="mb-12">
          <h2 className="mb-4 font-heading text-xl font-bold">Add item</h2>
          <MenuItemForm />
        </section>

        <section id="item-list">
          <h2 className="mb-4 font-heading text-xl font-bold">All items ({items.length})</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: End-to-end verification against the live Supabase project**

Confirm `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` has been replaced with the real key from the Supabase dashboard before this step — without it every action below fails with an auth error.

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
```

Save this Playwright script to the scratchpad directory as `admin-verify-create.mjs` — it drives create, toggle, and edit, then stops (delete happens in a second script below so the DB can be inspected in between):

```js
import { chromium } from "playwright";
import path from "node:path";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("dialog", (dialog) => dialog.accept());
page.on("console", (msg) => msg.type() === "error" && console.log("CONSOLE_ERROR:", msg.text()));
page.on("pageerror", (err) => console.log("PAGE_ERROR:", String(err)));

await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });

// --- Create ---
const addForm = page.locator("#add-item form");
await addForm.locator('input[name="name"]').fill("Bueno Test Cookie");
await addForm.locator('textarea[name="description"]').fill("verification item");
await addForm.locator('input[name="price"]').fill("3.00");
await addForm.locator('input[name="allergens"][value="nuts"]').check();
await addForm.locator('input[name="image"]').setInputFiles(path.resolve("public/assets/BUENOcookie.png"));
await addForm.locator('button[type="submit"]').click();

const row = page.locator("#item-list div.flex.flex-col.gap-3 > div").filter({ hasText: "Bueno Test Cookie" });
await row.waitFor({ state: "visible", timeout: 10000 });
console.log("CREATE_OK:", (await row.locator("p", { hasText: "€3.00" }).count()) > 0);

// --- Toggle best seller on, active off ---
await row.locator('label:has-text("Best Seller") input[type="checkbox"]').check();
await row.locator('label:has-text("Active") input[type="checkbox"]').uncheck();
await page.waitForTimeout(1000);

// --- Edit ---
await row.locator('button:has-text("Edit")').click();
const editForm = page.locator("#item-list form");
console.log("EDIT_PREFILL_NAME:", await editForm.locator('input[name="name"]').inputValue());
console.log("EDIT_PREFILL_NUTS:", await editForm.locator('input[name="allergens"][value="nuts"]').isChecked());
await editForm.locator('input[name="name"]').fill("Bueno Test Cookie (edited)");
await editForm.locator('button[type="submit"]').click();
await page.waitForTimeout(1000);

const editedRow = page.locator("#item-list div.flex.flex-col.gap-3 > div").filter({ hasText: "Bueno Test Cookie (edited)" });
console.log("EDIT_OK:", (await editedRow.count()) > 0);

await browser.close();
```

Run: `node admin-verify-create.mjs`
Expected output: `CREATE_OK: true`, `EDIT_PREFILL_NAME: Bueno Test Cookie`, `EDIT_PREFILL_NUTS: true`, `EDIT_OK: true`, no `CONSOLE_ERROR`/`PAGE_ERROR` lines.

Cross-check against the database directly (catches UI-only bugs a passing script would miss):

```
Use the Supabase MCP execute_sql tool against project ujpzsbcxicbpghadccft:
select id, name, price, is_best_seller, is_active, image_url from menu_items order by created_at desc limit 5;
```

Expected: one row named "Bueno Test Cookie (edited)" with `price = 3.00`, `is_best_seller = true`, `is_active = false`, and a non-null `image_url` pointing at the `menu-images` bucket.

Now save a second script as `admin-verify-delete.mjs` to cover the delete path:

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("dialog", (dialog) => dialog.accept());
page.on("console", (msg) => msg.type() === "error" && console.log("CONSOLE_ERROR:", msg.text()));
page.on("pageerror", (err) => console.log("PAGE_ERROR:", String(err)));

await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });

const row = page.locator("#item-list div.flex.flex-col.gap-3 > div").filter({ hasText: "Bueno Test Cookie (edited)" });
await row.locator('button:has-text("Delete")').click();
await page.waitForTimeout(1000);
console.log("DELETE_OK:", (await page.locator("#item-list", { hasText: "Bueno Test Cookie" }).count()) === 0);

await browser.close();
```

Run: `node admin-verify-delete.mjs`
Expected output: `DELETE_OK: true`, no `CONSOLE_ERROR`/`PAGE_ERROR` lines. Re-run the same `execute_sql` query above and confirm no row named "Bueno Test Cookie (edited)" remains.

```bash
taskkill //F //IM node.exe //T
```

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx app/admin/MenuItemForm.tsx app/admin/MenuItemRow.tsx
git commit -m "Admin: replace placeholder with full menu item CRUD"
```

---

### Task 5: Public `/menu` page

**Files:**
- Create: `components/menu/MenuCard.tsx`
- Create: `app/(site)/menu/page.tsx`

**Interfaces:**
- Consumes: `getActiveMenuItems`, `type MenuItem` (Task 2's `lib/menu.ts`); `FloatingNav`, `Footer` (existing `components/layout/`)
- Produces: a working `/menu` route rendering all active items as cards — used for manual verification here and referenced again in Task 6/7's verification

- [ ] **Step 1: Write `MenuCard.tsx`**

```tsx
// components/menu/MenuCard.tsx
import Image from "next/image";
import type { MenuItem } from "@/lib/menu";

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  eggs: "Eggs",
  nuts: "Nuts",
  peanuts: "Peanuts",
  soy: "Soy",
};

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/60 shadow-sm">
      <div className="relative aspect-square w-full bg-cream">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        )}
        {item.isBestSeller && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-bold tracking-wide text-brand-red uppercase">
            Best Seller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-heading text-lg font-bold">{item.name}</h3>
          <span className="font-sans text-sm font-semibold">€{item.price.toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="font-sans text-sm text-brand-red/80">{item.description}</p>
        )}
        {item.allergens.length > 0 && (
          <p className="mt-auto font-sans text-xs text-brand-red/60">
            Contains: {item.allergens.map((allergen) => ALLERGEN_LABELS[allergen]).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/(site)/menu/page.tsx`**

```tsx
// app/(site)/menu/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { getActiveMenuItems } from "@/lib/menu";

export default async function MenuPage() {
  const items = await getActiveMenuItems();

  return (
    <>
      <FloatingNav />
      <main className="min-h-screen bg-cream px-6 py-24 text-brand-red">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-12 text-center font-script text-6xl">Menu</h1>
          {items.length === 0 ? (
            <p className="text-center font-sans text-sm text-brand-red/70">
              The menu is being updated — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Seed two temporary verification items directly in Supabase**

```
Use the Supabase MCP execute_sql tool against project ujpzsbcxicbpghadccft:

insert into menu_items (name, description, price, image_url, allergens, is_best_seller, is_active, sort_order)
values
  ('Bueno Cookie', 'Bueno-stuffed chocolate chip cookie', 3.00, 'https://ujpzsbcxicbpghadccft.supabase.co/storage/v1/object/public/menu-images/seed-bueno.png', array['nuts','dairy']::text[], true, true, 1),
  ('Soft Serve', 'Creamy soft serve, any flavor', 3.00, 'https://ujpzsbcxicbpghadccft.supabase.co/storage/v1/object/public/menu-images/seed-softserve.jpg', array['dairy']::text[], false, true, 2);
```

These `image_url` values point at storage paths that don't exist yet — that's fine for this task (verification only checks that the page renders name/price/allergen text and a card per item, not that the image request succeeds). Task 7 replaces both rows with ones that have real uploaded images before checking visuals.

- [ ] **Step 4: Verify the page renders both items**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/menu -o /c/tmp/keks-menu.html -w "%{http_code}\n"
grep -o "Bueno Cookie" /c/tmp/keks-menu.html
grep -o "Soft Serve" /c/tmp/keks-menu.html
grep -o "Best Seller" /c/tmp/keks-menu.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all three greps print a match.

- [ ] **Step 5: Commit**

```bash
git add components/menu/MenuCard.tsx "app/(site)/menu/page.tsx"
git commit -m "Add public /menu cards page"
```

---

### Task 6: Fix `FloatingNav` for the new `/menu` route

**Files:**
- Modify: `components/layout/FloatingNav.tsx`

**Interfaces:**
- Consumes: none new
- Produces: nav that reveals correctly on both `/` and `/menu`, with links that work from either page — no other task depends on this one

- [ ] **Step 1: Update the nav links and the reveal logic**

```tsx
// components/layout/FloatingNav.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
];

const AUTO_HIDE_MS = 4000;
const ARM_SCROLL_THRESHOLD = 400;

export default function FloatingNav() {
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const menuEl = document.getElementById("menu");

    if (menuEl) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const pastMenu = entry.boundingClientRect.top < 0;
          setArmed(pastMenu);
          if (!pastMenu) {
            setVisible(false);
            if (hideTimer.current) clearTimeout(hideTimer.current);
          }
        },
        { threshold: 0 },
      );
      observer.observe(menuEl);
      return () => observer.disconnect();
    }

    // No #menu section on this page (e.g. /menu) — arm once the user has
    // scrolled roughly past the fold instead of tracking a specific section.
    const onScroll = () => setArmed(window.scrollY > ARM_SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      if (!armed) return;

      if (scrollingDown) {
        setVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
      } else {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [armed]);

  return (
    <nav
      aria-hidden={!visible}
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <ul className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-red px-4 py-2.5 font-sans text-xs font-semibold tracking-wide text-cream uppercase shadow-lg sm:gap-6 sm:px-6 sm:py-3 sm:text-sm">
        {NAV_LINKS.map((link, i) => (
          <li key={link.href} className="flex items-center gap-2 sm:gap-6">
            <a href={link.href} className="transition hover:opacity-80">
              {link.label}
            </a>
            {i < NAV_LINKS.length - 1 && <span aria-hidden="true">|</span>}
          </li>
        ))}
        <li className="flex items-center gap-2 sm:gap-6">
          <span aria-hidden="true">|</span>
          <a
            href="https://www.instagram.com/kekspoint.hr/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
          >
            Follow Us
          </a>
        </li>
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Verify the nav arms and shows on `/menu`**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
```

Save and run this Playwright script (`nav-verify.mjs`) to check both routes:

```js
import { chromium } from "playwright";

async function checkNav(page, url, label) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(200);
  await page.evaluate(() => window.scrollTo(0, 700)); // scroll further down to trigger "visible"
  await page.waitForTimeout(400);

  const nav = page.locator("nav");
  const ariaHidden = await nav.getAttribute("aria-hidden");
  console.log(`${label}_NAV_VISIBLE:`, ariaHidden === "false");

  if (label === "MENU_PAGE") {
    console.log("MENU_LINK_HREF:", await nav.locator('a:has-text("Menu")').getAttribute("href"));
    console.log("HOME_LINK_HREF:", await nav.locator('a:has-text("Home")').getAttribute("href"));
    console.log("ABOUT_LINK_HREF:", await nav.locator('a:has-text("About")').getAttribute("href"));
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await checkNav(page, "http://localhost:3000/menu", "MENU_PAGE");
await checkNav(page, "http://localhost:3000/", "HOME_PAGE");

await browser.close();
```

Run: `node nav-verify.mjs`
Expected: `MENU_PAGE_NAV_VISIBLE: true`, `MENU_LINK_HREF: /menu`, `HOME_LINK_HREF: /#hero`, `ABOUT_LINK_HREF: /#about`, `HOME_PAGE_NAV_VISIBLE: true` (regression check confirming the original `#menu`-based reveal still works on the homepage).

```bash
taskkill //F //IM node.exe //T
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/FloatingNav.tsx
git commit -m "FloatingNav: work on routes without a #menu section, link Menu to /menu"
```

---

### Task 7: Wire the homepage carousel to dynamic menu items

**Files:**
- Modify: `components/sections/MenuCarousel.tsx` (full replace)
- Modify: `components/sections/Hero.tsx`
- Modify: `app/(site)/page.tsx`

**Interfaces:**
- Consumes: `getActiveMenuItems`, `type MenuItem` (Task 2's `lib/menu.ts`)
- Produces: `MenuCarousel({ items }: { items: MenuItem[] })`, `Hero({ items }: { items: MenuItem[] })` — both consumed only by `app/(site)/page.tsx`

- [ ] **Step 1: Replace `MenuCarousel.tsx`**

```tsx
// components/sections/MenuCarousel.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import DraggableSticker from "@/components/ui/DraggableSticker";
import type { MenuItem } from "@/lib/menu";

export default function MenuCarousel({ items }: { items: MenuItem[] }) {
  const [index, setIndex] = useState(0);
  const slide = items[index];

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div id="menu" className="bg-cream px-6 pt-8 pb-4 text-brand-red sm:pb-0">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <div className="pointer-events-none relative -mt-[50%] aspect-square w-full sm:-mb-[25px] md:-mb-[50px] lg:-mb-[90px] xl:-mb-[115px]">
          <Image
            src="/assets/tray.png"
            alt=""
            fill
            aria-hidden
            priority
            sizes="(min-width: 1280px) 1024px, (min-width: 640px) 80vw, 90vw"
            className="pointer-events-none object-contain"
          />

          {slide?.imageUrl && (
            <div className="absolute inset-[30%]">
              <Image
                src={slide.imageUrl}
                alt={slide.name}
                fill
                sizes="(min-width: 640px) 280px, 65vw"
                className="object-contain drop-shadow-md"
              />
            </div>
          )}

          {slide?.isBestSeller && (
            <DraggableSticker className="pointer-events-auto absolute top-[30%] left-[14%] h-[11%] w-[11%]">
              <div className="flex h-full w-full -rotate-12 items-center justify-center rounded-full bg-cream text-center text-[8px] leading-tight font-bold uppercase sm:text-[10px] md:text-xs lg:text-sm">
                BEST SELLER
              </div>
            </DraggableSticker>
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous cookie"
                className="pointer-events-auto absolute top-1/2 left-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next cookie"
                className="pointer-events-auto absolute top-1/2 right-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
              >
                ›
              </button>
            </>
          )}

          <p className="absolute top-[78%] left-1/2 flex -translate-x-1/2 items-center gap-4 font-script text-7xl whitespace-nowrap text-brand-red sm:text-8xl">
            <span aria-hidden="true" className="text-3xl sm:text-4xl">
              ★
            </span>
            Menu
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `Hero.tsx` to accept and forward `items`**

In `components/sections/Hero.tsx`, add the import and prop:

```tsx
import type { MenuItem } from "@/lib/menu";
```

Change the function signature from `export default function Hero() {` to:

```tsx
export default function Hero({ items }: { items: MenuItem[] }) {
```

Change `<MenuCarousel />` to `<MenuCarousel items={items} />`.

- [ ] **Step 3: Update `app/(site)/page.tsx` to fetch and pass items**

```tsx
// app/(site)/page.tsx
import Footer from "@/components/layout/Footer";
import FloatingNav from "@/components/layout/FloatingNav";
import Hero from "@/components/sections/Hero";
import Promo from "@/components/sections/Promo";
import BestWayToEat from "@/components/sections/BestWayToEat";
import PhotoStrip from "@/components/sections/PhotoStrip";
import AboutUs from "@/components/sections/AboutUs";
import BirthdayCookie from "@/components/sections/BirthdayCookie";
import { getActiveMenuItems } from "@/lib/menu";

export default async function Home() {
  const items = await getActiveMenuItems();

  return (
    <>
      <FloatingNav />
      <main>
        <Hero items={items} />
        <Promo />
        <BestWayToEat />
        <PhotoStrip />
        <BirthdayCookie />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Replace the temporary seed rows with ones that have real images, adding a third item**

```
Use the Supabase MCP execute_sql tool against project ujpzsbcxicbpghadccft:

delete from menu_items where name in ('Bueno Cookie', 'Soft Serve');
```

Then create three real items through the admin UI (already proven working end-to-end in Task 4) rather than raw SQL, so the uploaded images are real Supabase Storage objects, not broken URLs. Save and run this Playwright script (`seed-real-items.mjs`):

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
```

```js
import { chromium } from "playwright";
import path from "node:path";

async function addItem(page, { name, description, price, allergens, image, bestSeller, sortOrder }) {
  await page.goto("http://localhost:3000/admin", { waitUntil: "networkidle" });
  const form = page.locator("#add-item form");
  await form.locator('input[name="name"]').fill(name);
  await form.locator('textarea[name="description"]').fill(description);
  await form.locator('input[name="price"]').fill(price);
  for (const allergen of allergens) {
    await form.locator(`input[name="allergens"][value="${allergen}"]`).check();
  }
  await form.locator('input[name="image"]').setInputFiles(path.resolve(image));
  await form.locator('input[name="sort_order"]').fill(String(sortOrder));
  if (bestSeller) await form.locator('input[name="is_best_seller"]').check();
  await form.locator('button[type="submit"]').click();

  const row = page.locator("#item-list div.flex.flex-col.gap-3 > div").filter({ hasText: name });
  await row.waitFor({ state: "visible", timeout: 10000 });
  console.log(`ADDED_${name}:`, (await row.count()) > 0);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("dialog", (dialog) => dialog.accept());

await addItem(page, {
  name: "Bueno Cookie",
  description: "Bueno-stuffed chocolate chip cookie",
  price: "3.00",
  allergens: ["nuts", "dairy"],
  image: "public/assets/BUENOcookie.png",
  bestSeller: true,
  sortOrder: 1,
});

await addItem(page, {
  name: "Soft Serve",
  description: "Creamy soft serve, any flavor",
  price: "3.00",
  allergens: ["dairy"],
  image: "public/assets/icecreamPump.jpg",
  bestSeller: false,
  sortOrder: 2,
});

await addItem(page, {
  name: "Giant Birthday Cookie",
  description: "Giant personalized birthday cookie, 72h lead time",
  price: "15.00",
  allergens: ["gluten", "dairy", "eggs"],
  image: "public/assets/bigBdayCookie.jpg",
  bestSeller: false,
  sortOrder: 3,
});

await browser.close();
```

Run: `node seed-real-items.mjs`
Expected: `ADDED_Bueno Cookie: true`, `ADDED_Soft Serve: true`, `ADDED_Giant Birthday Cookie: true`.

- [ ] **Step 5: Verify the carousel cycles through all three items**

Save and run this Playwright script (`carousel-verify.mjs`):

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const tray = page.locator("#menu");
const nextButton = page.getByRole("button", { name: "Next cookie" });

const shot1 = await tray.screenshot();
await nextButton.click();
await page.waitForTimeout(300);
const shot2 = await tray.screenshot();
await nextButton.click();
await page.waitForTimeout(300);
await nextButton.click();
await page.waitForTimeout(300);
const shot3 = await tray.screenshot();

console.log("SLIDE_CHANGED_1_TO_2:", !shot1.equals(shot2));
console.log("CYCLED_BACK_TO_1:", shot1.equals(shot3));

await browser.close();
```

Run: `node carousel-verify.mjs`
Expected: `SLIDE_CHANGED_1_TO_2: true`, `CYCLED_BACK_TO_1: true`. The page loads fresh at slide index 0; one "next" click moves to index 1 (shot2, should differ from shot1), and two more clicks (3 total, matching the 3 seeded items) wrap back to index 0 (shot3, should match shot1).

- [ ] **Step 6: Verify `/menu` now shows all three real items**

```bash
curl -s http://localhost:3000/menu -o /c/tmp/keks-menu-final.html -w "%{http_code}\n"
grep -o "Bueno Cookie" /c/tmp/keks-menu-final.html
grep -o "Soft Serve" /c/tmp/keks-menu-final.html
grep -o "Giant Birthday Cookie" /c/tmp/keks-menu-final.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all three greps match.

- [ ] **Step 7: Decide whether to keep or remove the three verification items**

Ask the user: keep "Bueno Cookie" / "Soft Serve" / "Giant Birthday Cookie" as real starter content, or delete them so the menu starts empty for the owner to fill in from scratch. Act on their answer via the admin UI or `execute_sql`.

- [ ] **Step 8: Commit**

```bash
git add components/sections/MenuCarousel.tsx components/sections/Hero.tsx "app/(site)/page.tsx"
git commit -m "Wire homepage carousel to dynamic menu items from Supabase"
```

---

### Task 8: Full-project lint, build, and final visual pass

**Files:** none (verification only)

**Interfaces:**
- Consumes: the completed feature from Tasks 1–7
- Produces: confirmation that lint/build are clean and both public surfaces plus admin look right at desktop and mobile widths

- [ ] **Step 1: Lint and production build**

```bash
pnpm lint
pnpm build
```

Expected: both exit 0. Route list should include `/`, `/menu`, `/admin`, `/_not-found`.

- [ ] **Step 2: Screenshot `/`, `/menu`, and `/admin` at desktop (1440x900) and mobile (375x812)**

Save and run this script (`full-pass-screenshots.mjs`), adapted from the Promo section plan's screenshot pattern:

```js
import { chromium } from "playwright";

const routes = ["/", "/menu", "/admin"];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

const browser = await chromium.launch();

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
    page.on("pageerror", (err) => errors.push(String(err)));

    await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const fileSafeRoute = route === "/" ? "home" : route.replace("/", "");
    await page.screenshot({
      path: `${fileSafeRoute}-${viewport.name}.png`,
      fullPage: true,
    });

    console.log(`${route} @ ${viewport.name} CONSOLE_ERRORS:`, JSON.stringify(errors));
    await page.close();
  }
}

await browser.close();
```

Run: `node full-pass-screenshots.mjs` (from the scratchpad directory, so screenshots land there)
Expected: every `CONSOLE_ERRORS` line prints `[]`. Visually confirm the six screenshots: `/` shows the tray carousel with a real menu item image; `/menu` shows the card grid with images, prices, and allergen text; `/admin` shows the add-item form and the item list.

- [ ] **Step 3: Stop the dev server**

```bash
taskkill //F //IM node.exe //T
```

- [ ] **Step 4: Final commit if anything was adjusted during visual review**

```bash
git status
git add -A
git commit -m "Menu management: polish after visual review"
```

(Skip this step if `git status` shows no changes.)
