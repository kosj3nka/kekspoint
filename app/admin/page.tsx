// app/admin/page.tsx
import { getAllMenuItemsForAdmin } from "./actions";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const items = await getAllMenuItemsForAdmin();

  return <AdminPanel items={items} />;
}
