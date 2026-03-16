import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  await requireRole("admin");
  return children;
}