# KeksPoint — Menu Card Details (Wolt/Glovo links + expand-to-detail) — Design

**Status:** Approved
**Scope:** Sub-project of the menu management work (see `2026-08-02-menu-management-design.md`). Changes the public `/menu` card grid to show only name + price by default, adds an expand-in-place detail view, and adds Wolt/Glovo order links as new owner-editable fields.

## Goal

Keep the `/menu` grid scannable (name + price only) while letting a shopper click a card to see its description, allergens, and direct order links (Wolt/Glovo) without leaving the page. Let the owner input those two order links from `/admin`, alongside the existing fields.

## Out of scope

- Additional/multiple photos per item — considered and explicitly rejected; each item keeps its single `image_url`.
- Homepage `MenuCarousel` — unaffected. It doesn't use `MenuCard` and keeps its current single-slide behavior.
- Admin auth, RLS changes — unaffected; new columns are covered by the same service-role mutation path as existing fields.
- URL format validation beyond the browser's native `type="url"` input — Wolt/Glovo links are stored as plain optional text.

## Data model (Supabase)

Add two nullable columns to the existing `menu_items` table:

```sql
alter table menu_items
  add column wolt_url text,
  add column glovo_url text;
```

- `lib/menu.ts`: `MenuItem` gains `woltUrl: string | null` and `glovoUrl: string | null`; `MenuItemRow` gains `wolt_url`/`glovo_url`; `MENU_ITEM_COLUMNS` and `mapMenuItemRow` updated accordingly.
- No RLS changes needed — same `anon` read / service-role write pattern as every other column.

## Admin (`/admin`)

- `MenuItemForm.tsx`: two new optional fields, "Wolt link" and "Glovo link" (`type="url"`, not required), placed after the Photo field and before Sort order.
- `actions.ts` (`saveMenuItem`): reads `wolt_url`/`glovo_url` from `formData`, trims, stores `null` if blank (same pattern as `description`).
- `MenuItemRow.tsx` (admin list): no change — the compact list row doesn't need to surface these links.

## Public `/menu` page — expand-in-place

Today `MenuCard` always renders full details (photo, name, price, description, allergens) and `app/(site)/menu/page.tsx` maps over items directly in a server component. This changes to:

- **New `components/menu/MenuGrid.tsx` (client component):** owns `expandedId` state (at most one item expanded at a time). Renders the grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6`) and maps items to `MenuCard`, passing `expanded={item.id === expandedId}` and `onToggle`.
- `app/(site)/menu/page.tsx` becomes: fetch items server-side (unchanged), render `<MenuGrid items={items} />` instead of mapping `MenuCard` directly.
- **`MenuCard.tsx` rewritten** to take `expanded`/`onToggle` props:
  - Collapsed (default): photo, name, price, Best Seller badge only — same visual style as today minus description/allergens.
  - Expanded: card grows to `col-span-2` (eating the next grid slot; grid reflows the remaining cards naturally, no manual reflow logic needed). Layout splits into two halves: left keeps photo/name/price, right shows description, allergens, and order buttons.
  - Order buttons: "Order on Wolt" links to `woltUrl`, "Order on Glovo" links to `glovoUrl` (`target="_blank" rel="noopener noreferrer"`), each rendered only when that URL is non-null. If both are null, no buttons render (no empty row).
  - Clicking anywhere on a collapsed card calls `onToggle` (expands it, collapsing any previously-expanded card since only one `expandedId` exists). Clicking the expanded card's collapsed-content half (photo/name/price side) or a small close (×) control collapses it back to `expandedId = null`.

## Error handling

- Same as existing menu management: Server Action returns `{ error }` on failure; no new failure modes introduced (URL fields have no server-side validation beyond trimming).

## Testing / verification

- `pnpm dev`; in `/admin`, add/edit an item setting only a Wolt link, only a Glovo link, both, and neither — confirm each renders the right button combination on `/menu`.
- On `/menu`, click a card and confirm it expands to 2 columns with the correct sibling reflow at each breakpoint (2-col mobile, 3-col sm, 4-col lg); click it again (or another card) and confirm collapse/switch behavior.
- Confirm collapsed cards show no description/allergen text.
- Check browser console for errors on desktop and mobile viewports.
