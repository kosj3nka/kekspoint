# KeksPoint — Website Plan & Tech Stack

*A dynamic, editorial, fully self-manageable website for Zagreb's cult cookie shop.*

---

## 1. Who KeksPoint is (research summary)

Everything below is pulled from press coverage and the shop's own Instagram, so the copy on the site can be grounded in their real voice.

KeksPoint is a Zagreb address specialized exclusively in freshly baked American-style cookies — "crispy on the outside, soft on the inside, and richly filled," with an appearance that tempts before the first bite. The concept is led by young entrepreneur **Marija Petrović**, who turned a passion for baking into one of the city's most-loved sweet spots. The shop recently celebrated its first birthday and is widely credited with popularizing American cookies in Zagreb.

**The essentials**
- **Location:** Papova ulica 2, Zagreb
- **Hours:** Monday–Sunday, 10:00–23:00
- **Price:** ~€3 per cookie — "each one like a mini dessert in itself: perfect as a gift, a break during the day, or a sweet treat after a walk through the city."
- **Delivery:** Wolt, Glovo, Bolt

**The menu (10 flavors):** Nutella Classic, Almond Croissant, Choco, Dubai, Oreo, Bueno, Carrot Cake, Lotus, Red Velvet, Pistachio–White Chocolate.

**Two signature offerings to feature prominently**
- **Cookies with ice cream** — "pick any cookie from the menu and pair it with a scoop." Warm, freshly baked cookie + cold ice cream; a summer hit.
- **Giant personalized birthday cookies** — big cookies for celebrations, birthdays, and special occasions, "available to order at least 72 hours in advance," with flavors and personalization arranged directly with the team, picked up in-store. This is the birthday-cake alternative and gets its own section + order form.

**Sources:** [Fashion.hr](https://fashion.hr/lifestyle/keksi-sa-sladoledom-stigli-su-u-zagreb-a-tu-su-i-gigantske-verzije-keksa-za-posebne-prilike/) · [Grazia](https://grazia.hr/keks-point/) · [Journal.hr](https://www.journal.hr/lifestyle/gastro/keks-point-zagreb/) · [Jolie.hr](https://jolie.hr/gastro/jolie-apetite/nova-gastro-adresa-u-zagrebu-na-kojoj-mozete-kusati-najfinije-americke-keksice/) · [Instagram @kekspoint.hr](https://www.instagram.com/kekspoint.hr/)

---

## 2. Recommended tech stack

The site needs to feel editorial and dynamic on the front, but also be **fully manageable by the owner** (menu, best sellers, promo, orders) without touching code. That points to a modern React framework plus a lightweight backend-as-a-service.

| Layer | Choice | Why |
|---|---|---|
| **Framework** | **Next.js (React) + TypeScript** | Best-in-class for a video hero, image optimization, SEO/social sharing, and mixing a marketing site with an admin app in one project. |
| **Styling** | **Tailwind CSS** | Fast, consistent design system; trivial to encode the dark-red + cream palette and the white-grid background as reusable tokens. |
| **Animation** | **Framer Motion** | Powers the cookie carousel (drag + arrows), scroll-reveal editorial transitions, and micro-interactions. |
| **Backend / DB / Auth / Storage** | **Supabase** (Postgres + Auth + Storage) | One service covers the admin: database for menu/promo/orders, login for the admin panel, and file storage for cookie PNGs and promo media. A Supabase connection is already available in this workspace. |
| **Email notifications** | **Resend** | Sends each birthday-cookie request to the shop's inbox instantly. |
| **Hosting** | **Vercel** | One-click deploy for Next.js, fast global CDN, free tier is plenty for this traffic. Custom domain (kekspoint.hr) points here. |

**Why not a website builder (Wix/Squarespace)?** Those can't do the custom tray carousel, the conditional promo logic, or a tailored admin cleanly — and the editorial feel you want would fight the templates. **Why not full e-commerce (Shopify)?** You chose request-form orders with no online payment, and daily cookies already sell via Wolt/Glovo/Bolt, so a checkout/cart engine is overkill and adds fees.

---

## 3. Design system

**Palette**
- Dark red (brand primary) — deep, warm burgundy, used for large editorial bands and the footer.
- Creamy white (background/base) — soft off-white, the default page background.
- Accent: warm gold/caramel for "Best Seller" badges and small highlights.

**The grid background** — the subtle white grid is used as a signature texture *on the dark-red bands* (hero overlay edges, promo section, birthday section, footer). Cream sections stay clean and airy for contrast. This keeps the grid feeling special, not constant.

**Typography** — an editorial pairing: a characterful **display serif** for headlines (magazine feel) + a clean **sans-serif** for body and UI. Large type, generous whitespace, confident section headers.

**Motion & texture** — scroll-reveal on section entry, parallax on hero, `crumbs.png` used as a playful decorative scatter between sections, hover lift on cookies. Everything smooth and restrained so it reads premium, not busy.

**Responsive** — mobile-first. The vertical hero video is ideal for phones; the carousel becomes swipeable; nav collapses to a menu.

---

## 4. Page structure (top to bottom)

1. **Sticky navigation** — logo (`logo.png`), section links (Menu, About, Birthday Cookie, Visit), and a standout "Order a Birthday Cookie" button. Transparent over the hero, solid on scroll.

2. **Hero** — full-screen **`cookieTimelapse.mp4`** (muted, autoplay, loop; vertical so it fills mobile beautifully). Overlaid tagline + short line + scroll cue. Poster image (`2heroBackground.png`) shows while the video loads.

3. **Menu carousel** — the centerpiece. Cookie PNGs sit on **`tray.png`**; left/right **arrows** (and swipe/drag) rotate through them. Each cookie pulls from the menu database and shows name, short description, and price; **"Best Seller"** badge appears on flagged items. A short line invites the ice-cream pairing. Cookie images (e.g. `BUENOcookie.png`, `bagCookies.png`) are managed in the admin.

4. **Promo section** *(conditional)* — appears right after the tray **only when turned on in the admin**. Heading + text + one image or video, for seasonal offers. When off, it's hidden entirely and the page flows straight to the next section.

5. **"The best way to eat it"** — editorial band built around **`bestWayToEat.jpg`**, describing the warm-cookie-and-ice-cream ritual and how to enjoy them fresh.

6. **About us** — the KeksPoint story (Marija Petrović, first birthday, popularizing American cookies in Zagreb) with `aboutUs.jpg` / `worker.jpg` / `shop.jpg`. Warm, personal, editorial.

7. **Birthday giant cookie** — bold feature section on the dark-red grid background using **`bigBdayCookie.jpg`** (support: `blowingWish.mp4`). Explains the giant cookie as a birthday-cake alternative, the 72-hour lead time, and a prominent **"Order Yours" button** that opens the request form.

8. **Order request form** — modal/section: name, email, phone, cookie type/flavor, size, pickup date (enforces 72h+ ahead), and a personalization message. On submit it saves to the database *and* emails the shop. Confirmation message shown to the customer.

9. **Footer** — address (Papova ulica 2), hours (10:00–23:00 daily), an embedded map, delivery buttons (Wolt / Glovo / Bolt), Instagram link, and quick nav.

---

## 5. Admin panel (self-service)

A login-protected dashboard at `/admin` (Supabase Auth). No code needed to run the site day to day.

- **Menu manager** — add / edit / remove cookies; fields for name, description, price, photo (upload PNG), category, and sort order; toggle **active** (show/hide) and **Best Seller** per item. This is what the front-page carousel reads from.
- **Promo control** — one switch to turn the promo section on/off, plus fields for heading, text, a call-to-action, and an image *or* video upload. Turning it off hides the section site-wide.
- **Orders inbox** — every birthday-cookie request in a table (name, contact, flavor, size, pickup date, message, submitted time) with status labels (New / Confirmed / Done) so nothing gets lost.
- **Optional site settings** — hours, address, delivery links, and hero tagline editable without a deploy.

---

## 6. Data model (Supabase)

- **menu_items** — `id, name, description, price, image_url, category, is_best_seller, is_active, sort_order, created_at`
- **promo** — `id, is_active, heading, body_text, media_url, media_type (image|video), cta_label, cta_link, updated_at`
- **orders** — `id, name, email, phone, cookie_flavor, size, pickup_date, message, status, created_at`
- **site_settings** — `id, hours, address, map_embed, wolt_url, glovo_url, bolt_url, hero_tagline`

Cookie PNGs and promo media live in **Supabase Storage**; the tables store their URLs.

---

## 7. Full feature checklist

**Front-end**
- Autoplay/muted/looping vertical hero video with graceful poster fallback
- Dynamic cookie carousel on the tray (arrows + swipe/drag), driven by the database
- "Best Seller" badges from admin flags
- Conditional seasonal promo section
- Editorial scroll animations, parallax hero, crumb decorations
- Birthday-cookie feature + order request form with 72h date validation
- Fully responsive / mobile-first
- Embedded map, delivery-app links, Instagram link
- SEO meta + Open Graph/social preview images, favicon
- Fast image optimization and lazy loading
- Accessibility (alt text, keyboard nav, captions/controls consideration for video)
- Cookie/GDPR consent note (EU) — light banner

**Back-end / admin**
- Secure admin login
- Full menu CRUD with image upload
- Best-seller toggle
- Promo on/off + content editor with media upload
- Orders inbox with statuses
- Email notification on every new order
- Editable site settings

---

## 8. Asset mapping

Confirmed in your `assets` folder and where each is used:

- **Hero:** `cookieTimelapse.mp4` (video), `2heroBackground.png` (poster)
- **Carousel:** `tray.png` + cookie PNGs (`BUENOcookie.png`, `bagCookies.png`, `heroBox.png`, `crumbs.png` for decoration) — plus new cookie PNGs added via admin
- **Best way to eat:** `bestWayToEat.jpg`, support `cookieMoment.mp4`, `eatingCookie.jpg`
- **About:** `aboutUs.jpg`, `worker.jpg`, `shop.jpg`, `cookieHeads.jpg`
- **Birthday cookie:** `bigBdayCookie.jpg`, `blowingWish.mp4`
- **Gallery/atmosphere (optional strip):** `picnicCookies.jpg`, `beachCookie.jpg`, `giftBoxes.jpg`, `inBag.jpg`, `3cookies.jpg`, `naredani.jpg`, `cookieRows.jfif`, `cookieHead.jpg`
- **Branding:** `logo.png`

*Note: `cookieRows.jfif` should be converted to `.jpg/.webp` for browser support; all large images will be optimized to WebP during the build.*

---

## 9. Build phases (once you approve)

1. **Foundation** — Next.js + Tailwind project, design tokens (colors, grid, fonts), layout shell, nav + footer.
2. **Static editorial sections** — hero, best-way-to-eat, about, birthday section with real copy and assets.
3. **Supabase setup** — tables, storage buckets, auth.
4. **Dynamic front-end** — carousel wired to the menu, conditional promo, order form saving to DB + email.
5. **Admin panel** — login, menu CRUD, promo control, orders inbox, settings.
6. **Polish & QA** — animations, responsive passes, SEO/OG, accessibility, performance, cross-device testing.
7. **Deploy** — Vercel + connect the kekspoint.hr domain.

---

## 10. Open questions before building

- **Domain:** is `kekspoint.hr` already registered, and do you have access to point it at the new site?
- **Order email:** which inbox should birthday-cookie requests go to?
- **Best sellers:** which of the 10 flavors are your current best sellers (so the carousel launches correctly)?
- **Cookie PNGs:** do you have transparent PNGs for all 10 flavors, or just some for now?
