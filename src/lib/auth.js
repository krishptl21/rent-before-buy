import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}

export async function requireRole(role) {
  const user = await getAuthUser();

  if (!user || user.role !== role) {
    redirect("/login");
  }

  return user;
}