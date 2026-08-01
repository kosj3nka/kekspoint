# Hero Crumb-Trail Arrow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "follow the cookie crumbs trail..." caption in the Hero section drift further right at each breakpoint (not just base/`sm`), and add a hand-drawn SVG curved arrow to its left that points up at the "Come To Us" button, positioned so it stays visually connected to both elements across breakpoints.

**Architecture:** Single-file change to [components/sections/Hero.tsx](../../../components/sections/Hero.tsx). No new components, no JS/runtime measurement — pure Tailwind responsive utility classes for both the caption's existing `translate-x` drift and the new arrow's position/rotation, following the pattern already used for the crumb-trail image's own `sm:` overrides.

**Tech Stack:** Next.js 16 / React 19 / Tailwind CSS v4. No test runner in this repo (no Jest/Playwright) — verification is visual, via `next dev`.

## Global Constraints

- No JS-driven dynamic layout measurement between the caption and the button — CSS breakpoints only, per the approved spec (`docs/superpowers/specs/2026-08-01-hero-crumb-arrow-design.md`).
- Arrow color: `text-cream/90` via `stroke="currentColor"`, matching the caption's existing tone (per user's approved choice).
- Arrow style: hand-drawn/doodle look (slightly irregular curve, not a perfect geometric arc), with a small arrowhead (per user's approved choice).
- Do not modify the crumb-trail `<Image>` or the "Order Now!" button.

---

### Task 1: Extend caption drift + add pointer arrow

**Files:**
- Modify: `components/sections/Hero.tsx:24-42` (the `relative` wrapper containing the "Come To Us" button, crumb image, and caption)

**Interfaces:**
- No exported functions/props change — this is a self-contained JSX/markup edit inside the existing `Hero` component.

**Current markup (for reference):**

```tsx
<div className="relative">
  <a
    href="#about"
    className="inline-flex h-10 items-center justify-center rounded-full bg-cream px-4 font-sans text-xs font-bold tracking-wide text-brand-red uppercase transition hover:opacity-90 sm:h-12 sm:px-5 sm:text-sm"
  >
    Come To Us ➤
  </a>
  <Image
    src="/assets/crumbs.png"
    alt=""
    width={80}
    height={80}
    aria-hidden="true"
    className="pointer-events-none absolute top-full -right-10 -mt-6 h-16 w-16 -rotate-90 object-contain sm:-right-12 sm:-mt-8 sm:h-20 sm:w-20"
  />
  <p className="absolute top-full left-1/2 mt-12 w-[170px] -translate-x-[8%] text-center font-sans text-[11px] leading-snug text-cream/90 italic sm:mt-16 sm:translate-x-[10%]">
    follow the cookie crumbs <br /> trail to Papova ul. 2
  </p>
</div>
```

- [ ] **Step 1: Extend the caption's `translate-x` drift across `md`/`lg`/`xl`**

Replace the caption `<p>` element's `className` so the rightward drift keeps increasing at wider breakpoints instead of stopping at `sm`:

```tsx
<p className="absolute top-full left-1/2 mt-12 w-[170px] -translate-x-[8%] text-center font-sans text-[11px] leading-snug text-cream/90 italic sm:mt-16 sm:translate-x-[10%] md:translate-x-[20%] lg:translate-x-[30%] xl:translate-x-[40%]">
  follow the cookie crumbs <br /> trail to Papova ul. 2
</p>
```

- [ ] **Step 2: Add the hand-drawn arrow SVG as a sibling of the caption**

Insert this `<svg>` immediately before the caption `<p>` (still inside the same `relative` wrapper, after the crumb `<Image>`). It's a single hand-drawn-looking curved stroke with an arrowhead, pointing from the caption's top-left area up toward the "Come To Us" button:

```tsx
<svg
  aria-hidden="true"
  viewBox="0 0 60 80"
  className="pointer-events-none absolute top-full left-1/2 h-16 w-12 -translate-x-[170%] translate-y-1 text-cream/90 sm:h-20 sm:w-14 sm:-translate-x-[190%] sm:translate-y-2 md:-translate-x-[230%] md:translate-y-3 lg:-translate-x-[270%] lg:translate-y-4 xl:-translate-x-[310%] xl:translate-y-5"
>
  <path
    d="M46 74C40 60 44 42 34 30C26 20 14 16 8 6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M8 6L15 9.5M8 6L6 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
```

Notes on the path: the curve starts near the caption (bottom, `y=74`) and sweeps up-left to end near the button (top, `y=6`), where the two short strokes form the arrowhead. The `translate-x`/`translate-y` responsive values position the whole SVG so its tail sits just left of the caption text and its head sits near the button at each breakpoint, growing the leftward offset in step with the caption's own increasing `translate-x` from Step 1.

- [ ] **Step 3: Start the dev server and visually verify**

Run: `npm run dev`

Open the site (default `http://localhost:3000`) and check the Hero section at each breakpoint using browser devtools responsive mode (or manual window resizing): base/mobile width, `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px). At every width confirm:
- The caption text sits further right than at the previous breakpoint.
- The arrow's tail is just left of the caption text and its head/arrowhead points up toward the "Come To Us" button, without overlapping the button or drifting off to disconnect visually from either element.

If the arrow drifts noticeably off-target at any breakpoint, adjust that breakpoint's `-translate-x-[...]`/`translate-y-*` values on the `<svg>` (Step 2) — these are hand-tuned decorative offsets, not computed values, so iterate directly against what's visible in the browser.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "Hero: extend crumb caption drift and add pointer arrow to Come To Us button"
```
