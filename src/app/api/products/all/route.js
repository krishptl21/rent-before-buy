import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const formattedProducts = products.map((product) => ({
      ...product,
      _id: product._id.toString(),
      sellerId: product.sellerId?.toString(),
    }));

    return NextResponse.json(
      { success: true, products: formattedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("ALL PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}