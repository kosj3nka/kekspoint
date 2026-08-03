# Admin panel restructure — design

## Problem

`/admin` currently shows the "Add item" form first, then a flat list of all
menu items (active and inactive mixed together) with checkbox toggles for
Active/Best Seller. This buries the actual list of live items and gives no
visual distinction between live and archived (inactive) items.

## Goal

- Land on `/admin` and see the list of live items first, archived items below
  (faded), with the add-item form tucked behind a button.
- Give each live item Edit / Delete / Archive actions as icon buttons.
- Give each archived item Edit / Delete / Restore actions.

## Design

### Layout (`app/admin/page.tsx`)

- Header row: title + "Add item" button (client-side toggle).
- The `MenuItemForm` (create mode) renders only when the button has been
  clicked, and hides again once the item is saved or the user collapses it.
- Items are split into two groups using the existing `item.isActive` flag:
  - **Live** (`isActive === true`) — rendered first, normal styling.
  - **Archived** (`isActive === false`) — rendered in a second section titled
    "Archived", wrapped in reduced-opacity styling (`opacity-50` or similar)
    to read as de-emphasized.
- No new data fetching — `getAllMenuItemsForAdmin()` already returns all rows;
  the split happens client/server-side by filtering the existing array.

### No schema change

`is_active` already exists and already gates the public menu
(`getActiveMenuItems` filters `is_active = true`). Archiving an item is
exactly "set `is_active` to false"; restoring is "set it back to true". The
existing `toggleMenuItemField(id, "is_active", value)` server action covers
both — no new action needed.

### Row actions (`app/admin/MenuItemRow.tsx`)

Replace the current "Active" checkbox with icon-button actions. Best Seller
checkbox stays as-is.

- **Live item row**: Edit (pencil icon), Delete (trash icon), Archive (box
  icon).
  - Edit: unchanged behavior — swaps the row for `MenuItemForm` in edit mode.
  - Delete: `confirm("Delete \"<name>\"? This can't be undone.")` → calls
    `deleteMenuItem`.
  - Archive: `confirm("Archive \"<name>\"? You can restore it later from the
    archived list.")` → calls `toggleMenuItemField(id, "is_active", false)`.
- **Archived item row**: Edit, Delete, Restore (undo/refresh icon).
  - Restore: no confirmation (non-destructive) → calls
    `toggleMenuItemField(id, "is_active", true)`.

Icons are small inline SVGs (`currentColor`, ~18px) since no icon library is
installed in this repo — consistent with the rest of the codebase using plain
SVG assets rather than an icon package.

### Out of scope

- No changes to `actions.ts` or the database schema.
- No changes to the create/edit form fields themselves.
- No changes to the public-facing menu page.
