export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex h-screen items-center justify-center overflow-hidden bg-brand-red text-cream"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/cookieTimelapse.mp4"
        poster="/assets/3cookies.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/50" />
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-6xl">KeksPoint</h1>
        <p className="font-sans text-lg tracking-wide">Crispy outside, soft inside</p>
      </div>
      <svg
        className="absolute bottom-8 left-1/2 z-10 h-8 w-8 -translate-x-1/2 text-cream"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </section>
  );
}
