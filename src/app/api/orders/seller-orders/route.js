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

    if (user.role !== "seller") {
      return NextResponse.json(
        { success: false, message: "Only sellers can view seller orders." },
        { status: 403 }
      );
    }

    await connectDB();

    const orders = await Order.find({ sellerId: user.id })
      .populate("productId", "title category rentPrice buyPrice")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("SELLER ORDERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching seller orders" },
      { status: 500 }
    );
  }
}