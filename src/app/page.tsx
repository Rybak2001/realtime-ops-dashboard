"use client";

import { useEffect, useState } from "react";
import { SeverityChart, AreaChart, TrendChart } from "@/components/Charts";

interface Metrics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  bySeverity: { critical: number; high: number; medium: number; low: number };
  byArea: { area: string; total: number; open: number }[];
  last7Days: { date: string; label: string; count: number }[];
  avgResolutionHours: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then(setMetrics);

    const interval = setInterval(() => {
      fetch("/api/metrics")
        .then((r) => r.json())
        .then(setMetrics);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">
        Cargando dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Monitoreo Operativo</h1>
          <p className="text-sm text-gray-400">
            Actualización automática cada 30s · Última: {new Date().toLocaleTimeString("es")}
          </p>
        </div>
        <a
          href="/api/export"
          className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-600 transition text-sm"
        >
          📥 Exportar CSV
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
          <p className="text-3xl font-bold text-white">{metrics.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Abiertas</p>
          <p className="text-3xl font-bold text-red-400">{metrics.open}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">En Progreso</p>
          <p className="text-3xl font-bold text-yellow-400">{metrics.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Resueltas</p>
          <p className="text-3xl font-bold text-green-400">{metrics.resolved}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Prom. Resolución</p>
          <p className="text-3xl font-bold text-indigo-400">{metrics.avgResolutionHours}h</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Por Severidad</h2>
          <SeverityChart data={metrics.bySeverity} />
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Tendencia - Últimos 7 Días</h2>
          <TrendChart data={metrics.last7Days} />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4">Incidencias por Área</h2>
        <AreaChart data={metrics.byArea} />
      </div>
    </div>
  );
}
