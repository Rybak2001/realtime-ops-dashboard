import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Incident from "@/models/Incident";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const incident = await Incident.findById(params.id).lean();
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(incident);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();

  const updateData: Record<string, unknown> = {
    title: body.title,
    description: body.description,
    area: body.area,
    severity: body.severity,
    status: body.status,
    assignedTo: body.assignedTo,
  };

  if (body.status === "resolved" || body.status === "closed") {
    updateData.resolvedAt = new Date();
  }

  const incident = await Incident.findByIdAndUpdate(params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(incident);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const incident = await Incident.findByIdAndDelete(params.id);
  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ message: "Deleted" });
}
