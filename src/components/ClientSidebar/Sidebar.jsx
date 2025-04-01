"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { assets } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";

const Sidebar = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const pathname = usePathname(); // ตรวจสอบ path ปัจจุบัน

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div>
      {/* ปุ่ม Toggle ไว้ติดจอที่มุมซ้าย */}
      <div className="fixed top-4 left-4 z-50 mt-12">
        <Image
          src={assets.menu_icon}
          width={30}
          height={30}
          alt="Toggle Sidebar"
          className="cursor-pointer bg-white p-1 rounded-full shadow-md"
          onClick={toggleSidebar}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarHidden ? "-translate-x-full" : "translate-x-0"
        } w-64`}
      >
        {/* เนื้อหาภายใน Sidebar */}
        <nav className="mt-10">
          <Link
            href="/"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Image src={assets.home_icon} width={24} height={24} alt="Home" />
            <span className="ml-3">Home</span>
          </Link>

          <Link
            href="/blog/create"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/blog/create" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Image src={assets.add_icon} width={24} height={24} alt="Add" />
            <span className="ml-3">Add Blogs</span>
          </Link>

          <Link
            href="/prediction"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/prediction" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Image src={assets.email_icon} width={24} height={24} alt="ML" />
            <span className="ml-3">ML Prediction</span>
          </Link>

          <Link
            href="/companies"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/companies" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Image src={assets.email_icon} width={24} height={24} alt="Company" />
            <span className="ml-3">Explore Company</span>
          </Link>

          <Link
            href="/DataVirtual"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/DataVirtual" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <Image src={assets.email_icon} width={24} height={24} alt="DataVirtual" />
            <span className="ml-3">Data Vitaul</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
