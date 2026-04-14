import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (auth instanceof NextResponse) return auth;
  await dbConnect();

  const [totalIncidents, totalUsers, incidents] = await Promise.all([
    Incident.countDocuments(),
    User.countDocuments(),
    Incident.find().lean(),
  ]);

  const bySeverity: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byArea: Record<string, number> = {};
  for (const inc of incidents) {
    const i = inc as Record<string, unknown>;
    const s = (i.severity as string) || "unknown";
    const st = (i.status as string) || "unknown";
    const a = (i.area as string) || "unknown";
    bySeverity[s] = (bySeverity[s] || 0) + 1;
    byStatus[st] = (byStatus[st] || 0) + 1;
    byArea[a] = (byArea[a] || 0) + 1;
  }

  const openCount = (byStatus["open"] || 0) + (byStatus["in_progress"] || 0);
  const recentIncidents = await Incident.find().sort({ createdAt: -1 }).limit(10).lean();

  return NextResponse.json({ totalIncidents, totalUsers, bySeverity, byStatus, byArea, openCount, recentIncidents });
}
