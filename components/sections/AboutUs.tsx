import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about" className="bg-cream text-brand-red">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:grid-rows-[auto_auto] md:gap-8">
          <div className="md:col-span-2 md:row-start-1">
            <h2 className="font-script text-7xl sm:text-7xl">About  Us</h2>
            <p className="mt-4 font-sans text-base leading-relaxed">
              KeksPoint started with one simple idea: bring real <span className="font-bold"> American-style cookies </span>to Zagreb.
              Founder <span className="font-bold"> Marija Petrović </span>turned a love of baking into one of the city&rsquo;s most-loved
              sweet spots — and just celebrated the shop&rsquo;s first birthday. Every cookie is baked
              fresh in-house.
            </p>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm md:col-start-3 md:row-span-2 md:aspect-auto md:h-full">
            <Image
              src="/assets/aboutUs.jpg"
              alt="Inside the KeksPoint cookie shop"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm md:col-span-2 md:col-start-1 md:row-start-2 md:aspect-[21/9]">
            <Image
              src="/assets/shop.jpg"
              alt="The KeksPoint storefront on Papova ulica"
              fill
              sizes="(min-width: 768px) 66vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
