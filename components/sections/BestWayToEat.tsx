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
          <h2 className="font-script text-7xl sm:text-20xl">Mali vodič za slatko očuvanje</h2>
          <div className="relative mt-8 aspect-square w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/bestWayToEatSteps.jpg"
              alt="Six-step guide to keeping KeksPoint cookies fresh: store up to 3 days in an airtight container, avoid the fridge, use a sealed jar for longer freshness, thaw frozen cookies for 2 hours before eating, freeze for up to 3 months, or reheat in the oven at 180°C for 3-4 minutes"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
