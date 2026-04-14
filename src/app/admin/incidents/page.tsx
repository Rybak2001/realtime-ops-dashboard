"use client";

import { useEffect, useState } from "react";

interface Incident { _id: string; title: string; area: string; severity: string; status: string; assignedTo: string; createdAt: string; }

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetch("/api/incidents").then((r) => r.json()).then(setIncidents); }, []);

  const filtered = filter === "all" ? incidents : incidents.filter((i) => i.status === filter);
  const sevColors: Record<string, string> = { critical: "bg-red-500", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-green-500" };
  const statusColors: Record<string, string> = { open: "bg-red-900 text-red-300", in_progress: "bg-yellow-900 text-yellow-300", resolved: "bg-green-900 text-green-300", closed: "bg-gray-700 text-gray-300" };
  const statusLabels: Record<string, string> = { open: "Abierta", in_progress: "En Progreso", resolved: "Resuelta", closed: "Cerrada" };

  async function deleteIncident(id: string) {
    if (!confirm("¿Eliminar esta incidencia?")) return;
    const res = await fetch(`/api/incidents/${id}`, { method: "DELETE" });
    if (res.ok) setIncidents((prev) => prev.filter((i) => i._id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Gestión de Incidencias</h1>

      <div className="flex gap-2 mb-4">
        {["all", "open", "in_progress", "resolved", "closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`text-xs px-3 py-1.5 rounded-full transition ${filter === s ? "bg-emerald-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
            {s === "all" ? "Todas" : statusLabels[s] || s} ({s === "all" ? incidents.length : incidents.filter((i) => i.status === s).length})
          </button>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Incidencia</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Área</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Severidad</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Asignado</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filtered.map((inc) => (
              <tr key={inc._id}>
                <td className="px-4 py-3 text-white font-medium">{inc.title}</td>
                <td className="px-4 py-3 text-gray-400">{inc.area}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${sevColors[inc.severity] || "bg-gray-500"}`} />
                    <span className="text-gray-300 capitalize">{inc.severity}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inc.status] || ""}`}>
                    {statusLabels[inc.status] || inc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{inc.assignedTo}</td>
                <td className="px-4 py-3">
                  <button onClick={() => deleteIncident(inc._id)} className="text-xs bg-red-900/50 hover:bg-red-900 text-red-300 px-2 py-1 rounded transition">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">No hay incidencias</p>}
      </div>
    </div>
  );
}
