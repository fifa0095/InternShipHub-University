"use client";

import { Edit, LogOut, Menu, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUserAction } from "@/actions/logout";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchPostsAction } from "@/actions/blogInteractions";
import { useAuth } from "./context";

// Schema for search input
const searchSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(searchSchema),
  });

  async function onSearchSubmit(data) {
    setIsLoading(true);
    try {
      const result = await searchPostsAction(data.query);
      if (result.success) {
        // You can handle results here
        reset();
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    const result = await logoutUserAction();
    logout();
    if (result.success) {
      router.push("/login");
    } else {
      console.error(result.error);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo and Menu (mobile only) */}
          <div className="flex items-center space-x-2">
            <button className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-6 w-6" />
            </button>
            <h1
              onClick={() => router.push("/")}
              className="text-2xl cursor-pointer font-bold font-serif tracking-tighter"
            >
              <span className="ml-1">Internship</span>
              <span className="bg-black text-white px-2 py-1 rounded-full">
                Huf
              </span>
            </h1>
          </div>

          {/* Right: User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  onClick={() => router.push("/blog/create")}
                  variant="ghost"
                  size="icon"
                >
                  <Edit className="h-6 w-6" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage
                        src={"https://ui-avatars.com/api/?name=" + user?.userName}
                        alt={user?.userName}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/myBlog`)}>
                      <Search className="h-4 w-4 mr-2" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push("/login")}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
