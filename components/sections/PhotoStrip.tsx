"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type StripImage = { id: string; src: string; alt: string; objectPosition?: string };

const STRIP_IMAGES: StripImage[] = [
  {
    id: "cookie-heads",
    src: "/assets/cookieHeads.jpg",
    alt: "Freshly baked KeksPoint cookies",
    objectPosition: "object-top",
  },
  {
    id: "in-bag",
    src: "/assets/inBag.jpg",
    alt: "KeksPoint cookies packed in a bag",
  },
  {
    id: "picnic-cookies",
    src: "/assets/picnicCookies.jpg",
    alt: "KeksPoint cookies enjoyed on a picnic",
  },
];

const CYCLE_MS = 5000;

export default function PhotoStrip() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (STRIP_IMAGES.length < 2) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % STRIP_IMAGES.length);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="photo-strip" className="relative w-full overflow-hidden">
      <div className="hidden sm:flex sm:h-[420px] sm:w-full">
        {STRIP_IMAGES.map((image) => (
          <div key={image.id} className="relative h-full flex-1">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={`${Math.ceil(100 / STRIP_IMAGES.length)}vw`}
              className={`object-cover ${image.objectPosition ?? ""}`}
            />
          </div>
        ))}
      </div>

      <div className="relative aspect-[3/4] w-full sm:hidden">
        {STRIP_IMAGES.map((image, index) => (
          <Image
            key={image.id}
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className={`object-cover ${image.objectPosition ?? ""} transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
