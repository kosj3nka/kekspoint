// components/menu/MenuGrid.tsx
"use client";

import { useState } from "react";
import MenuCard from "@/components/menu/MenuCard";
import type { MenuItem } from "@/lib/menu";

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          expanded={item.id === expandedId}
          onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
        />
      ))}
    </div>
  );
}
