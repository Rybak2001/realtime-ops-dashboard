import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import UserMenu from "@/components/UserMenu";

export const metadata: Metadata = {
  title: "Ops Dashboard - Monitoreo Operativo",
  description: "Módulo de monitoreo operativo en tiempo real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-900 min-h-screen text-gray-100">
        <AuthProvider>
          <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="text-lg font-bold text-emerald-400">
                ⚡ OpsBoard
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link href="/" className="text-gray-300 hover:text-emerald-400 transition">
                  Dashboard
                </Link>
                <Link href="/incidents" className="text-gray-300 hover:text-emerald-400 transition">
                  Incidencias
                </Link>
                <Link
                  href="/incidents/new"
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-md hover:bg-emerald-700 transition"
                >
                  + Incidencia
                </Link>
                <UserMenu />
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
