import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
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

    if (user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Only users can view their orders." },
        { status: 403 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId: user.id })
      .populate("productId", "title category rentPrice buyPrice image")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("MY ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching orders" },
      { status: 500 }
    );
  }
}