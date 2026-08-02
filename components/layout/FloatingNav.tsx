"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
];

const AUTO_HIDE_MS = 4000;
const ARM_SCROLL_THRESHOLD = 400;

export default function FloatingNav() {
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const menuEl = document.getElementById("menu");

    if (menuEl) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const pastMenu = entry.boundingClientRect.top < 0;
          setArmed(pastMenu);
          if (!pastMenu) {
            setVisible(false);
            if (hideTimer.current) clearTimeout(hideTimer.current);
          }
        },
        { threshold: 0 },
      );
      observer.observe(menuEl);
      return () => observer.disconnect();
    }

    // No #menu section on this page (e.g. /menu) — arm once the user has
    // scrolled roughly past the fold instead of tracking a specific section.
    const onScroll = () => setArmed(window.scrollY > ARM_SCROLL_THRESHOLD);
    // A page whose maximum scroll distance never reaches ARM_SCROLL_THRESHOLD
    // (e.g. /menu with few or no items) can never generate a scroll event
    // past the threshold, which would leave the nav permanently unreachable.
    // Treat that case as armed and visible immediately instead of waiting
    // for a scroll that can't happen. (Comparing scrollHeight <= innerHeight
    // alone isn't enough: a page can have some scrollable overflow — e.g.
    // from a min-h-screen main plus footer — that still never reaches the
    // threshold.)
    const maxScrollDistance = document.documentElement.scrollHeight - window.innerHeight;
    const pageIsShort = maxScrollDistance <= ARM_SCROLL_THRESHOLD;
    if (pageIsShort) {
      // Defer off the synchronous effect body (satisfies react-hooks/set-state-in-effect)
      // — a single animation frame is visually instant.
      const raf = requestAnimationFrame(() => {
        setArmed(true);
        setVisible(true);
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
      };
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      if (!armed) return;

      if (scrollingDown) {
        setVisible(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setVisible(false), AUTO_HIDE_MS);
      } else {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [armed]);

  return (
    <nav
      aria-hidden={!visible}
      className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <ul className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-brand-red px-4 py-2.5 font-sans text-xs font-semibold tracking-wide text-cream uppercase shadow-lg sm:gap-6 sm:px-6 sm:py-3 sm:text-sm">
        {NAV_LINKS.map((link, i) => (
          <li key={link.href} className="flex items-center gap-2 sm:gap-6">
            <a href={link.href} className="transition hover:opacity-80">
              {link.label}
            </a>
            {i < NAV_LINKS.length - 1 && <span aria-hidden="true">|</span>}
          </li>
        ))}
        <li className="flex items-center gap-2 sm:gap-6">
          <span aria-hidden="true">|</span>
          <a
            href="https://www.instagram.com/kekspoint.hr/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
          >
            Follow Us
          </a>
        </li>
      </ul>
    </nav>
  );
}
