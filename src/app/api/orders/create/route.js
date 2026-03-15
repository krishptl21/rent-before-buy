import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
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

    if (user.role !== "user") {
      return NextResponse.json(
        { success: false, message: "Only users can place orders." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { productId, type, rentalDays } = body;

    if (!productId || !type) {
      return NextResponse.json(
        { success: false, message: "productId and type are required" },
        { status: 400 }
      );
    }

    if (!["rent", "buy"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid order type" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { success: false, message: "Product is out of stock" },
        { status: 400 }
      );
    }

    let totalAmount = 0;
    let depositAmount = 0;
    let finalRentalDays = 0;
    let status = "pending";

    if (type === "rent") {
      if (!product.availableForRent) {
        return NextResponse.json(
          { success: false, message: "This product is not available for rent" },
          { status: 400 }
        );
      }

      if (!rentalDays || Number(rentalDays) <= 0) {
        return NextResponse.json(
          { success: false, message: "Valid rental days are required" },
          { status: 400 }
        );
      }

      finalRentalDays = Number(rentalDays);
      depositAmount = Number(product.deposit) || 0;
      totalAmount = Number(product.rentPrice) * finalRentalDays + depositAmount;
      status = "rented";
    }

    if (type === "buy") {
      if (!product.availableForBuy) {
        return NextResponse.json(
          { success: false, message: "This product is not available for buy" },
          { status: 400 }
        );
      }

      totalAmount = Number(product.buyPrice);
      depositAmount = 0;
      finalRentalDays = 0;
      status = "purchased";
    }

    const order = await Order.create({
      userId: user.id,
      productId: product._id,
      sellerId: product.sellerId,
      type,
      rentalDays: finalRentalDays,
      totalAmount,
      depositAmount,
      status,
    });

    product.stock = product.stock - 1;
    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order placed successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error while creating order" },
      { status: 500 }
    );
  }
}