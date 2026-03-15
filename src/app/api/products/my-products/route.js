import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login first." },
        { status: 401 }
      );
    }

    if (user.role !== "seller") {
      return NextResponse.json(
        { success: false, message: "Only sellers can view seller products." },
        { status: 403 }
      );
    }

    await connectDB();

    const products = await Product.find({ sellerId: user.id })
      .sort({ createdAt: -1 })
      .lean();

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
    console.error("MY PRODUCTS ERROR:", error);
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