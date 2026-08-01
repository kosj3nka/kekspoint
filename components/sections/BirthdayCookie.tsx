import Image from "next/image";

export default function BirthdayCookie() {
  return (
    <section id="birthday" className="bg-grid bg-brand-red text-cream">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/bigBdayCookie.jpg"
              alt="A giant personalized KeksPoint birthday cookie"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-40 sm:w-40">
            <video
              className="h-full w-full object-cover"
              src="/assets/blowingWish.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">Giant Birthday Cookie</h2>
          <p className="mt-6 font-sans text-base leading-relaxed">
            Skip the cake. Our giant personalized birthday cookies are the KeksPoint way to
            celebrate — order at least 72 hours ahead and we'll work out the flavor and
            personalization with you directly, ready for pickup in-store.
          </p>
          <a
            href="#order"
            className="mt-8 inline-block rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-brand-red transition hover:opacity-90"
          >
            Order Yours
          </a>
        </div>
      </div>
    </section>
  );
}
