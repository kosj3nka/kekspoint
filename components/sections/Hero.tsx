import Image from "next/image";
import MenuCarousel from "./MenuCarousel";

export default function Hero() {
  return (
    <section id="hero" className="bg-brand-red">
      <div className="bg-grid relative px-6 pt-10 pb-40 sm:px-10 sm:pt-16 sm:pb-[235px] md:pb-[300px] lg:pb-[365px] xl:pb-[415px]">
        <div className="mx-auto flex max-w-4xl items-stretch justify-center gap-6 sm:gap-12 lg:gap-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center text-cream sm:gap-6">
            <h1 className="w-full text-left font-heading text-3xl leading-[1.1] font-bold sm:w-auto sm:text-center sm:text-5xl">
              Crispy outside,
              <br />
              soft inside
            </h1>

            <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-3">
              <a
                href="#order"
                className="inline-flex h-10 items-center justify-center rounded-full bg-cream px-4 font-sans text-xs font-bold tracking-wide text-brand-red uppercase transition hover:opacity-90 sm:h-12 sm:px-5 sm:text-sm"
              >
                Order Now!
              </a>

              <div className="relative">
                <a
                  href="#about"
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
                <p className="absolute top-full left-1/2 mt-12 w-[170px] -translate-x-[8%] text-center font-sans text-[11px] leading-snug text-cream/90 italic sm:mt-16 sm:translate-x-[10%]">
                  follow the cookie crumbs trail to Papova ul. 2
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

      <MenuCarousel />
    </section>
  );
}
