import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req) {
  try {
    const admin = await getUserFromToken();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can do this." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { sellerId } = body;

    if (!sellerId) {
      return NextResponse.json(
        { success: false, message: "sellerId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const seller = await User.findById(sellerId);

    if (!seller || seller.role !== "seller") {
      return NextResponse.json(
        { success: false, message: "Seller not found" },
        { status: 404 }
      );
    }

    seller.isApproved = true;
    await seller.save();

    return NextResponse.json(
      { success: true, message: "Seller approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("APPROVE SELLER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while approving seller" },
      { status: 500 }
    );
  }
}