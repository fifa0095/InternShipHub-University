import { Outfit } from "next/font/google";
import Sidebar from "@/Components/ClientSidebar/Sidebar";
import "./globals.css";
import { assets } from "@/Assets/assets";
import Image from "next/image";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Internship HUF",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <div className="flex">
          <div className="sticky top-0 h-screen"> {/* เพิ่ม sticky และ top-0 */}
            <Sidebar />
          </div>
          <div className="flex flex-col w-full">
            {children}
          </div>
        </div>

      </body>
    </html>
  );
}
