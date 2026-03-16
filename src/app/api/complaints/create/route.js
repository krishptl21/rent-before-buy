import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import Order from "@/models/Order";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req) {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Only users can file complaints." },
        { status: 403 }
      );
    }

    const { orderId, message } = await req.json();

    if (!orderId || !message) {
      return NextResponse.json(
        { success: false, message: "orderId and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(orderId);

    if (!order || order.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await Complaint.create({
      userId: user.id,
      orderId,
      message,
      status: "open",
    });

    return NextResponse.json(
      { success: true, message: "Complaint submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE COMPLAINT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating complaint" },
      { status: 500 }
    );
  }
}