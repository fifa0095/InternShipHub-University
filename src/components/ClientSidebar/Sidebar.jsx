"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon,
  FilePlusIcon,
  BrainIcon,
  BuildingIcon,
  DatabaseIcon,
} from "lucide-react"; // 👈 ไอคอนทั้งหมดจาก lucide

const Sidebar = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarHidden ? "-translate-x-full" : "translate-x-0"
        } w-64`}
      >
        <nav className="mt-2">
          <Link
            href="/"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span className="ml-3">Home</span>
          </Link>

          <Link
            href="/blog/create"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/blog/create" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <FilePlusIcon className="w-5 h-5" />
            <span className="ml-3">Add Blogs</span>
          </Link>

          <Link
            href="/prediction"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/prediction" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <BrainIcon className="w-5 h-5" />
            <span className="ml-3">ML Prediction</span>
          </Link>

          <Link
            href="/companies"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/companies" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <BuildingIcon className="w-5 h-5" />
            <span className="ml-3">Explore Company</span>
          </Link>

          <Link
            href="/DataVirtual"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/DataVirtual" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <DatabaseIcon className="w-5 h-5" />
            <span className="ml-3">Data Virtual</span>
          </Link>

          <Link
            href="/myBlog"
            className={`flex items-center px-5 py-3 rounded-r-full transition ${
              pathname === "/myBlog" ? "bg-black text-white" : "hover:bg-gray-100"
            }`}
          >
            <DatabaseIcon className="w-5 h-5" />
            <span className="ml-3">My Blogs</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
