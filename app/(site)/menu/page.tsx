// app/(site)/menu/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { getActiveMenuItems } from "@/lib/menu";

export default async function MenuPage() {
  const items = await getActiveMenuItems();

  return (
    <>
      <FloatingNav />
      <main className="min-h-screen bg-cream px-6 py-24 text-brand-red">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-12 text-center font-script text-6xl">Menu</h1>
          {items.length === 0 ? (
            <p className="text-center font-sans text-sm text-brand-red/70">
              The menu is being updated — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
