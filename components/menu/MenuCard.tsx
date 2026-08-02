// components/menu/MenuCard.tsx
import Image from "next/image";
import type { MenuItem } from "@/lib/menu";

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  eggs: "Eggs",
  nuts: "Nuts",
  peanuts: "Peanuts",
  soy: "Soy",
};

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white/60 shadow-sm">
      <div className="relative aspect-square w-full bg-cream">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
          />
        )}
        {item.isBestSeller && (
          <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-bold tracking-wide text-brand-red uppercase">
            Best Seller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-heading text-lg font-bold">{item.name}</h3>
          <span className="font-sans text-sm font-semibold">€{item.price.toFixed(2)}</span>
        </div>
        {item.description && (
          <p className="font-sans text-sm text-brand-red/80">{item.description}</p>
        )}
        {item.allergens.length > 0 && (
          <p className="mt-auto font-sans text-xs text-brand-red/60">
            Contains: {item.allergens.map((allergen) => ALLERGEN_LABELS[allergen]).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
