// app/admin/MenuItemRow.tsx
"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import MenuItemForm from "./MenuItemForm";
import { deleteMenuItem, toggleMenuItemField } from "./actions";
import type { MenuItem } from "@/lib/menu";

export default function MenuItemRow({ item }: { item: MenuItem }) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <div className="rounded-xl border border-brand-red/15 p-4">
        <MenuItemForm item={item} onSaved={() => setEditing(false)} />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="mt-2 font-sans text-xs font-semibold underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-brand-red/15 p-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-cream">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
        )}
      </div>

      <div className="min-w-32 flex-1">
        <p className="font-sans text-sm font-bold">{item.name}</p>
        <p className="font-sans text-xs text-brand-red/70">€{item.price.toFixed(2)}</p>
      </div>

      <label className="flex items-center gap-1.5 font-sans text-xs">
        <input
          type="checkbox"
          checked={item.isActive}
          disabled={isPending}
          onChange={(event) => {
            const checked = event.target.checked;
            startTransition(() => {
              toggleMenuItemField(item.id, "is_active", checked);
            });
          }}
        />
        Active
      </label>

      <label className="flex items-center gap-1.5 font-sans text-xs">
        <input
          type="checkbox"
          checked={item.isBestSeller}
          disabled={isPending}
          onChange={(event) => {
            const checked = event.target.checked;
            startTransition(() => {
              toggleMenuItemField(item.id, "is_best_seller", checked);
            });
          }}
        />
        Best Seller
      </label>

      <button type="button" onClick={() => setEditing(true)} className="font-sans text-xs font-semibold underline">
        Edit
      </button>

      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Delete "${item.name}"?`)) {
            startTransition(() => {
              deleteMenuItem(item.id);
            });
          }
        }}
        className="font-sans text-xs font-semibold text-red-700 underline"
      >
        Delete
      </button>
    </div>
  );
}
