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



      {/* Search Results Sheet */}
      {/* <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:w-[540px] sm:max-w-full"
        >
          <SheetHeader className={"flex justify-between items-center"}>
            <SheetTitle>Search Results</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((searchResultItem) => (
                <article
                  onClick={() => {
                    setIsSheetOpen(false);
                    router.push(`/blog/${searchResultItem._id}`);
                  }}
                  key={searchResultItem._id}
                  className={`cursor-pointer
                     flex gap-6
                   bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden`}
                >
                  <div className={`w-1/3 h-full relative`}>
                    <img
                      src={searchResultItem?.banner_link}
                      alt={searchResultItem?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className={`flex-1 p-4 w-2/3`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://i.pinimg.com/736x/43/0c/53/430c53ef3a97464b81b24b356ed39d32.jpg" />
                        <AvatarFallback>
                          {searchResultItem?.author?.name[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[16px] font-medium text-gray-700">
                        {searchResultItem?.author?.name}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">
                      {searchResultItem?.title}
                    </h3>
                    <div>
                      <span>
                        {new Date(
                          searchResultItem?.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </SheetContent>
      </Sheet> */}
    </header>
  );
}
