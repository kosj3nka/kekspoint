import Image from "next/image";

const DELIVERY_LINKS = [
  { label: "Wolt", href: "https://wolt.com" },
  { label: "Glovo", href: "https://glovoapp.com" },
  { label: "Bolt", href: "https://bolt.eu" },
];

export default function Footer() {
  return (
    <footer id="visit" className="bg-grid bg-brand-red px-6 py-16 text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div>
          <Image
            src="/assets/logo.png"
            alt="KeksPoint"
            width={120}
            height={140}
            className="mb-4 h-12 w-auto brightness-0 invert"
          />
          <h3 className="font-heading text-2xl font-bold">KeksPoint</h3>
          <p className="mt-2 font-sans text-sm">Papova ulica 2, Zagreb</p>
          <p className="font-sans text-sm">Monday–Sunday, 10:00–23:00</p>
        </div>
        <div>
          <h4 className="font-sans text-sm tracking-wide uppercase">Order delivery</h4>
          <ul className="mt-2 flex gap-4 font-sans text-sm">
            {DELIVERY_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-script text-3xl">Follow us</h4>
          <a
            href="https://www.instagram.com/kekspoint.hr/"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block font-sans text-sm"
          >
            @kekspoint.hr
          </a>
        </div>
      </div>
    </footer>
  );
}
