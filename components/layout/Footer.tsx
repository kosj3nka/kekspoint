import Image from "next/image";

const DELIVERY_LINKS = [
  { label: "Wolt", href: "https://wolt.com", src: "/assets/woltLogo.png", width: 66, height: 24 },
  { label: "Glovo", href: "https://glovoapp.com", src: "/assets/glovoLogo.png", width: 73, height: 24 },
];

export default function Footer() {
  return (
    <footer id="visit" className="bg-grid bg-brand-red px-6 py-16 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="flex flex-row gap-6">
          <div className="flex items-start">
            <Image
              src="/assets/logo.png"
              alt="KeksPoint"
              width={220}
              height={260}
              className="h-24 w-auto brightness-0 invert md:h-28"
            />
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold">KeksPoint</h3>
            <p className="mt-2 font-sans text-sm">Papova ulica 2, Zagreb</p>
            <p className="font-sans text-sm">Monday – Sunday <br /> 10:00 – 23:00</p>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-sm tracking-wide">Order delivery</h4>
          <ul className="mt-3 flex items-end gap-5">
            {DELIVERY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  <Image
                    src={link.src}
                    alt={link.label}
                    width={link.width}
                    height={link.height}
                    className="h-6 object-cover"
                    style={{ width: link.width }}
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 font-sans text-sm">Rescue today&apos;s extras for cheaper</p>
          <a
            href="https://crumbs.hr/store/keks-point/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center"
          >
            <Image
              src="/assets/crumbsLogo.png"
              alt="Crumbs"
              width={121}
              height={24}
              className="h-6 object-contain"
              style={{ width: 121 }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
