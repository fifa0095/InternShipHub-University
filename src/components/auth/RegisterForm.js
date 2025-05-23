"use client";

import { Key, Mail, User } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

function RegisterForm() {
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

  // ✅ เมื่อ valid แล้ว ส่งข้อมูลไป backend
  const onValid = async (data) => {
    setIsLoading(true);
    try {
      const result = await fetch(process.env.NEXT_PUBLIC_API_PATH +"/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (result.success) {
        toast({
          title: "Registration successful",
          description: result.success,
        });
        router.push("/login");
      } else {
        throw new Error(result.error || "Something went wrong!");
      }
    } catch (e) {
      toast({
        title: "Registration failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ❗️ เมื่อ invalid แล้วแสดง toast ตาม field ที่ error
  const onInvalid = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
          <Input
            {...register("name")}
            placeholder="Name"
            disabled={isLoading}
            className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
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
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;
