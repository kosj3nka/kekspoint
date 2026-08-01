# Delivery services popup — design

## Problem

The Hero "Order Now!" button links to `#order`, which scrolls to an empty `OrderForm` placeholder section. KeksPoint doesn't take orders directly on the site — it's ordered through third-party delivery apps. The button should instead open a popup listing the delivery platforms KeksPoint is actually on, with their logos, linking out to KeksPoint's real store page on each.

## Confirmed delivery platforms

Verified via web search that KeksPoint has live store pages on:
- **Wolt** — https://wolt.com/en/hrv/zagreb/venue/keks-point
- **Glovo** — https://glovoapp.com/en/hr/zagreb/stores/keks-point-zag

Bolt Food has no findable KeksPoint listing — excluded per user decision (can be added later if they list there).

## Component

New client component: `components/sections/DeliveryPopup.tsx`

- Owns its own `useState` open/closed state; no new dependency.
- Renders the "Order Now!" trigger button itself (replaces the current `<a href="#order">` in `Hero.tsx`) and the modal, so `Hero.tsx` stays a server component.
- Modal: heading "Order for delivery", two link-cards (Wolt, Glovo) — each shows the platform's logo + name and is an `<a target="_blank" rel="noreferrer">` to its store URL above.
- Close via: × button, Escape key, backdrop click.
- Styled with existing Tailwind tokens (`bg-cream`, `text-brand-red`, `font-sans`/`font-display`) to match the rest of the site.
- Basic accessibility: `role="dialog"`, `aria-modal="true"`, `aria-label`, focus moves to the dialog on open.

## Assets

Downloaded to `public/assets/delivery/`:
- `wolt.png` — official Wolt app icon (Wikimedia Commons, `Wolt-app-icon-2019.png`)
- `glovo.svg` — official Glovo mark (Simple Icons, recolored to Glovo's brand yellow `#FFC244`)

## Out of scope

- No functional order form / checkout — links only take the user to the delivery app.
- No changes to `BirthdayCookie.tsx`'s "Order Yours" CTA (stays as-is, pickup only).
- Bolt Food is not included.
