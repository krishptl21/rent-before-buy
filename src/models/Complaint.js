import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);