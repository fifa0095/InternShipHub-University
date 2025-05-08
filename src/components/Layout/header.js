"use client";

import { Edit, LogOut, Search } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import Sidebar from "../ClientSidebar/Sidebar";
import { useAuth } from "./context";

// Search schema
const searchSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export default function Header() {
  const {user, SetUserContext, logout } = useAuth()
  // console.log("header user",  user)

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // New state for edit profile modal
  const { toast } = useToast();

  // Form setup for search and profile edit
  const { register, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(searchSchema),
  });

  async function onSearchSubmit(data) {
    setIsLoading(true);
    try {
      // Filter posts based on title and content
      const result = await searchPostsAction(data.query);
      if (result.success) {
        const filteredResults = result.posts.filter((post) =>
          post.title.toLowerCase().includes(data.query.toLowerCase()) ||
          post.content.toLowerCase().includes(data.query.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsSheetOpen(true);
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
    logout()
    if (result.success) {
      router.push("/login");
    } else {
      console.error(result.error);
    }
  }



  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50">
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
                        <AvatarFallback>Unknown</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/myBlog`)}>
                      <Search className="h-4 w-4" />
                      <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
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
      </div>



      
    </header>
  );
}
