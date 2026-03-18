import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  title: string;
  description: string;
  area: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    area: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    assignedTo: { type: String, default: "" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Incident || mongoose.model<IIncident>("Incident", IncidentSchema);
