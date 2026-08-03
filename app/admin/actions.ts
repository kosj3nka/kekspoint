"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  ALLERGENS,
  MAX_DESCRIPTION_WORDS,
  MENU_ITEM_COLUMNS,
  countWords,
  mapMenuItemRow,
  type Allergen,
  type MenuItem,
} from "@/lib/menu";

export type ActionResult = { error: string } | { success: true };

const BUCKET = "menu-images";

function revalidateMenuPaths() {
  revalidatePath("/menu");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getAllMenuItemsForAdmin(): Promise<MenuItem[]> {
  const supabase = getAdminSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load menu items for admin", error);
    return [];
  }

  return (data ?? []).map(mapMenuItemRow);
}

function parseAllergens(formData: FormData): Allergen[] {
  const values = formData.getAll("allergens").map(String);
  return ALLERGENS.filter((allergen) => values.includes(allergen));
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be under 5MB.");
  }

  const supabase = getAdminSupabaseClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
  });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
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
      imageUrl = await uploadImage(imageFile as File);
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Image upload failed." };
  }

  const supabase = getAdminSupabaseClient();
  const record = {
    name,
    description: description || null,
    wolt_url: woltUrl || null,
    glovo_url: glovoUrl || null,
    price,
    allergens,
    is_best_seller: isBestSeller,
    is_active: isActive,
    ...(imageUrl ? { image_url: imageUrl } : {}),
  };

  if (id) {
    const { error } = await supabase.from("menu_items").update(record).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { data: maxRow } = await supabase
      .from("menu_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextSortOrder = (maxRow?.sort_order ?? -1) + 1;

    const { error } = await supabase.from("menu_items").insert({ ...record, sort_order: nextSortOrder });
    if (error) return { error: error.message };
  }

  revalidateMenuPaths();
  return { success: true };
}

export async function reorderMenuItems(orderedIds: string[]): Promise<ActionResult> {
  const supabase = getAdminSupabaseClient();
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from("menu_items").update({ sort_order: index }).eq("id", id)),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) return { error: failed.error.message };

  revalidateMenuPaths();
  return { success: true };
}

export async function deleteMenuItem(id: string): Promise<ActionResult> {
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateMenuPaths();
  return { success: true };
}

export async function toggleMenuItemField(
  id: string,
  field: "is_active" | "is_best_seller",
  value: boolean,
): Promise<ActionResult> {
  const supabase = getAdminSupabaseClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ [field]: value })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateMenuPaths();
  return { success: true };
}
