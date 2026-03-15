import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can access this.",
          sellers: [],
        },
        { status: 403 }
      );
    }

    await connectDB();

    const sellers = await User.find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const formattedSellers = sellers.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return NextResponse.json(
      { success: true, sellers: formattedSellers },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN SELLERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error while fetching sellers",
        sellers: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}