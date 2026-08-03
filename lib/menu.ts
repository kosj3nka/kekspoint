import { getPublicSupabaseClient } from "./supabase/public";

export const ALLERGENS = ["gluten", "dairy", "eggs", "nuts", "peanuts", "soy"] as const;
export type Allergen = (typeof ALLERGENS)[number];

export const MAX_DESCRIPTION_WORDS = 25;

export function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  allergens: Allergen[];
  isBestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
  woltUrl: string | null;
  glovoUrl: string | null;
};

type MenuItemRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  allergens: string[];
  is_best_seller: boolean;
  is_active: boolean;
  sort_order: number;
  wolt_url: string | null;
  glovo_url: string | null;
};

export const MENU_ITEM_COLUMNS =
  "id, name, description, price, image_url, allergens, is_best_seller, is_active, sort_order, wolt_url, glovo_url";

export function mapMenuItemRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url,
    allergens: row.allergens.filter((value): value is Allergen =>
      (ALLERGENS as readonly string[]).includes(value),
    ),
    isBestSeller: row.is_best_seller,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    woltUrl: row.wolt_url,
    glovoUrl: row.glovo_url,
  };
}

export async function getActiveMenuItems(): Promise<MenuItem[]> {
  const supabase = getPublicSupabaseClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load menu items", error);
    return [];
  }

  return (data ?? []).map(mapMenuItemRow);
}
