import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Rent Before You Buy",
  description: "Try products first. Buy only if you love them.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}