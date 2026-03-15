import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can access this." },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const formattedUsers = users.map((item) => ({
      ...item,
      _id: item._id.toString(),
    }));

    return NextResponse.json(
      { success: true, users: formattedUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching users" },
      { status: 500 }
    );
  }
}