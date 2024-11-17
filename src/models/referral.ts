import mongoose, { Schema, Document, Model } from "mongoose";

interface IReferral extends Document {
  referrerId: mongoose.Types.ObjectId;
  referredUserId: mongoose.Types.ObjectId;
  referralCode: string;
  usedup: boolean;
}

const referralSchema = new Schema<IReferral>(
  {
    referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    referredUserId: { type: Schema.Types.ObjectId, default: null },
    referralCode: { type: String, required: true },
    usedup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Referral: Model<IReferral> =
  mongoose.models.Referral ||
  mongoose.model<IReferral>("Referral", referralSchema);
