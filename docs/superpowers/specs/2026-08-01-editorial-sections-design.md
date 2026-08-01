# KeksPoint — Phase 2: Static Editorial Sections — Design

**Status:** Approved
**Scope:** Second sub-project of the KeksPoint website build (see `KeksPoint_Website_Plan.md` section 9, "Build phases"). Covers real copy and imagery for the Hero, BestWayToEat, AboutUs, and BirthdayCookie sections only. MenuCarousel, Promo, and OrderForm stay as the Phase 1 placeholders — they need Supabase/dynamic data, which is Phase 3+.

## Goal

Replace four of Phase 1's static placeholder sections with real, on-brand editorial content (copy + imagery + video) so the homepage reads as a finished marketing page for those sections, while the sections that need a data layer stay deferred.

## Out of scope

- MenuCarousel, Promo, OrderForm internals (still Phase 1 placeholders)
- Framer Motion, scroll-reveal, parallax, or any animation — explicitly deferred to the later "Polish & QA" phase (section 9 of the master plan) so motion gets tuned across the whole site in one pass, not piecemeal
- Supabase, admin panel, dynamic data
- Order form submission logic (the BirthdayCookie CTA anchor-links to the existing `#order` placeholder; it does not submit anywhere yet)

## Sections

### Hero (`components/sections/Hero.tsx`)

Full-screen video hero, replacing the current flat-color placeholder.

- Background: `cookieTimelapse.mp4`, `muted autoPlay loop playsInline`, full-bleed (`h-screen`, `object-cover`)
- Poster/fallback: `3cookies.jpg` (shows while video loads, and if video fails to load)
- Overlay (centered, over a dark gradient scrim for legibility against the video):
  - Headline (`font-display`): "KeksPoint"
  - Tagline (`font-sans`): "Crispy outside, soft inside"
- Static scroll-cue (down-chevron icon) near the bottom of the viewport — no animation, just present

### BestWayToEat (`components/sections/BestWayToEat.tsx`)

Split-panel, cream background, image on the left.

- Primary image: `bestWayToEat.jpg`, left panel
- Inset accent: `eatingCookie.jpg`, small image overlapping the primary image's bottom-right corner
- Right panel: heading only (`font-display`), no body copy — "The Best Way to Eat It"

### AboutUs (`components/sections/AboutUs.tsx`)

Split-panel, cream background, flipped from BestWayToEat — text on the left, images on the right (alternating rhythm).

- Left panel: heading ("About Us") + body copy:
  > "KeksPoint started with one simple idea: bring real American-style cookies to Zagreb. Founder Marija Petrović turned a love of baking into one of the city's most-loved sweet spots — and just celebrated the shop's first birthday. Every cookie is baked fresh in-house, the same way, every day: crispy outside, soft inside, and always richly filled. Come find us on Papova ulica 2, open daily from 10:00 to 23:00."
- Right panel: `aboutUs.jpg` primary + `worker.jpg`/`shop.jpg` as a small stacked inset pair

### BirthdayCookie (`components/sections/BirthdayCookie.tsx`)

Split-panel, burgundy `bg-grid` background (unchanged from Phase 1 placeholder), image on the left.

- Primary image: `bigBdayCookie.jpg`, left panel
- Inset accent: `blowingWish.mp4`, small looping muted video overlapping the primary image's corner
- Right panel: heading ("Giant Birthday Cookie") + body copy:
  > "Skip the cake. Our giant personalized birthday cookies are the KeksPoint way to celebrate — order at least 72 hours ahead and we'll work out the flavor and personalization with you directly, ready for pickup in-store."
- CTA button: "Order Yours" — anchor-links to `#order` (scrolls to the existing OrderForm placeholder; not a functional submission yet)

## Technical approach

- **Images:** `next/image` with `fill` inside explicitly sized/positioned containers, for responsive cropping. Every image gets descriptive `alt` text (these are content images, not decorative).
- **Video:** native `<video>` tags, `muted autoPlay loop playsInline`. Hero's `<video>` gets `poster="/assets/3cookies.jpg"`. The `blowingWish.mp4` accent video doesn't need a poster — it's small and loads fast.
- **Layout:** split-panel sections use `flex-col md:flex-row` (or the Tailwind v4 equivalent) so image and text stack vertically on mobile and sit side-by-side from `md:` up. Inset accents scale down proportionally on mobile rather than disappearing.
- **Tokens:** reuse existing Phase 1 tokens only (`brand-red`, `cream`, `gold`, `font-display`, `font-sans`, `bg-grid`) — no new design tokens needed.
- **No new dependencies** — no Framer Motion, no additional npm packages.

## Verification

Same pattern as Phase 1:

- `pnpm dev` + `curl`/`grep` per task, checking that expected heading/copy text is present in the rendered HTML for each section
- Headless-Chromium screenshots (desktop ~1440px and mobile ~375px) to visually confirm: video hero renders with overlay text and scroll cue, split-panel alternation reads correctly (image-left then text-left), insets are positioned and sized sensibly, burgundy grid texture is still confined to BirthdayCookie (and Hero/Footer from Phase 1), and nothing overflows or breaks at mobile width
- Check browser console for errors on both viewports
