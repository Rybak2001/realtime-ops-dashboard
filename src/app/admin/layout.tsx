"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/users", label: "Usuarios", icon: "👥" },
  { href: "/admin/incidents", label: "Incidencias", icon: "🔴" },
  { href: "/", label: "← Monitor", icon: "" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
  if (!user || user.role !== "admin") return null;

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      <aside className="w-56 bg-gray-950 text-white p-4 space-y-1 border-r border-gray-800">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Admin Panel</h2>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`block px-3 py-2 rounded-lg text-sm transition ${pathname === link.href ? "bg-emerald-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            {link.icon} {link.label}
          </Link>
        ))}
      </aside>
      <div className="flex-1 p-6 bg-gray-900">{children}</div>
    </div>
  );
}
