import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const area = searchParams.get("area");
  const severity = searchParams.get("severity");

  const filter: Record<string, string> = {};
  if (status) filter.status = status;
  if (area) filter.area = area;
  if (severity) filter.severity = severity;

  const incidents = await Incident.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json(incidents);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();

  const incident = await Incident.create({
    title: body.title,
    description: body.description || "",
    area: body.area,
    severity: body.severity || "medium",
    status: body.status || "open",
    assignedTo: body.assignedTo || "",
  });

  return NextResponse.json(incident, { status: 201 });
}
