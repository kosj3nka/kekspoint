import Image from "next/image";

export default function BirthdayCookie() {
  return (
    <section id="birthday" className="bg-grid bg-brand-red text-cream">
      <div className="mx-auto flex max-w-6xl flex-col px-6 py-24 md:flex-row">
        <div className="relative aspect-[4/5] w-full md:w-1/2">
          <Image
            src="/assets/bigBdayCookie.jpg"
            alt="A giant personalized KeksPoint birthday cookie"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/5] w-full md:w-1/2">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/assets/blowingWish.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative z-10 flex h-full flex-col items-start justify-start gap-6 px-8 py-12 sm:px-12">
            <h2 className="font-script text-5xl sm:text-6xl">Giant Birthday Cookie</h2>
            <p className="font-sans text-base leading-relaxed">
              Skip the cake. Our giant personalized birthday cookies are the KeksPoint way to
              celebrate — order at least 72 hours ahead and we&rsquo;ll work out the flavor and
              personalization with you directly, ready for pickup in-store.
            </p>
            <a
              href="https://www.instagram.com/kekspoint.hr/"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-brand-red transition hover:opacity-90"
            >
              Order Yours
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
