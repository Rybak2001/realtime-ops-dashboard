"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    setLoading(true);
    const err = await register(email, password, name);
    setLoading(false);
    if (err) setError(err);
    else router.push("/");
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚡</div>
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-gray-400 text-sm">Únete a OpsBoard</p>
        </div>
        {error && <div className="bg-red-900/50 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500" placeholder="tu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500" placeholder="Mínimo 6 caracteres" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition disabled:opacity-50">
            {loading ? "Creando..." : "Crear Cuenta"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">¿Ya tienes cuenta? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
