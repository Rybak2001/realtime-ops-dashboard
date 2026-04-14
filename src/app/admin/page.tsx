"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalIncidents: number;
  totalUsers: number;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  byArea: Record<string, number>;
  openCount: number;
  recentIncidents: { _id: string; title: string; severity: string; status: string; area: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => { fetch("/api/admin/stats").then((r) => r.json()).then(setStats); }, []);

  if (!stats) return <div className="flex items-center justify-center min-h-[40vh]"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;

  const sevColors: Record<string, string> = { critical: "bg-red-500", high: "bg-orange-500", medium: "bg-yellow-500", low: "bg-green-500" };
  const statusColors: Record<string, string> = { open: "bg-red-900 text-red-300", in_progress: "bg-yellow-900 text-yellow-300", resolved: "bg-green-900 text-green-300", closed: "bg-gray-700 text-gray-300" };
  const statusLabels: Record<string, string> = { open: "Abierta", in_progress: "En Progreso", resolved: "Resuelta", closed: "Cerrada" };

  const kpis = [
    { label: "Total Incidencias", value: stats.totalIncidents, icon: "🔴", color: "bg-gray-800 border-gray-700" },
    { label: "Abiertas", value: stats.openCount, icon: "⚠️", color: "bg-gray-800 border-red-800" },
    { label: "Críticas", value: stats.bySeverity?.critical || 0, icon: "🚨", color: "bg-gray-800 border-orange-800" },
    { label: "Usuarios", value: stats.totalUsers, icon: "👥", color: "bg-gray-800 border-emerald-800" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`rounded-xl p-5 border ${kpi.color}`}>
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <p className="text-3xl font-bold text-white">{kpi.value}</p>
            <p className="text-sm text-gray-400">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="font-semibold text-white mb-4">Por Severidad</h2>
          <div className="space-y-3">
            {Object.entries(stats.bySeverity || {}).sort(([a], [b]) => ["critical","high","medium","low"].indexOf(a) - ["critical","high","medium","low"].indexOf(b)).map(([sev, count]) => (
              <div key={sev} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${sevColors[sev] || "bg-gray-500"}`} />
                <span className="text-sm text-gray-300 capitalize flex-1">{sev}</span>
                <span className="font-bold text-white">{count}</span>
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sevColors[sev] || "bg-gray-500"}`} style={{ width: `${Math.min(100, (count / stats.totalIncidents) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="font-semibold text-white mb-4">Por Estado</h2>
          <div className="space-y-3">
            {Object.entries(stats.byStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[status] || "bg-gray-700 text-gray-300"}`}>
                  {statusLabels[status] || status}
                </span>
                <span className="font-bold text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="font-semibold text-white mb-4">Por Área</h2>
          <div className="space-y-3">
            {Object.entries(stats.byArea || {}).sort(([,a], [,b]) => b - a).map(([area, count]) => (
              <div key={area} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{area}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{count}</span>
                  <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (count / stats.totalIncidents) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="font-semibold text-white mb-4">Últimas Incidencias</h2>
          <div className="space-y-2">
            {stats.recentIncidents?.slice(0, 8).map((inc) => (
              <div key={inc._id} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sevColors[inc.severity] || "bg-gray-500"}`} />
                  <span className="text-sm text-gray-300 truncate">{inc.title}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2 ${statusColors[inc.status] || ""}`}>
                  {statusLabels[inc.status] || inc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
