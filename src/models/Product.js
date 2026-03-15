import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    condition: {
      type: String,
      default: "new",
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availableForRent: {
      type: Boolean,
      default: true,
    },
    availableForBuy: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);