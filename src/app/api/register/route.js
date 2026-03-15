import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    if (!["user", "seller"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role selected" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone: phone || "",
      isApproved: role === "seller" ? false : true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          role === "seller"
            ? "Seller registered successfully. Waiting for approval."
            : "User registered successfully.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration" },
      { status: 500 }
    );
  }
}