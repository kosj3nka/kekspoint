// app/admin/MenuItemForm.tsx
"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveMenuItem, type ActionResult } from "./actions";
import { ALLERGENS, MAX_DESCRIPTION_WORDS, countWords, type MenuItem } from "@/lib/menu";

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
  onCancel?: () => void;
};

function ImageDropzone({
  currentImageUrl,
  required,
}: {
  currentImageUrl?: string | null;
  required: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function setFile(file: File | null) {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
    setFileName(file?.name ?? null);
  }

  function clearFile() {
    if (inputRef.current) inputRef.current.value = "";
    setFile(null);
  }

  const displayUrl = previewUrl ?? currentImageUrl ?? null;

  return (
    <div className="flex flex-col gap-1.5 text-sm font-semibold">
      Photo
      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file && inputRef.current) {
            const transfer = new DataTransfer();
            transfer.items.add(file);
            inputRef.current.files = transfer.files;
            setFile(file);
          }
        }}
        className={`flex cursor-pointer items-center gap-3 rounded-md border-2 border-dashed px-3 py-3 transition ${
          isDragging ? "border-brand-red bg-brand-red/5" : "border-brand-red/25 hover:border-brand-red/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          name="image"
          accept="image/*"
          required={required}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="sr-only"
        />

        {displayUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={displayUrl} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-brand-red/5 text-brand-red/40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-6 w-6"
              aria-hidden
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="9" cy="10" r="1.75" fill="currentColor" stroke="none" />
              <path d="M4.5 17.5 9 13a2 2 0 0 1 2.8 0l.7.7" />
              <path d="M13 15.5 15.5 13a2 2 0 0 1 2.8 0L21 15.7" />
            </svg>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs font-normal">
          <span className="truncate font-semibold text-brand-red">
            {fileName ?? (currentImageUrl ? "Current photo — click to replace" : "Click or drag an image here")}
          </span>
          <span className="text-brand-red/50">PNG or JPG, up to 5MB</span>
        </div>

        {fileName && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              clearFile();
            }}
            className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-brand-red/60 transition hover:bg-brand-red/10"
          >
            Remove
          </button>
        )}
      </label>

      <p className="text-xs font-normal text-brand-red/50">
        Pazi da je .png datoteka 1:1 i skroz je croppana da ostane jako malo praznog prostore na slici.
      </p>
    </div>
  );
}

export default function MenuItemForm({ item, onSaved, onCancel }: MenuItemFormProps) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    saveMenuItem,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const isEdit = Boolean(item);
  const [descriptionWords, setDescriptionWords] = useState(() => countWords(item?.description ?? ""));

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
          onChange={(event) => setDescriptionWords(countWords(event.target.value))}
          rows={2}
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
        <span
          className={`self-end text-xs font-normal ${descriptionWords > MAX_DESCRIPTION_WORDS ? "text-red-700" : "text-brand-red/50"}`}
        >
          {descriptionWords}/{MAX_DESCRIPTION_WORDS} words
        </span>
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

      <ImageDropzone currentImageUrl={item?.imageUrl} required={!isEdit} />

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Wolt link
        <input
          type="url"
          name="wolt_url"
          defaultValue={item?.woltUrl ?? ""}
          placeholder="https://wolt.com/..."
          className="rounded-md border border-brand-red/25 px-3 py-2 font-sans text-sm font-normal"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Glovo link
        <input
          type="url"
          name="glovo_url"
          defaultValue={item?.glovoUrl ?? ""}
          placeholder="https://glovoapp.com/..."
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

      <div className="mt-2 flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-1/3 rounded-full bg-brand-red/10 px-4 py-2 font-sans text-sm font-bold text-brand-red transition hover:bg-brand-red/15"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-full bg-brand-red px-4 py-2 font-sans text-sm font-bold text-cream transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Add item"}
        </button>
      </div>
    </form>
  );
}
