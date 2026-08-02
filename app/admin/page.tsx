// app/admin/page.tsx
import { getAllMenuItemsForAdmin } from "./actions";
import MenuItemForm from "./MenuItemForm";
import MenuItemRow from "./MenuItemRow";

export default async function AdminPage() {
  const items = await getAllMenuItemsForAdmin();

  return (
    <div className="min-h-screen bg-cream px-6 py-12 font-sans text-brand-red">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 font-display text-3xl">Menu Admin</h1>

        <section id="add-item" className="mb-12">
          <h2 className="mb-4 font-heading text-xl font-bold">Add item</h2>
          <MenuItemForm />
        </section>

        <section id="item-list">
          <h2 className="mb-4 font-heading text-xl font-bold">All items ({items.length})</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
