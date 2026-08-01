"use client";

import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
];

const AUTO_HIDE_MS = 4000;

export default function FloatingNav() {
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const menuEl = document.getElementById("menu");
    if (!menuEl) return;

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
      <ul className="flex items-center gap-2 whitespace-nowrap rounded-full bg-brand-red px-3 py-2 font-sans text-[10px] font-semibold tracking-wide text-cream uppercase shadow-lg sm:gap-6 sm:px-6 sm:py-3 sm:text-sm">
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
