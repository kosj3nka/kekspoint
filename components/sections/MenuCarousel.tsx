"use client";

import Image from "next/image";
import { useState } from "react";
import DraggableSticker from "@/components/ui/DraggableSticker";
import type { MenuItem } from "@/lib/menu";

export default function MenuCarousel({ items }: { items: MenuItem[] }) {
  const [index, setIndex] = useState(0);
  const slide = items[index];

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div id="menu" className="bg-cream px-6 pt-8 pb-4 text-brand-red sm:pb-0">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <div className="pointer-events-none relative -mt-[50%] aspect-square w-full sm:-mb-[25px] md:-mb-[50px] lg:-mb-[90px] xl:-mb-[115px]">
          <Image
            src="/assets/tray.png"
            alt=""
            fill
            aria-hidden
            priority
            sizes="(min-width: 1280px) 1024px, (min-width: 640px) 80vw, 90vw"
            className="pointer-events-none object-contain"
          />

          {slide?.imageUrl && (
            <div className="absolute inset-[30%]">
              <Image
                src={slide.imageUrl}
                alt={slide.name}
                fill
                sizes="(min-width: 640px) 280px, 65vw"
                className="object-contain drop-shadow-md"
              />
            </div>
          )}

          {slide?.isBestSeller && (
            <DraggableSticker className="pointer-events-auto absolute top-[30%] left-[14%] h-[11%] w-[11%]">
              <div className="flex h-full w-full -rotate-12 items-center justify-center rounded-full bg-cream text-center text-[8px] leading-tight font-bold uppercase sm:text-[10px] md:text-xs lg:text-sm">
                BEST SELLER
              </div>
            </DraggableSticker>
          )}

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous cookie"
                className="pointer-events-auto absolute top-1/2 left-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next cookie"
                className="pointer-events-auto absolute top-1/2 right-[22%] flex h-9 w-9 -translate-y-1/2 items-center justify-center text-4xl font-bold text-cream drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] transition hover:opacity-80"
              >
                ›
              </button>
            </>
          )}

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
