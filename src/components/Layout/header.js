"use client";

import { Edit, LogOut, Search } from "lucide-react";
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

const DEFAULT_AVATAR_URL =
  "https://i.pinimg.com/736x/42/b5/76/42b57666dbe879a032955b85c5dcdcd5.jpg";

export default function Header({ user }) {
  const router = useRouter();

  async function handleLogout() {
    const result = await logoutUserAction();
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
      </div>
    </header>
  );
}
