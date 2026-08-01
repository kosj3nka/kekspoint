# KeksPoint — Promo Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `Promo.tsx` "Seasonal Promo" title placeholder with a full-width, image-led promo section (1-3 pictures, one row on desktop, auto-cycling on mobile) with a heading + subline overlaid on top, per `docs/superpowers/specs/2026-08-01-promo-section-design.md`.

**Architecture:** `components/sections/Promo.tsx` becomes a client component (needed for the mobile auto-cycle timer). Data (`PROMO_IMAGES`, `PROMO_HEADING`, `PROMO_SUBLINE`) is a hardcoded module-level const, shaped to match the future admin-editable `promo`/`promo_images` tables so it's a drop-in swap later. `app/(site)/page.tsx`'s import and render position (`<Promo />` right after `<Hero />`, which contains `MenuCarousel`) are unchanged.

**Tech Stack:** Next.js App Router (unchanged) · `next/image` with `fill` for all images · React `useState`/`useEffect` for the mobile crossfade timer (no new dependencies) · Tailwind CSS v4 utility classes only (existing tokens: `brand-red`, `cream`, `font-display`, `font-sans`)

## Global Constraints

- No new npm packages
- Every image uses `next/image` with `fill` inside a `relative`-positioned container, plus a `sizes` prop and descriptive `alt` text
- Full-bleed section: no `max-w`/`mx-auto` container around the pictures (breaks from the split-panel pattern used elsewhere) — pictures run edge-to-edge
- Desktop (`sm:` and up): all configured images in one flex row, equal width, fixed-height band, `object-cover`
- Mobile (below `sm:`): single image at a time, `aspect-[3/4]`, auto-crossfades every 5000ms, no manual controls (no arrows/dots)
- Heading + subline is one shared block, centered via `absolute inset-0 flex flex-col items-center justify-center`, identical on both breakpoints
- Text sits over a dark gradient scrim (`bg-linear-to-t from-black/60 via-black/10 to-transparent`), text color `text-cream`
- Copy is exact: heading `"Soft serve with your favorite flavor"`, subline `"Cookie serving made for hot summer days"`
- Dev server: `pnpm dev`, stop with `taskkill //F //IM node.exe //T` (Windows/Git Bash environment)

---

### Task 1: Copy the two missing promo images into `public/assets`

**Files:**
- Create: `public/assets/icecreamPump.jpg` (copied from `assets/icecreamPump.jpg`)
- Create: `public/assets/eatingIcecreamCookie.jpg` (copied from `assets/eatingIcecreamCookie.jpg`)

**Interfaces:**
- Consumes: `assets/icecreamPump.jpg`, `assets/eatingIcecreamCookie.jpg` (already present in the repo's root source-asset folder)
- Produces: both files served at `/assets/icecreamPump.jpg` and `/assets/eatingIcecreamCookie.jpg` (Next.js serves everything under `public/` from `/`), for Task 2 to reference. `public/assets/beachCookie.jpg` already exists — no copy needed for it.

- [ ] **Step 1: Copy the files**

```bash
cp assets/icecreamPump.jpg public/assets/icecreamPump.jpg
cp assets/eatingIcecreamCookie.jpg public/assets/eatingIcecreamCookie.jpg
```

- [ ] **Step 2: Verify both files exist in `public/assets` and are non-empty**

```bash
ls -la public/assets/icecreamPump.jpg public/assets/eatingIcecreamCookie.jpg public/assets/beachCookie.jpg
```

Expected: all three files listed with a non-zero size.

- [ ] **Step 3: Commit**

```bash
git add public/assets/icecreamPump.jpg public/assets/eatingIcecreamCookie.jpg
git commit -m "Add ice cream promo images to public assets"
```

---

### Task 2: Rebuild Promo — full-width row/cycle layout with overlay text

**Files:**
- Modify: `components/sections/Promo.tsx` (full replace)

**Interfaces:**
- Consumes: `bg-linear-to-t`/`text-cream`/`font-display`/`font-sans` tokens (Phase 1); `/assets/beachCookie.jpg`, `/assets/icecreamPump.jpg`, `/assets/eatingIcecreamCookie.jpg` (Task 1)
- Produces: `export default function Promo()` — same zero-prop signature and `id="promo"`, no change to how `app/(site)/page.tsx` imports/renders it

- [ ] **Step 1: Replace the component**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PromoImage = { id: string; src: string; alt: string };

// Placeholder data — swap for an admin/DB-backed fetch once the promo table exists.
const PROMO_IMAGES: PromoImage[] = [
  {
    id: "beach",
    src: "/assets/beachCookie.jpg",
    alt: "A KeksPoint cookie enjoyed outdoors on a sunny summer day",
  },
  {
    id: "pump",
    src: "/assets/icecreamPump.jpg",
    alt: "Soft serve ice cream being swirled onto a fresh KeksPoint cookie",
  },
  {
    id: "eating",
    src: "/assets/eatingIcecreamCookie.jpg",
    alt: "Someone biting into a KeksPoint cookie topped with ice cream",
  },
];

const PROMO_HEADING = "Soft serve with your favorite flavor";
const PROMO_SUBLINE = "Cookie serving made for hot summer days";

const CYCLE_MS = 5000;

export default function Promo() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (PROMO_IMAGES.length < 2) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % PROMO_IMAGES.length);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="promo" className="relative w-full overflow-hidden">
      <div className="hidden sm:flex sm:h-[420px] sm:w-full">
        {PROMO_IMAGES.map((image) => (
          <div key={image.id} className="relative h-full flex-1">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={`${Math.ceil(100 / PROMO_IMAGES.length)}vw`}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="relative aspect-[3/4] w-full sm:hidden">
        {PROMO_IMAGES.map((image, index) => (
          <Image
            key={image.id}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-cream">
        <h2 className="font-display text-3xl sm:text-4xl">{PROMO_HEADING}</h2>
        <p className="font-sans text-sm sm:text-base">{PROMO_SUBLINE}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the section renders with the heading, subline, and all three image sources**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/ -o /c/tmp/keks-home.html -w "%{http_code}\n"
grep -o "Soft serve with your favorite flavor" /c/tmp/keks-home.html
grep -o "Cookie serving made for hot summer days" /c/tmp/keks-home.html
grep -o "beachCookie.jpg" /c/tmp/keks-home.html
grep -o "icecreamPump.jpg" /c/tmp/keks-home.html
grep -o "eatingIcecreamCookie.jpg" /c/tmp/keks-home.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all five greps print a match.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Promo.tsx
git commit -m "Promo: full-width image row/cycle layout with heading and subline overlay"
```

---

### Task 3: Full-page lint, build, and visual verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the completed Promo section from Tasks 1–2
- Produces: confirmation that the section is done, lint/build are clean, and it looks right at desktop and mobile widths, including the mobile auto-cycle actually changing images over time

- [ ] **Step 1: Lint and production build**

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0 with no errors. The build's route list should still show `/`, `/_not-found`, and `/admin`.

- [ ] **Step 2: Screenshot at desktop and mobile widths, check for console errors**

Use Playwright (already available via `npx playwright`) to drive a headless Chromium against the dev server, matching the approach used in the Phase 2 plan's Task 5. Start the dev server, poll until it responds, then run a script like:

```js
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000/";
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);
const outPath = process.argv[5] ?? "screenshot.png";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });

const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: outPath, fullPage: true });

console.log("CONSOLE_ERRORS:", JSON.stringify(errors));
await browser.close();
```

Run it at 1440x900 and at 375x812, saving screenshots to the scratchpad directory. Visually confirm:
- Desktop: three images fill one full-width row directly below MenuCarousel/the tray, heading + subline centered and readable over the gradient scrim
- Mobile: a single 3:4 image fills the width, same heading + subline overlaid and readable
- No entries in `CONSOLE_ERRORS` at either width

- [ ] **Step 3: Confirm the mobile image actually cycles**

With the dev server still running, take a mobile screenshot (375x812) to `promo-mobile-1.png` in the scratchpad directory, wait 6 seconds, then take a second mobile screenshot to `promo-mobile-2.png` (reuse the script from Step 2, called twice with a `sleep 6` between calls). Compare the two: the visible promo image should differ between the two screenshots (index advanced from the initial image to the next one in `PROMO_IMAGES`).

- [ ] **Step 4: Stop the dev server**

```bash
taskkill //F //IM node.exe //T
```

- [ ] **Step 5: Final commit if anything was adjusted during visual review**

```bash
git status
git add -A
git commit -m "Promo section polish after visual review"
```

(Skip this step if `git status` shows no changes.)
