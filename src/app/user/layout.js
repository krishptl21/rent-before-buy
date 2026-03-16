import { requireRole } from "@/lib/auth";

export default async function UserLayout({ children }) {
  await requireRole("user");
  return children;
}