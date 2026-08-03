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

type MenuCardProps = {
  item: MenuItem;
  expanded: boolean;
  onToggle: () => void;
};

export default function MenuCard({ item, expanded, onToggle }: MenuCardProps) {
  // The detail overlay only covers the photo (aspect-square), leaving the
  // name/price row underneath visible and clickable — that's the only way to
  // close the card, since there's no separate Close button.
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/60 shadow-sm">
      <button type="button" onClick={onToggle} className="flex w-full flex-col text-left">
        <div className="relative aspect-square w-full bg-cream">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover p-5"
            />
          )}
          {item.isBestSeller && (
            <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 font-sans text-xs font-bold tracking-wide text-brand-red uppercase">
              Best Seller
            </span>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-2 p-4">
          <h3 className="font-heading text-lg font-bold">{item.name}</h3>
          <span className="font-sans text-sm font-semibold">€{item.price.toFixed(2)}</span>
        </div>
      </button>

      {expanded && (
        // The overlay sits on top of the button, so it needs its own onClick to let a
        // second tap collapse the card (the Wolt/Glovo links stop propagation so they
        // aren't swallowed).
        <div
          onClick={onToggle}
          className="absolute top-0 left-0 right-0 aspect-square cursor-pointer overflow-hidden bg-cream"
        >
          <div className="flex h-full flex-col gap-3 overflow-y-auto p-4">
            {item.description && <p className="font-sans text-sm text-brand-red/80">{item.description}</p>}

            {item.allergens.length > 0 && (
              <p className="font-sans text-xs text-brand-red/60">
                Contains: {item.allergens.map((allergen) => ALLERGEN_LABELS[allergen]).join(", ")}
              </p>
            )}

            {(item.woltUrl || item.glovoUrl) && (
              <div className="mt-auto flex flex-col gap-2">
                {item.woltUrl && (
                  <a
                    href={item.woltUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-center font-sans text-xs font-semibold text-brand-red transition hover:bg-brand-red/10"
                  >
                    Order on Wolt
                  </a>
                )}
                {item.glovoUrl && (
                  <a
                    href={item.glovoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full rounded-full border border-brand-red/20 bg-brand-red/5 px-4 py-2 text-center font-sans text-xs font-semibold text-brand-red transition hover:bg-brand-red/10"
                  >
                    Order on Glovo
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
