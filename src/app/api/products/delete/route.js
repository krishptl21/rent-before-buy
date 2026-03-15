import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function DELETE(req) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "seller") {
      return NextResponse.json(
        { success: false, message: "Only sellers can delete their products." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "productId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.sellerId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own product." },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("SELLER DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while deleting product" },
      { status: 500 }
    );
  }
}