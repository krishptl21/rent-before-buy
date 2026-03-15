import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or empty request body" },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { success: false, message: "Your account is blocked" },
        { status: 403 }
      );
    }

    if (user.role === "seller" && !user.isApproved) {
      return NextResponse.json(
        { success: false, message: "Seller account is not approved yet" },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "JWT_SECRET is missing" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        role: user.role,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("LOGIN ERROR FULL:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error during login",
        error: error.message,
      },
      { status: 500 }
    );
  }
}