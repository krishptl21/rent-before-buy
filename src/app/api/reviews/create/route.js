import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Only users can submit reviews." },
        { status: 403 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json(
        { success: false, message: "productId and rating are required" },
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

    const existing = await Review.findOne({
      userId: user.id,
      productId,
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || "";
      await existing.save();

      return NextResponse.json(
        { success: true, message: "Review updated successfully" },
        { status: 200 }
      );
    }

    await Review.create({
      userId: user.id,
      productId,
      rating,
      comment: comment || "",
    });

    return NextResponse.json(
      { success: true, message: "Review added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating review" },
      { status: 500 }
    );
  }
}