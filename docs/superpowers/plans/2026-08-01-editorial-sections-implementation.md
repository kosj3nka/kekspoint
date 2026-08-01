# KeksPoint Phase 2: Static Editorial Sections — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hero, BestWayToEat, AboutUs, and BirthdayCookie placeholder components with real copy, imagery, and video, so those four sections of the homepage read as finished editorial content. MenuCarousel, Promo, and OrderForm stay untouched as Phase 1 placeholders.

**Architecture:** Edit the four existing zero-prop section components in place (`components/sections/Hero.tsx`, `BestWayToEat.tsx`, `AboutUs.tsx`, `BirthdayCookie.tsx`). Each keeps its existing `export default function` signature and `id` attribute (consumed by `app/(site)/page.tsx` and the Navbar's anchor links) — only the JSX body changes. No new components, no new routes, no new dependencies.

**Tech Stack:** Next.js App Router (unchanged) · `next/image` for all images · native `<video>` for all video · Tailwind CSS v4 utility classes only (existing tokens: `brand-red`, `cream`, `gold`, `font-display`, `font-sans`, `bg-grid`)

## Global Constraints

- No new npm packages — no Framer Motion, no icon library (use inline SVG for the scroll-cue chevron)
- No animation/scroll-reveal/parallax — explicitly deferred to a later "Polish & QA" phase
- Every image uses `next/image` with `fill` inside a `relative` container that has an explicit aspect ratio (e.g. `aspect-[4/5]`), plus a `sizes` prop and descriptive `alt` text
- Every video uses a native `<video>` tag with `autoPlay muted loop playsInline` and `aria-hidden="true"` (decorative; the surrounding heading/copy carries the meaning)
- Split-panel sections follow one consistent pattern: `mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row` wrapping two `w-full md:w-1/2` children — primary image div first in DOM (top on mobile, left on desktop) unless a task says otherwise
- Inset accent (small overlapping image/video) uses `absolute` positioning at a bottom corner of the primary image's wrapper, with `border-4 border-cream shadow-lg` and a fixed pixel/rem size that scales up at `sm:`
- Body copy uses the curly apostrophe character `’` (not a straight `'`) so it doesn't trip the `react/no-unescaped-entities` ESLint rule from `eslint-config-next`
- Assets already exist at `public/assets/<filename>` (copied in Phase 1) — no asset work needed in this phase
- Dev server: `pnpm dev`, stop with `taskkill //F //IM node.exe //T` (Windows/Git Bash environment)

---

### Task 1: Hero — video background, tagline, scroll cue

**Files:**
- Modify: `components/sections/Hero.tsx` (full replace)

**Interfaces:**
- Consumes: `bg-brand-red`/`text-cream`/`font-display`/`font-sans` tokens (Phase 1); `/assets/cookieTimelapse.mp4`, `/assets/3cookies.jpg` (Phase 1 asset copy)
- Produces: `export default function Hero()` — same zero-prop signature and `id="hero"`, no change to how `app/(site)/page.tsx` imports/renders it

- [ ] **Step 1: Replace the component**

```tsx
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-brand-red text-cream"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/cookieTimelapse.mp4"
        poster="/assets/3cookies.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/50" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-6xl">KeksPoint</h1>
        <p className="font-sans text-lg tracking-wide">Crispy outside, soft inside</p>
      </div>
      <svg
        className="absolute bottom-8 left-1/2 z-10 h-8 w-8 -translate-x-1/2 text-cream"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </section>
  );
}
```

- [ ] **Step 2: Verify the section renders with the expected text and video source**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/ -o /c/tmp/keks-home.html -w "%{http_code}\n"
grep -o "Crispy outside, soft inside" /c/tmp/keks-home.html
grep -o 'src="/assets/cookieTimelapse.mp4"' /c/tmp/keks-home.html
taskkill //F //IM node.exe //T
```

Expected: `200`, both greps print a match.

- [ ] **Step 3: Commit**

```bash
git add components/sections/Hero.tsx
git commit -m "Hero: full-screen video background with tagline and scroll cue"
```

---

### Task 2: BestWayToEat — split panel with inset image

**Files:**
- Modify: `components/sections/BestWayToEat.tsx` (full replace)

**Interfaces:**
- Consumes: `bg-cream`/`text-brand-red`/`font-display` tokens (Phase 1); `/assets/bestWayToEat.jpg`, `/assets/eatingCookie.jpg` (Phase 1 asset copy)
- Produces: `export default function BestWayToEat()` — same zero-prop signature and `id="best-way"`

**Correction (post-implementation):** `bestWayToEat.jpg` turned out to be a cookie-storage infographic, not a lifestyle photo — this task's original code (below) was superseded after visual verification. See the design spec's correction note for the fix: `eatingCookie.jpg` became the sole primary image, no inset.

- [ ] **Step 1: Replace the component**

```tsx
import Image from "next/image";

export default function BestWayToEat() {
  return (
    <section id="best-way" className="bg-cream text-brand-red">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/bestWayToEat.jpg"
              alt="A warm KeksPoint cookie paired with a scoop of ice cream"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-40 sm:w-40">
            <Image
              src="/assets/eatingCookie.jpg"
              alt="Someone biting into a freshly baked KeksPoint cookie"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">The Best Way to Eat It</h2>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the section renders with both images**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/ -o /c/tmp/keks-home.html -w "%{http_code}\n"
grep -o "The Best Way to Eat It" /c/tmp/keks-home.html
grep -o "bestWayToEat.jpg" /c/tmp/keks-home.html
grep -o "eatingCookie.jpg" /c/tmp/keks-home.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all three greps print a match.

- [ ] **Step 3: Commit**

```bash
git add components/sections/BestWayToEat.tsx
git commit -m "BestWayToEat: split-panel layout with primary image and inset accent"
```

---

### Task 3: AboutUs — split panel (flipped) with two-photo inset

**Files:**
- Modify: `components/sections/AboutUs.tsx` (full replace)

**Interfaces:**
- Consumes: `bg-cream`/`text-brand-red`/`font-display`/`font-sans` tokens (Phase 1); `/assets/aboutUs.jpg`, `/assets/worker.jpg`, `/assets/shop.jpg` (Phase 1 asset copy)
- Produces: `export default function AboutUs()` — same zero-prop signature and `id="about"`

- [ ] **Step 1: Replace the component**

```tsx
import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about" className="bg-cream text-brand-red">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">About Us</h2>
          <p className="mt-6 font-sans text-base leading-relaxed">
            KeksPoint started with one simple idea: bring real American-style cookies to Zagreb.
            Founder Marija Petrović turned a love of baking into one of the city’s most-loved
            sweet spots — and just celebrated the shop’s first birthday. Every cookie is baked
            fresh in-house, the same way, every day: crispy outside, soft inside, and always
            richly filled. Come find us on Papova ulica 2, open daily from 10:00 to 23:00.
          </p>
        </div>
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/aboutUs.jpg"
              alt="Inside the KeksPoint cookie shop"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 flex gap-2">
            <div className="relative h-28 w-20 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-36 sm:w-28">
              <Image
                src="/assets/worker.jpg"
                alt="A KeksPoint baker at work"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="relative h-28 w-20 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-36 sm:w-28">
              <Image
                src="/assets/shop.jpg"
                alt="The KeksPoint storefront on Papova ulica"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the section renders with the story copy and all three images**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/ -o /c/tmp/keks-home.html -w "%{http_code}\n"
grep -o "Marija Petrovi" /c/tmp/keks-home.html
grep -o "aboutUs.jpg" /c/tmp/keks-home.html
grep -o "worker.jpg" /c/tmp/keks-home.html
grep -o "shop.jpg" /c/tmp/keks-home.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all four greps print a match.

- [ ] **Step 3: Commit**

```bash
git add components/sections/AboutUs.tsx
git commit -m "AboutUs: story copy with split-panel layout and two-photo inset"
```

---

### Task 4: BirthdayCookie — split panel with video inset and order CTA

**Files:**
- Modify: `components/sections/BirthdayCookie.tsx` (full replace)

**Interfaces:**
- Consumes: `bg-grid`/`bg-brand-red`/`text-cream`/`font-display`/`font-sans` tokens (Phase 1); `/assets/bigBdayCookie.jpg`, `/assets/blowingWish.mp4` (Phase 1 asset copy); the existing `#order` anchor on `components/sections/OrderForm.tsx` (Phase 1 placeholder, unmodified this phase)
- Produces: `export default function BirthdayCookie()` — same zero-prop signature and `id="birthday"`

- [ ] **Step 1: Replace the component**

```tsx
import Image from "next/image";

export default function BirthdayCookie() {
  return (
    <section id="birthday" className="bg-grid bg-brand-red text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/bigBdayCookie.jpg"
              alt="A giant personalized KeksPoint birthday cookie"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-40 sm:w-40">
            <video
              className="h-full w-full object-cover"
              src="/assets/blowingWish.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">Giant Birthday Cookie</h2>
          <p className="mt-6 font-sans text-base leading-relaxed">
            Skip the cake. Our giant personalized birthday cookies are the KeksPoint way to
            celebrate — order at least 72 hours ahead and we’ll work out the flavor and
            personalization with you directly, ready for pickup in-store.
          </p>
          <a
            href="#order"
            className="mt-8 inline-block rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-brand-red transition hover:opacity-90"
          >
            Order Yours
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify the section renders with copy, video source, and CTA link**

```bash
pnpm dev > /c/tmp/keks-dev.log 2>&1 &
sleep 8
curl -s http://localhost:3000/ -o /c/tmp/keks-home.html -w "%{http_code}\n"
grep -o "Skip the cake" /c/tmp/keks-home.html
grep -o 'src="/assets/blowingWish.mp4"' /c/tmp/keks-home.html
grep -o 'href="#order"' /c/tmp/keks-home.html
taskkill //F //IM node.exe //T
```

Expected: `200`, all three greps print a match (note: `href="#order"` also matches the Navbar's existing CTA — that's expected, both link to the same placeholder).

- [ ] **Step 3: Commit**

```bash
git add components/sections/BirthdayCookie.tsx
git commit -m "BirthdayCookie: split-panel layout with video inset and Order Yours CTA"
```

---

### Task 5: Full-page lint, build, and visual verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: the complete Phase 2 sections from Tasks 1–4
- Produces: confirmation that Phase 2 is done, lint/build are clean, and the page looks right at desktop and mobile widths

- [ ] **Step 1: Lint and production build**

```bash
pnpm lint
pnpm build
```

Expected: both commands exit 0 with no errors. The build's route list should still show `/`, `/_not-found`, and `/admin`.

- [ ] **Step 2: Screenshot at desktop and mobile widths, check for console errors**

Use Playwright (already available via `npx playwright`) to drive a headless Chromium against the dev server, matching the approach used in the Phase 1 plan's Task 7. Start the dev server, poll until it responds, then run a script like:

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
- Hero: video plays full-screen, "KeksPoint" + "Crispy outside, soft inside" readable over the gradient scrim, scroll-cue chevron visible at the bottom
- BestWayToEat: image left / heading right on desktop, stacked on mobile, inset photo overlaps the primary image's corner without being cut off
- AboutUs: heading+copy left / images right on desktop, stacked on mobile, the two-photo inset pair renders side by side and doesn't overflow its container
- BirthdayCookie: burgundy grid background intact, image+video-inset left / heading+copy+CTA right, "Order Yours" button visible and styled
- No entries in `CONSOLE_ERRORS` at either width

- [ ] **Step 3: Stop the dev server**

```bash
taskkill //F //IM node.exe //T
```

- [ ] **Step 4: Final commit if anything was adjusted during visual review**

```bash
git status
git add -A
git commit -m "Phase 2 editorial sections polish after visual review"
```

(Skip this step if `git status` shows no changes.)
