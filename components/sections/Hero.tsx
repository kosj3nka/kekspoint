import Image from "next/image";
import DeliveryPopup from "./DeliveryPopup";
import MenuCarousel from "./MenuCarousel";
import type { MenuItem } from "@/lib/menu";

export default function Hero({ items }: { items: MenuItem[] }) {
  return (
    <section id="hero" className="bg-brand-red">
      <div className="bg-grid relative px-6 pt-10 pb-40 sm:px-10 sm:pt-16 sm:pb-[295px] md:pb-[290px] lg:pb-[330px] xl:pb-[380px]">
        <div className="mx-auto flex max-w-4xl items-stretch justify-center gap-6 sm:gap-12 lg:gap-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center text-cream sm:gap-6">
            <h1 className="w-full text-left font-heading text-3xl leading-[1.1] font-bold sm:w-auto sm:text-center sm:text-5xl">
              Crispy outside,
              <br />
              soft inside
            </h1>

            <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-3">
              <DeliveryPopup />

              <div className="relative">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Papova+ulica+2%2C+Zagreb"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-cream px-4 font-sans text-xs font-bold tracking-wide text-brand-red uppercase transition hover:opacity-90 sm:h-12 sm:px-5 sm:text-sm"
                >
                  Come To Us ➤
                </a>
                <Image
                  src="/assets/crumbs.png"
                  alt=""
                  width={80}
                  height={80}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full -right-10 -mt-6 h-16 w-16 -rotate-90 object-contain sm:-right-12 sm:-mt-8 sm:h-20 sm:w-20"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 44 96"
                  className="pointer-events-none absolute top-full right-10 mt-1 h-14 w-7 rotate-[50deg] text-cream/90 sm:right-8 sm:-rotate-[24deg] sm:mt-1 sm:h-16 sm:w-8 md:right-7 md:mt-2 md:h-20 md:w-9 lg:right-6 lg:mt-2 lg:h-20 lg:w-9 xl:right-7 xl:mt-2 xl:h-24 xl:w-10"
                >
                  <path
                    d="M34 90C4 78 4 22 30 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M30 10L24 18M30 10L20 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="absolute top-full left-1/2 mt-12 w-[190px] -translate-x-[8%] text-center font-sans text-[14px] leading-snug text-cream/90 italic sm:mt-16 sm:translate-x-[10%] md:translate-x-[20%] lg:translate-x-[30%] xl:translate-x-[40%]">
                  follow the cookie crumbs <br /> trail to{" "}
                  <span className="relative inline-block whitespace-nowrap not-italic">
                    Papova ul. 2
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 100 8"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute top-full left-0 -mt-0.5 h-[4px] w-full text-cream/90"
                    >
                      <path
                        d="M1 4.5 Q 9 3, 17 4.3 T 33 4.8 T 49 3.6 T 65 4.6 T 81 4 T 99 4.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Image
            src="/assets/logo.png"
            alt="KeksPoint"
            width={120}
            height={140}
            priority
            className="h-full max-h-24 w-auto shrink-0 self-stretch brightness-0 invert sm:max-h-40 md:max-h-none"
          />
        </div>
      </div>

      <MenuCarousel items={items} />
    </section>
  );
}
