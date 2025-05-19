"use client";

import { useState } from "react";
import Sidebar from "@/components/ClientSidebar/Sidebar";
import Header from "./header";

export default function ClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      </div>

      {/* Sidebar Mobile */}
      {isSidebarOpen && (
        <div
          className="absolute z-50 inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1">
        <Header onMenuClick={toggleSidebar} />
        <main className="pt-6 md:pl-64">{children}</main>
      </div>
    </div>
  );
}
