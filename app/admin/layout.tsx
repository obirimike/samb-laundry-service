import type { ReactNode } from "react";
import AdminNavigation from "@/components/admin/AdminNavigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-slate-50 lg:flex">
      <AdminNavigation />
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  );
}
