import mongoose, { Schema, Document, Model } from "mongoose";

interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  date: Date;
}

const historySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    date: { type: Date, default: () => Date.now() },
  },
  { timestamps: true }
);

export const History: Model<IHistory> =
  mongoose.models.History || mongoose.model<IHistory>("History", historySchema);
