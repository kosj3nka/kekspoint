# KeksPoint — Phase 1: Foundation — Design

**Status:** Approved
**Scope:** First sub-project of the KeksPoint website build (see `KeksPoint_Website_Plan.md` section 9, "Build phases"). Covers project scaffold, design tokens, and static layout shell only. No dynamic data, no Supabase, no admin panel, no real section content — those are later phases, each with their own spec.

## Goal

Stand up a Next.js project with the correct visual language (colors, type, grid texture) and a static nav/footer shell, so Phase 2 (static editorial sections) has a solid, on-brand base to build into.

## Decisions

- **Package manager:** pnpm
- **Framework:** Next.js 15, App Router, TypeScript, Tailwind CSS v4
- **Project root:** `c:\Users\korisnik\Gita\AkeksPoint` (this folder becomes the app root; `assets/` and the plan doc stay alongside app code)
- **Fonts:** Playfair Display (display serif, headlines) + Inter (sans, body/UI), loaded via `next/font/google`
- **Brand colors:** dark red `#7A1F2B` (burgundy), a cream base, and a gold/caramel accent for "Best Seller" badges — exact cream/gold hex chosen to complement the burgundy, adjustable after visual review
- **Supabase:** new project will be created in a later phase (Phase 3), not needed for Foundation
- **Version control:** git initialized in the project root; specs live in `docs/superpowers/specs/`

## Architecture

Single Next.js app (not a monorepo) — a Turborepo split between marketing/admin apps would be premature for a single small-business site. Route groups separate concerns within the one app:

```
app/
  layout.tsx        — root layout: font setup, <html>, base metadata
  globals.css        — Tailwind + a custom grid-texture utility class
  (site)/
    page.tsx          — homepage, stacks section placeholders top-to-bottom
components/
  layout/
    Navbar.tsx         — sticky nav; transparent over hero, solid on scroll; anchor links + "Order a Birthday Cookie" CTA
    Footer.tsx         — address/hours/delivery links/Instagram (hardcoded values for now; moves to a site_settings table in the admin-panel phase)
  sections/          — empty placeholder components, one per plan section (Hero, MenuCarousel, Promo, BestWayToEat, AboutUs, BirthdayCookie, OrderForm) — wired up with real content in Phase 2
public/
  assets/            — cookie PNGs/JPGs/MP4s copied here from the top-level assets/ folder, since Next.js only serves static files out of public/
```

## Design tokens

Tailwind theme extension with named tokens (`brand-red`, `cream`, `gold`) rather than raw hex scattered through components, so later phases (and the admin panel) stay consistent. A grid-texture utility class is defined once and applied only to dark-red bands (hero overlay edge, footer) — cream sections stay plain, per the plan's "special, not constant" rule.

## What's out of scope for this phase

- No Supabase connection, auth, or data fetching
- No real section copy/imagery beyond what's needed to prove the shell renders correctly (nav, footer, page background)
- No animations/scroll-reveal (Phase 2+)
- No admin routes beyond a reserved, empty `app/admin/` folder

## Verification

No unit tests apply to a static scaffold. Verification is manual: run `pnpm dev`, confirm fonts/colors/grid texture render correctly, and check the nav/footer at mobile and desktop breakpoints.
