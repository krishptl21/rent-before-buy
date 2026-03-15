import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can access this.", products: [] },
        { status: 403 }
      );
    }

    await connectDB();

    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const formattedProducts = products.map((item) => ({
      ...item,
      _id: item._id.toString(),
      sellerId: item.sellerId?.toString(),
    }));

    return NextResponse.json(
      { success: true, products: formattedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN PRODUCTS ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching products",
        products: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}