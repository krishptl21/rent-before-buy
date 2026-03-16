import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["rent", "buy"],
      required: true,
    },
    rentalDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["demo-online", "cash-on-delivery"],
      default: "demo-online",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending"],
      default: "paid",
    },
    transactionId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "shipped",
        "rented",
        "returned",
        "purchased",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);