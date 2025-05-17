"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { XIcon, HomeIcon, BrainIcon, BuildingIcon, DatabaseIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({ isOpen = true, onClose = () => {} }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: HomeIcon, label: "All Blog" },
    { href: "/companies", icon: BuildingIcon, label: "Explore Company" },
    { href: "/prediction", icon: BrainIcon, label: "Find Career" },
    { href: "/DataVirtual", icon: DatabaseIcon, label: "Data Visualize" },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden pt-20",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      >
        <div
          className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4 pt-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="mb-4">
            <XIcon className="w-6 h-6" />
          </button>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-r-full transition",
                    active ? "bg-black text-white" : "hover:bg-gray-100"
                  )}
                  onClick={onClose}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="ml-3">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:top-0 md:left-0 md:w-64 md:h-full md:bg-white md:shadow-lg md:block p-4 pt-20">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 rounded-r-full transition",
                  active ? "bg-black text-white" : "hover:bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
