import mongoose, { Schema, Document, Model } from "mongoose";

interface IPlan extends Document {
  highlights: string;
  name: string;
  price: number;
  startdate: string;
  enddate: string;
  destination: string;
  duration: string; 
  description?: string;
}

const planSchema = new Schema<IPlan>(
  {
    highlights: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    startdate: { type: String, required: true },
    enddate: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Plan: Model<IPlan> =
  mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);
