// app/admin/MenuItemForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { saveMenuItem, type ActionResult } from "./actions";
import { ALLERGENS, type MenuItem } from "@/lib/menu";

const ALLERGEN_LABELS: Record<string, string> = {
  gluten: "Gluten",
  dairy: "Dairy",
  eggs: "Eggs",
  nuts: "Nuts",
  peanuts: "Peanuts",
  soy: "Soy",
};

type MenuItemFormProps = {
  item?: MenuItem;
  onSaved?: () => void;
};

export default function MenuItemForm({ item, onSaved }: MenuItemFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    saveMenuItem,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(item);

  useEffect(() => {
    if (state && "success" in state) {
      if (!isEdit) formRef.current?.reset();
      onSaved?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3 rounded-xl border border-brand-red/15 p-4">
      {item && <input type="hidden" name="id" defaultValue={item.id} />}

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Name
        <input
          type="text"
          name="name"
          required
          defaultValue={item?.name}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Description
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={2}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Price (EUR)
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          required
          defaultValue={item?.price}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <fieldset className="flex flex-col gap-1 text-sm font-semibold">
        <legend>Allergens</legend>
        <div className="flex flex-wrap gap-3 font-normal">
          {ALLERGENS.map((allergen) => (
            <label key={allergen} className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                name="allergens"
                value={allergen}
                defaultChecked={item?.allergens.includes(allergen)}
              />
              {ALLERGEN_LABELS[allergen]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Photo {isEdit ? "(leave blank to keep current)" : ""}
        <input type="file" name="image" accept="image/*" required={!isEdit} />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Sort order
        <input
          type="number"
          name="sort_order"
          defaultValue={item?.sortOrder ?? 0}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="is_best_seller" defaultChecked={item?.isBestSeller} />
        Best Seller
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="is_active" defaultChecked={item?.isActive ?? true} />
        Active (visible on the site)
      </label>

      {state && "error" in state && (
        <p className="font-sans text-sm font-semibold text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-brand-red px-4 py-2 font-sans text-sm font-bold text-cream transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? "Saving…" : isEdit ? "Save changes" : "Add item"}
      </button>
    </form>
  );
}
