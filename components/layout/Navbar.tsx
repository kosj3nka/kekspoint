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
