// app/admin/AdminPanel.tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import MenuItemForm from "./MenuItemForm";
import MenuItemRow from "./MenuItemRow";
import { reorderMenuItems } from "./actions";
import type { MenuItem } from "@/lib/menu";

export default function AdminPanel({ items }: { items: MenuItem[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [prevItems, setPrevItems] = useState(items);
  const [liveItems, setLiveItems] = useState(() => items.filter((item) => item.isActive));
  const archivedItems = items.filter((item) => !item.isActive);
  const dragFromIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  if (items !== prevItems) {
    setPrevItems(items);
    setLiveItems(items.filter((item) => item.isActive));
  }

  function handleDrop(dropIndex: number) {
    const fromIndex = dragFromIndex.current;
    dragFromIndex.current = null;
    setDragOverIndex(null);
    if (fromIndex === null || fromIndex === dropIndex) return;

    const next = [...liveItems];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(dropIndex, 0, moved);

    setLiveItems(next);
    reorderMenuItems(next.map((entry) => entry.id));
  }

  return (
    <div className="min-h-screen bg-cream px-6 py-12 font-sans text-brand-red">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl">Menu Admin</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-brand-red/25 px-4 py-2 font-sans text-sm font-bold text-brand-red transition hover:bg-brand-red/5"
            >
              Back to site
            </Link>
            <button
              type="button"
              onClick={() => setShowAddForm((prev) => !prev)}
              className="rounded-full bg-brand-red px-4 py-2 font-sans text-sm font-bold text-cream transition hover:opacity-90"
            >
              {showAddForm ? "Cancel" : "Add item"}
            </button>
          </div>
        </div>

        {showAddForm && (
          <section className="mb-12">
            <MenuItemForm onSaved={() => setShowAddForm(false)} />
          </section>
        )}

        <section id="item-list" className="mb-12">
          <h2 className="mb-4 font-heading text-xl font-bold">Live ({liveItems.length})</h2>
          <div className="flex flex-col gap-3">
            {liveItems.map((item, index) => (
              <MenuItemRow
                key={item.id}
                item={item}
                dragHandleProps={{
                  onDragStart: () => {
                    dragFromIndex.current = index;
                  },
                  onDragEnd: () => {
                    dragFromIndex.current = null;
                    setDragOverIndex(null);
                  },
                }}
                onDragOver={() => setDragOverIndex(index)}
                onDrop={() => handleDrop(index)}
                isDragTarget={dragOverIndex === index}
              />
            ))}
            {liveItems.length === 0 && (
              <p className="font-sans text-sm text-brand-red/60">No live items.</p>
            )}
          </div>
        </section>

        {archivedItems.length > 0 && (
          <section id="archived-list" className="opacity-50">
            <h2 className="mb-4 font-heading text-xl font-bold">Archived ({archivedItems.length})</h2>
            <div className="flex flex-col gap-3">
              {archivedItems.map((item) => (
                <MenuItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
