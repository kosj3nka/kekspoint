// app/admin/MenuItemRow.tsx
"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import MenuItemForm from "./MenuItemForm";
import { deleteMenuItem, toggleMenuItemField } from "./actions";
import type { MenuItem } from "@/lib/menu";

function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]">
      <path
        d="M13.5 3.5l3 3L6 17H3v-3l10.5-10.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]">
      <path d="M4 6h12M8 6V4h4v2M6 6l.7 10h6.6L14 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 9v4M11.5 9v4" strokeLinecap="round" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]">
      <rect x="3" y="4" width="14" height="3" rx="0.5" />
      <path d="M4.5 7v8a1 1 0 001 1h9a1 1 0 001-1V7" />
      <path d="M8.5 10.5h3" strokeLinecap="round" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]">
      <path d="M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4.5 8a5.5 5.5 0 1 1 1.4 5.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GripIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-[18px] w-[18px]">
      <circle cx="7" cy="5" r="1.4" />
      <circle cx="13" cy="5" r="1.4" />
      <circle cx="7" cy="10" r="1.4" />
      <circle cx="13" cy="10" r="1.4" />
      <circle cx="7" cy="15" r="1.4" />
      <circle cx="13" cy="15" r="1.4" />
    </svg>
  );
}

type MenuItemRowProps = {
  item: MenuItem;
  dragHandleProps?: {
    onDragStart: () => void;
    onDragEnd: () => void;
  };
  onDragOver?: () => void;
  onDrop?: () => void;
  isDragTarget?: boolean;
};

export default function MenuItemRow({ item, dragHandleProps, onDragOver, onDrop, isDragTarget }: MenuItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (editing) {
    return (
      <div className="rounded-xl border border-brand-red/15 p-4">
        <MenuItemForm item={item} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  function setActive(value: boolean) {
    setError(null);
    startTransition(async () => {
      const result = await toggleMenuItemField(item.id, "is_active", value);
      if ("error" in result) setError(result.error);
    });
  }

  return (
    <div
      onDragOver={
        dragHandleProps
          ? (event) => {
              event.preventDefault();
              onDragOver?.();
            }
          : undefined
      }
      onDrop={
        dragHandleProps
          ? (event) => {
              event.preventDefault();
              onDrop?.();
            }
          : undefined
      }
      className={`flex flex-wrap items-center gap-4 rounded-xl border p-3 transition ${
        isDragTarget ? "border-brand-red" : "border-brand-red/15"
      }`}
    >
      {dragHandleProps && (
        <span
          draggable
          onDragStart={dragHandleProps.onDragStart}
          onDragEnd={dragHandleProps.onDragEnd}
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className="shrink-0 cursor-grab text-brand-red/40 transition hover:text-brand-red/70 active:cursor-grabbing"
        >
          <GripIcon />
        </span>
      )}

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
          checked={item.isBestSeller}
          disabled={isPending}
          onChange={(event) => {
            const checked = event.target.checked;
            setError(null);
            startTransition(async () => {
              const result = await toggleMenuItemField(item.id, "is_best_seller", checked);
              if ("error" in result) setError(result.error);
            });
          }}
        />
        Best Seller
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit"
          title="Edit"
          className="text-brand-red transition hover:opacity-70"
        >
          <EditIcon />
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (confirm(`Delete "${item.name}"? This can't be undone.`)) {
              setError(null);
              startTransition(async () => {
                const result = await deleteMenuItem(item.id);
                if ("error" in result) setError(result.error);
              });
            }
          }}
          aria-label="Delete"
          title="Delete"
          className="text-red-700 transition hover:opacity-70 disabled:opacity-50"
        >
          <TrashIcon />
        </button>

        {item.isActive ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (confirm(`Archive "${item.name}"? You can restore it later from the archived list.`)) {
                setActive(false);
              }
            }}
            aria-label="Archive"
            title="Archive"
            className="text-brand-red transition hover:opacity-70 disabled:opacity-50"
          >
            <ArchiveIcon />
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setActive(true)}
            aria-label="Restore"
            title="Restore"
            className="text-brand-red transition hover:opacity-70 disabled:opacity-50"
          >
            <RestoreIcon />
          </button>
        )}
      </div>

      {error && <p className="w-full font-sans text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}
