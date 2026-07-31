# KeksPoint Phase 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Next.js project with the correct KeksPoint visual language (colors, type, grid texture) and a static nav/footer/section shell, so Phase 2 (static editorial sections) has an on-brand base to build real content into.

**Architecture:** Single Next.js App Router project (TypeScript, Tailwind CSS v4), built directly in the repo root. Route groups separate the public marketing site (`app/(site)/`) from a reserved, empty admin shell (`app/admin/`). No backend, no dynamic data — every section is a static placeholder proving the design tokens and layout work.

**Tech Stack:** Next.js (latest, App Router) · TypeScript · Tailwind CSS v4 · pnpm · next/font/google (Playfair Display + Inter)

## Global Constraints

- Package manager: pnpm (all install/run commands use `pnpm`, not npm/yarn)
- Framework: Next.js, App Router, TypeScript, Tailwind CSS v4 — no `tailwind.config.ts`, theme is defined via CSS `@theme` in `app/globals.css` (Tailwind v4 convention)
- Fonts: Playfair Display (display serif, headlines) + Inter (sans, body/UI), loaded via `next/font/google`
- Colors: brand red `#7A1F2B`, cream `#FBF3E7`, gold accent `#C89B3C` — defined once as named Tailwind theme tokens (`brand-red`, `cream`, `gold`), never raw hex in components
- Grid texture: a reusable `bg-grid` utility, applied only to dark-red-band sections (Hero, BirthdayCookie, Footer) — never on cream sections
- No Supabase, no auth, no data fetching, no admin functionality beyond a placeholder route — all deferred to later phases
- No unit test framework needed this phase (static scaffold) — verification is `pnpm dev` + `curl` + grep against rendered HTML, per task

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create (via `create-next-app`): `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/*.svg`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a working Next.js dev server on `http://localhost:3000`, a `.gitignore` that excludes `node_modules`/`.next`, and the base folder structure every later task builds into

- [ ] **Step 1: Run the scaffold command**

```bash
npx --yes create-next-app@latest . --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --use-pnpm --no-turbopack
```

- [ ] **Step 2: Start the dev server in the background and verify it responds**

```bash
pnpm dev > /tmp/keks-dev.log 2>&1 &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Expected: `200`

- [ ] **Step 3: Stop the dev server**

```bash
pkill -f "next dev" || true
```

- [ ] **Step 4: Review and commit**

```bash
git status
git add -A
git commit -m "Scaffold Next.js project (TypeScript, Tailwind v4, App Router, pnpm)"
```

---

### Task 2: Copy assets into `public/`

**Files:**
- Create: `public/assets/` (copy of every file currently in the top-level `assets/` folder)

**Interfaces:**
- Consumes: nothing new (reads from the existing top-level `assets/` folder)
- Produces: `public/assets/logo.png`, `public/assets/tray.png`, and all other cookie/section imagery and video, servable at `/assets/<filename>` — Task 4 (Navbar) depends on `/assets/logo.png` existing

- [ ] **Step 1: Copy the assets folder into `public/`**

```bash
mkdir -p public/assets
cp assets/*.png assets/*.jpg assets/*.jfif assets/*.mp4 public/assets/
```

- [ ] **Step 2: Verify the logo is servable**

```bash
pnpm dev > /tmp/keks-dev.log 2>&1 &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/assets/logo.png
pkill -f "next dev" || true
```

Expected: `200`

- [ ] **Step 3: Commit**

```bash
git add public/assets
git commit -m "Copy source assets into public/ for Next.js static serving"
```

---

### Task 3: Design tokens — colors, fonts, grid texture

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: Tailwind utility classes `bg-brand-red`, `text-brand-red`, `bg-cream`, `text-cream`, `bg-gold`, `text-gold`, `font-display`, `font-sans`, and `bg-grid` — every later component task uses these class names, and no others, for brand color/type/texture

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";

@theme {
  --color-brand-red: #7a1f2b;
  --color-cream: #fbf3e7;
  --color-gold: #c89b3c;
  --font-display: var(--font-playfair);
  --font-sans: var(--font-inter);
}

@utility bg-grid {
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
}

body {
  background-color: var(--color-cream);
  color: var(--color-brand-red);
}
```

- [ ] **Step 2: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KeksPoint — Zagreb's Cult Cookie Shop",
  description:
    "Freshly baked American-style cookies in Zagreb — crispy outside, soft inside, richly filled. Papova ulica 2, open daily 10:00–23:00.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the page still renders and picks up the title**

```bash
pnpm dev > /tmp/keks-dev.log 2>&1 &
sleep 5
curl -s http://localhost:3000/ -o /tmp/keks-home.html -w "%{http_code}\n"
grep -o "KeksPoint — Zagreb" /tmp/keks-home.html
grep -o 'class="font-sans antialiased"' /tmp/keks-home.html
pkill -f "next dev" || true
```

Expected: `200`, both greps print a match.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "Add KeksPoint design tokens: brand colors, fonts, grid-texture utility"
```

---

### Task 4: Navbar component

**Files:**
- Create: `components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `/assets/logo.png` (from Task 2), `bg-brand-red`/`bg-cream`/`text-cream`/`text-brand-red` tokens (from Task 3)
- Produces: `export default function Navbar()` — a zero-prop component, imported by `app/(site)/page.tsx` in Task 6

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#birthday", label: "Birthday Cookie" },
  { href: "#visit", label: "Visit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-cream text-brand-red shadow-sm" : "bg-transparent text-cream"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="KeksPoint" width={40} height={40} priority />
        </Link>
        <ul className="hidden gap-8 font-sans text-sm tracking-wide uppercase md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
        <a
          href="#order"
          className="rounded-full bg-brand-red px-5 py-2 font-sans text-sm font-semibold text-cream transition hover:opacity-90"
        >
          Order a Birthday Cookie
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "Add sticky Navbar with scroll-based transparent-to-solid transition"
```

(Wiring into the page and verifying it renders happens in Task 6, once section placeholders exist to scroll past.)

---

### Task 5: Footer component

**Files:**
- Create: `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `bg-brand-red`/`text-cream`/`font-display`/`bg-grid` tokens (from Task 3)
- Produces: `export default function Footer()` — a zero-prop component with `id="visit"`, imported by `app/(site)/page.tsx` in Task 6; satisfies the Navbar's `#visit` anchor link

- [ ] **Step 1: Create the component**

```tsx
const DELIVERY_LINKS = [
  { label: "Wolt", href: "https://wolt.com" },
  { label: "Glovo", href: "https://glovoapp.com" },
  { label: "Bolt", href: "https://bolt.eu" },
];

export default function Footer() {
  return (
    <footer id="visit" className="bg-grid bg-brand-red px-6 py-16 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <h3 className="font-display text-2xl">KeksPoint</h3>
          <p className="mt-2 font-sans text-sm">Papova ulica 2, Zagreb</p>
          <p className="font-sans text-sm">Monday–Sunday, 10:00–23:00</p>
        </div>
        <div>
          <h4 className="font-sans text-sm tracking-wide uppercase">Order delivery</h4>
          <ul className="mt-2 flex gap-4 font-sans text-sm">
            {DELIVERY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <a
            href="https://www.instagram.com/kekspoint.hr/"
            target="_blank"
            rel="noreferrer"
            className="font-sans text-sm"
          >
            @kekspoint.hr
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "Add Footer with address, hours, delivery links, and Instagram"
```

(Delivery links point at each provider's homepage as a placeholder — real KeksPoint-specific deep links get wired up via the `site_settings` table in the admin-panel phase.)

---

### Task 6: Section placeholders, homepage assembly, admin placeholder

**Files:**
- Create: `components/sections/Hero.tsx`
- Create: `components/sections/MenuCarousel.tsx`
- Create: `components/sections/Promo.tsx`
- Create: `components/sections/BestWayToEat.tsx`
- Create: `components/sections/AboutUs.tsx`
- Create: `components/sections/BirthdayCookie.tsx`
- Create: `components/sections/OrderForm.tsx`
- Create: `app/(site)/page.tsx`
- Create: `app/admin/page.tsx`
- Delete: `app/page.tsx` (superseded by `app/(site)/page.tsx`)

**Interfaces:**
- Consumes: `Navbar` (Task 4), `Footer` (Task 5), design tokens (Task 3)
- Produces: a complete homepage at `/` stacking all seven sections between Navbar and Footer, and a placeholder `/admin` route — nothing later in this phase depends on these, but Phase 2 replaces each section's internals in place

- [ ] **Step 1: Create the seven section placeholders**

`components/sections/Hero.tsx`:
```tsx
export default function Hero() {
  return (
    <section id="hero" className="bg-grid flex h-screen items-center justify-center bg-brand-red text-cream">
      <h1 className="font-display text-6xl">KeksPoint</h1>
    </section>
  );
}
```

`components/sections/MenuCarousel.tsx`:
```tsx
export default function MenuCarousel() {
  return (
    <section id="menu" className="flex min-h-[60vh] items-center justify-center bg-cream text-brand-red">
      <h2 className="font-display text-4xl">Menu</h2>
    </section>
  );
}
```

`components/sections/Promo.tsx`:
```tsx
export default function Promo() {
  return (
    <section id="promo" className="flex min-h-[40vh] items-center justify-center bg-cream text-brand-red">
      <h2 className="font-display text-4xl">Seasonal Promo</h2>
    </section>
  );
}
```

`components/sections/BestWayToEat.tsx`:
```tsx
export default function BestWayToEat() {
  return (
    <section id="best-way" className="flex min-h-[60vh] items-center justify-center bg-cream text-brand-red">
      <h2 className="font-display text-4xl">The Best Way to Eat It</h2>
    </section>
  );
}
```

`components/sections/AboutUs.tsx`:
```tsx
export default function AboutUs() {
  return (
    <section id="about" className="flex min-h-[60vh] items-center justify-center bg-cream text-brand-red">
      <h2 className="font-display text-4xl">About Us</h2>
    </section>
  );
}
```

`components/sections/BirthdayCookie.tsx`:
```tsx
export default function BirthdayCookie() {
  return (
    <section id="birthday" className="bg-grid flex min-h-[60vh] items-center justify-center bg-brand-red text-cream">
      <h2 className="font-display text-4xl">Giant Birthday Cookie</h2>
    </section>
  );
}
```

`components/sections/OrderForm.tsx`:
```tsx
export default function OrderForm() {
  return (
    <section id="order" className="flex min-h-[60vh] items-center justify-center bg-cream text-brand-red">
      <h2 className="font-display text-4xl">Order Yours</h2>
    </section>
  );
}
```

- [ ] **Step 2: Restructure the homepage into the `(site)` route group**

```bash
mkdir -p "app/(site)"
rm app/page.tsx
```

Create `app/(site)/page.tsx`:
```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MenuCarousel from "@/components/sections/MenuCarousel";
import Promo from "@/components/sections/Promo";
import BestWayToEat from "@/components/sections/BestWayToEat";
import AboutUs from "@/components/sections/AboutUs";
import BirthdayCookie from "@/components/sections/BirthdayCookie";
import OrderForm from "@/components/sections/OrderForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MenuCarousel />
        <Promo />
        <BestWayToEat />
        <AboutUs />
        <BirthdayCookie />
        <OrderForm />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Create the admin placeholder route**

`app/admin/page.tsx`:
```tsx
export default function AdminPlaceholder() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream font-sans text-brand-red">
      Admin panel coming in a later phase.
    </div>
  );
}
```

- [ ] **Step 4: Verify both routes render with all expected content**

```bash
pnpm dev > /tmp/keks-dev.log 2>&1 &
sleep 5
curl -s http://localhost:3000/ -o /tmp/keks-home.html -w "home: %{http_code}\n"
grep -o "Order a Birthday Cookie" /tmp/keks-home.html
grep -o "Papova ulica 2, Zagreb" /tmp/keks-home.html
grep -o "Giant Birthday Cookie" /tmp/keks-home.html
curl -s http://localhost:3000/admin -o /tmp/keks-admin.html -w "admin: %{http_code}\n"
grep -o "Admin panel coming in a later phase." /tmp/keks-admin.html
pkill -f "next dev" || true
```

Expected: both routes `200`, every grep prints a match.

- [ ] **Step 5: Commit**

```bash
git add -A components/sections app
git commit -m "Assemble homepage from section placeholders, add admin route stub"
```

---

### Task 7: Final responsive check and wrap-up

**Files:** none (verification only)

**Interfaces:**
- Consumes: the complete Phase 1 site from Tasks 1–6
- Produces: confirmation that Phase 1 is done and ready for Phase 2 (static editorial sections with real content)

- [ ] **Step 1: Run the dev server and manually check in a browser**

```bash
pnpm dev
```

Open `http://localhost:3000` and confirm, at both a mobile width (~375px) and a desktop width (~1440px):
- Playfair Display renders on headings, Inter on body/UI text
- The Navbar is transparent over the Hero and turns solid cream with the burgundy logo/text on scroll
- The Hero and BirthdayCookie sections show the burgundy background with the subtle grid texture; other sections stay plain cream
- The Footer (burgundy + grid) shows address, hours, delivery links, and the Instagram handle
- Clicking each nav link scrolls to the matching section

Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 2: Final commit if anything was adjusted during manual review**

```bash
git status
git add -A
git commit -m "Phase 1 foundation polish after manual review"
```

(Skip this step if `git status` shows no changes.)
