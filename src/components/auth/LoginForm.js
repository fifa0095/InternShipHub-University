"use client";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "../Layout/context";
import { verifyAuth } from "@/lib/auth";

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

function LoginForm() {
  const {user, SetUserContext} = useAuth()
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // ส่งข้อมูลในรูปแบบ JSON
        credentials: "same-origin", // ส่งคุกกี้ที่อยู่ในโดเมนเดียวกันไปกับคำขอ
      }).then((res) => res.json());
  
      if (result.success) {
        // บันทึก Token ลงในคุกกี้
        document.cookie = `token=${result.token}; path=/; max-age=3600; secure; SameSite=Strict`;
  
        toast({
          title: "Login successful",
          description: result.success,
        });
        // reload
        const to_set = await verifyAuth(result.token);
        SetUserContext(to_set);
      
        router.push("/"); // เปลี่ยนหน้าไปที่โฮมเพจหลังจากล็อกอินสำเร็จ
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (e) {
      console.log(e); // แสดงข้อผิดพลาดในคอนโซล
      toast({
        title: "Login failed",
        description: e.message,
        variant: "destructive", // แจ้งข้อผิดพลาดด้วยโทนที่แตกต่าง
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            {...register("email")}
            placeholder="Email"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Key className="absolute left-2 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            {...register("password")}
            placeholder="Password"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full mt-3 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
