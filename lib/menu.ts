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

// This is an archived showcase project — there's no live database anymore.
// These items live in memory, seeded as if they'd been added through the
// admin panel, and admin edits during a running session mutate this array
// directly (they won't survive a server restart).
export const menuItems: MenuItem[] = [
  {
    id: "bueno",
    name: "Bueno",
    description: "A soft-baked cookie stuffed with Kinder Bueno cream and chopped hazelnut wafer.",
    price: 3.5,
    imageUrl: "/assets/BUENO.png",
    allergens: ["gluten", "dairy", "eggs", "nuts"],
    isBestSeller: true,
    isActive: true,
    sortOrder: 0,
    woltUrl: null,
    glovoUrl: null,
  },
  {
    id: "nutella-cookie",
    name: "Nutella Cookie",
    description: "Warm, gooey cookie loaded with a molten Nutella center.",
    price: 3.5,
    imageUrl: "/assets/nutellaCookie.png",
    allergens: ["gluten", "dairy", "eggs", "nuts"],
    isBestSeller: true,
    isActive: true,
    sortOrder: 1,
    woltUrl: null,
    glovoUrl: null,
  },
  {
    id: "red-velvet",
    name: "Red Velvet",
    description: "Classic red velvet cookie with a rich cream cheese filling.",
    price: 3.5,
    imageUrl: "/assets/redVelvet.png",
    allergens: ["gluten", "dairy", "eggs"],
    isBestSeller: false,
    isActive: true,
    sortOrder: 2,
    woltUrl: null,
    glovoUrl: null,
  },
  {
    id: "lotus-cookie",
    name: "Lotus Cookie",
    description: "Soft cookie swirled with caramelized Lotus Biscoff spread and crushed biscuit.",
    price: 3.5,
    imageUrl: "/assets/lotusCookie.png",
    allergens: ["gluten", "dairy", "eggs"],
    isBestSeller: false,
    isActive: true,
    sortOrder: 3,
    woltUrl: null,
    glovoUrl: null,
  },
];

export async function getActiveMenuItems(): Promise<MenuItem[]> {
  return menuItems
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
