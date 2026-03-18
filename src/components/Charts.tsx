"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AreaData {
  area: string;
  total: number;
  open: number;
}

interface DayData {
  label: string;
  count: number;
}

interface SeverityData {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function SeverityChart({ data }: { data: SeverityData }) {
  return (
    <Doughnut
      data={{
        labels: ["Crítica", "Alta", "Media", "Baja"],
        datasets: [
          {
            data: [data.critical, data.high, data.medium, data.low],
            backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e"],
            borderWidth: 0,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#9ca3af", padding: 12, font: { size: 11 } },
          },
        },
      }}
    />
  );
}

export function AreaChart({ data }: { data: AreaData[] }) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.area),
        datasets: [
          {
            label: "Total",
            data: data.map((d) => d.total),
            backgroundColor: "#6366f1",
            borderRadius: 4,
          },
          {
            label: "Abiertas",
            data: data.map((d) => d.open),
            backgroundColor: "#ef4444",
            borderRadius: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#9ca3af", font: { size: 11 } },
          },
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
          y: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
        },
      }}
    />
  );
}

export function TrendChart({ data }: { data: DayData[] }) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            label: "Incidencias",
            data: data.map((d) => d.count),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#10b981",
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#9ca3af", font: { size: 11 } },
          },
        },
        scales: {
          x: { ticks: { color: "#9ca3af" }, grid: { color: "#374151" } },
          y: {
            beginAtZero: true,
            ticks: { color: "#9ca3af", stepSize: 1 },
            grid: { color: "#374151" },
          },
        },
      }}
    />
  );
}
