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
