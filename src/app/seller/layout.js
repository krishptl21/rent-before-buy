import { requireRole } from "@/lib/auth";

export default async function SellerLayout({ children }) {
  await requireRole("seller");
  return children;
}