import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about" className="bg-cream text-brand-red">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-24 md:flex-row">
        <div className="w-full md:w-1/2">
          <h2 className="font-display text-4xl">About Us</h2>
          <p className="mt-6 font-sans text-base leading-relaxed">
            KeksPoint started with one simple idea: bring real American-style cookies to Zagreb.
            Founder Marija Petrović turned a love of baking into one of the city&rsquo;s most-loved
            sweet spots — and just celebrated the shop&rsquo;s first birthday. Every cookie is baked
            fresh in-house, the same way, every day: crispy outside, soft inside, and always
            richly filled. Come find us on Papova ulica 2, open daily from 10:00 to 23:00.
          </p>
        </div>
        <div className="relative w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <Image
              src="/assets/aboutUs.jpg"
              alt="Inside the KeksPoint cookie shop"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 flex gap-2">
            <div className="relative h-28 w-20 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-36 sm:w-28">
              <Image
                src="/assets/worker.jpg"
                alt="A KeksPoint baker at work"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="relative h-28 w-20 overflow-hidden rounded-sm border-4 border-cream shadow-lg sm:h-36 sm:w-28">
              <Image
                src="/assets/shop.jpg"
                alt="The KeksPoint storefront on Papova ulica"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
