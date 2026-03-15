import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product id" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const seller = await User.findById(product.sellerId)
      .select("name email")
      .lean();

    const formattedProduct = {
      ...product,
      _id: product._id.toString(),
      sellerId: product.sellerId?.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        product: formattedProduct,
        seller,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}