import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const reviews = await Review.find({ productId: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      _id: review._id.toString(),
      rating: review.rating,
      comment: review.comment,
      userName: review.userId?.name || "User",
      createdAt: review.createdAt,
    }));

    return NextResponse.json(
      { success: true, reviews: formattedReviews },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while fetching reviews" },
      { status: 500 }
    );
  }
}