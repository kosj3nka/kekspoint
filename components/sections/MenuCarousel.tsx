"use client";

import Image from "next/image";
import { useState } from "react";

type Slide = {
  id: string;
  image: string;
  alt: string;
  badge?: string;
};

// Placeholder data — swap for a database-backed fetch once the full menu is ready.
const SLIDES: Slide[] = [
  {
    id: "bueno",
    image: "/assets/BUENOcookie.png",
    alt: "Bueno-stuffed chocolate chip cookie",
    badge: "BEST SELLER",
  },
];

export default function MenuCarousel() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];

  const goPrev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setIndex((i) => (i + 1) % SLIDES.length);

  return (
    <div id="menu" className="bg-cream px-6 pt-8 pb-32 text-brand-red sm:pb-40">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <div className="relative -mt-[50%] aspect-square w-full">
          <Image
            src="/assets/tray.png"
            alt=""
            fill
            aria-hidden
            priority
            sizes="(min-width: 1280px) 1024px, (min-width: 640px) 80vw, 90vw"
            className="object-contain"
          />

          <div className="absolute inset-[30%]">
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="(min-width: 640px) 280px, 65vw"
              className="object-contain drop-shadow-md"
            />
          </div>

          {slide.badge && (
            <div className="absolute top-[30%] left-[14%] flex h-[11%] w-[11%] -rotate-12 items-center justify-center rounded-full bg-cream text-center text-[8px] leading-tight font-bold uppercase shadow-md sm:text-[10px] md:text-xs lg:text-sm">
              {slide.badge}
            </div>
          )}

          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous cookie"
            className="absolute top-1/2 left-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next cookie"
            className="absolute top-1/2 right-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
          >
            ›
          </button>

          <p className="absolute top-[78%] left-1/2 flex -translate-x-1/2 items-center gap-4 font-script text-7xl whitespace-nowrap text-brand-red sm:text-8xl">
            <span aria-hidden="true" className="text-3xl sm:text-4xl">
              ★
            </span>
            Menu
          </p>
        </div>
      </div>
    </div>
  );
}
