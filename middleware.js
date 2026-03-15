import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const userRoutes = ["/user"];
  const sellerRoutes = ["/seller"];
  const adminRoutes = ["/admin"];

  if (
    pathname.startsWith("/user") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/admin")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (
        userRoutes.some((route) => pathname.startsWith(route)) &&
        decoded.role !== "user"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (
        sellerRoutes.some((route) => pathname.startsWith(route)) &&
        decoded.role !== "seller"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      if (
        adminRoutes.some((route) => pathname.startsWith(route)) &&
        decoded.role !== "admin"
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/seller/:path*", "/admin/:path*"],
};