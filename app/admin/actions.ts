"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import {
  ALLERGENS,
  MAX_DESCRIPTION_WORDS,
  countWords,
  menuItems,
  type Allergen,
  type MenuItem,
} from "@/lib/menu";

export type ActionResult = { error: string } | { success: true };

function revalidateMenuPaths() {
  revalidatePath("/menu");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getAllMenuItemsForAdmin(): Promise<MenuItem[]> {
  return [...menuItems].sort((a, b) => a.sortOrder - b.sortOrder);
}

function parseAllergens(formData: FormData): Allergen[] {
  const values = formData.getAll("allergens").map(String);
  return ALLERGENS.filter((allergen) => values.includes(allergen));
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be under 5MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function saveMenuItem(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const woltUrl = String(formData.get("wolt_url") ?? "").trim();
  const glovoUrl = String(formData.get("glovo_url") ?? "").trim();
  const price = Number.parseFloat(String(formData.get("price") ?? ""));
  const isBestSeller = formData.get("is_best_seller") === "on";
  const isActive = formData.get("is_active") === "on";
  const allergens = parseAllergens(formData);
  const imageFile = formData.get("image");

  if (!name) return { error: "Name is required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };
  if (countWords(description) > MAX_DESCRIPTION_WORDS) {
    return { error: `Description must be ${MAX_DESCRIPTION_WORDS} words or fewer.` };
  }

  const hasImage = imageFile instanceof File && imageFile.size > 0;
  if (!id && !hasImage) return { error: "A photo is required for new items." };

  let imageUrl: string | undefined;
  try {
    if (hasImage) {
      imageUrl = await fileToDataUrl(imageFile as File);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  if (id) {
    const existing = menuItems.find((item) => item.id === id);
    if (!existing) return { error: "Item not found." };

    existing.name = name;
    existing.description = description || null;
    existing.woltUrl = woltUrl || null;
    existing.glovoUrl = glovoUrl || null;
    existing.price = price;
    existing.allergens = allergens;
    existing.isBestSeller = isBestSeller;
    existing.isActive = isActive;
    if (imageUrl) existing.imageUrl = imageUrl;
  } else {
    const nextSortOrder = menuItems.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;

    menuItems.push({
      id: randomUUID(),
      name,
      description: description || null,
      price,
      imageUrl: imageUrl ?? null,
      allergens,
      isBestSeller,
      isActive,
      sortOrder: nextSortOrder,
      woltUrl: woltUrl || null,
      glovoUrl: glovoUrl || null,
    });
  }

  revalidateMenuPaths();
  return { success: true };
}

export async function reorderMenuItems(orderedIds: string[]): Promise<ActionResult> {
  orderedIds.forEach((id, index) => {
    const item = menuItems.find((entry) => entry.id === id);
    if (item) item.sortOrder = index;
  });

  revalidateMenuPaths();
  return { success: true };
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const index = menuItems.findIndex((item) => item.id === id);
  if (index === -1) return { error: "Item not found." };

  menuItems.splice(index, 1);

  revalidateMenuPaths();
  return { success: true };
}

export async function toggleMenuItemField(
  id: string,
  field: "is_active" | "is_best_seller",
  value: boolean,
): Promise<ActionResult> {
  const item = menuItems.find((entry) => entry.id === id);
  if (!item) return { error: "Item not found." };

  if (field === "is_active") {
    item.isActive = value;
  } else {
    item.isBestSeller = value;
  }

  revalidateMenuPaths();
  return { success: true };
}
