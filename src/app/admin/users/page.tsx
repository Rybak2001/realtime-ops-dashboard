"use client";

import { useEffect, useState } from "react";

interface User { _id: string; email: string; name: string; role: string; active: boolean; createdAt: string; }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "viewer" });
  const [error, setError] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
  }

  async function createUser() {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Todos los campos son requeridos"); return; }
    const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { const e = await res.json(); setError(e.error); return; }
    setForm({ name: "", email: "", password: "", role: "viewer" });
    setShowCreate(false);
    fetchUsers();
  }

  async function changeRole(user: User, role: string) {
    await fetch(`/api/users/${user._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    fetchUsers();
  }

  async function toggleActive(user: User) {
    await fetch(`/api/users/${user._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !user.active }) });
    fetchUsers();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition">+ Nuevo Usuario</button>
      </div>

      {showCreate && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-6">
          <h2 className="font-semibold text-white mb-3">Crear Usuario</h2>
          {error && <div className="bg-red-900/50 text-red-300 text-sm rounded-lg px-4 py-2 mb-3">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre" className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500" />
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Contraseña" type="password" className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="viewer">Viewer</option>
              <option value="operator">Operator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={createUser} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700">Crear</button>
            <button onClick={() => setShowCreate(false)} className="border border-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Usuario</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Rol</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((u) => (
              <tr key={u._id} className={!u.active ? "opacity-50" : ""}>
                <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                <td className="px-4 py-3">
                  <select value={u.role} onChange={(e) => changeRole(u, e.target.value)} className="text-xs bg-gray-700 border border-gray-600 text-white rounded px-2 py-1">
                    <option value="viewer">Viewer</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.active ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                    {u.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(u)} className={`text-xs px-2 py-1 rounded ${u.active ? "bg-red-900/50 text-red-300 hover:bg-red-900" : "bg-green-900/50 text-green-300 hover:bg-green-900"}`}>
                    {u.active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
