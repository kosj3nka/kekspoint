"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const DELIVERY_OPTIONS = [
  {
    name: "Wolt",
    href: "https://wolt.com/en/hrv/zagreb/venue/keks-point",
    logo: "/assets/delivery/wolt.png",
  },
  {
    name: "Glovo",
    href: "https://glovoapp.com/en/hr/zagreb/stores/keks-point-zag",
    logo: "/assets/delivery/glovo.svg",
  },
];

export default function DeliveryPopup() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-full bg-cream px-4 font-sans text-xs font-bold tracking-wide text-brand-red uppercase transition hover:opacity-90 sm:h-12 sm:px-5 sm:text-sm"
      >
        Order Now!
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Order for delivery"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-sm rounded-lg bg-cream p-6 text-brand-red outline-none sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none transition hover:opacity-70"
            >
              &times;
            </button>

            <h2 className="font-heading text-2xl font-bold">Order for delivery</h2>
            <p className="mt-1 font-sans text-sm text-brand-red/80">
              KeksPoint delivers through:
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {DELIVERY_OPTIONS.map((option) => (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-full border border-brand-red/15 px-4 py-3 font-sans text-sm font-semibold transition hover:border-brand-red/40 hover:bg-brand-red/5"
                >
                  <Image
                    src={option.logo}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-contain"
                  />
                  {option.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
