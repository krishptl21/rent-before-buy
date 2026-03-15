import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
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
        { success: false, message: "Only sellers can add products." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      image,
      category,
      rentPrice,
      buyPrice,
      deposit,
      stock,
      condition,
      availableForRent,
      availableForBuy,
    } = body;

    if (!title || !description || !category || !rentPrice || !buyPrice) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      title,
      description,
      image: image || "",
      category,
      rentPrice: Number(rentPrice),
      buyPrice: Number(buyPrice),
      deposit: Number(deposit) || 0,
      stock: Number(stock) || 1,
      condition: condition || "new",
      sellerId: user.id,
      availableForRent: availableForRent ?? true,
      availableForBuy: availableForBuy ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating product" },
      { status: 500 }
    );
  }
}