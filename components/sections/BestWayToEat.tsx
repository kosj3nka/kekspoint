import Image from "next/image";

export default function BestWayToEat() {
  return (
    <section id="best-way" className="bg-cream text-brand-red">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/eatingCookie.jpg"
              alt="A woman biting into a freshly baked KeksPoint cookie outdoors in a grassy field"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">The Best Way to Eat It</h2>
        </div>
      </div>
    </section>
  );
}
