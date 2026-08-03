// app/(site)/menu/page.tsx
import FloatingNav from "@/components/layout/FloatingNav";
import Footer from "@/components/layout/Footer";
import MenuGrid from "@/components/menu/MenuGrid";
import { getActiveMenuItems } from "@/lib/menu";

export const revalidate = 60;

export default async function MenuPage() {
  const items = await getActiveMenuItems();

  return (
    <>
      <FloatingNav alwaysVisible />
      <main className="min-h-screen bg-cream px-6 py-20 text-brand-red">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-12 text-center font-script text-6xl">Menu</h1>
          {items.length === 0 ? (
            <p className="text-center font-sans text-sm text-brand-red/70">
              The menu is being updated — check back soon.
            </p>
          ) : (
            <MenuGrid items={items} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
