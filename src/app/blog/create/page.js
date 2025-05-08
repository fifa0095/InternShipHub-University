"use client";

import CreateBlogForm from "@/components/blog/CreateBlog";
import { useAuth } from "@/components/Layout/context";

export default function CreateBlogPage() {
  const { user } = useAuth();
  console.log("user in page createblog:", user);

  return <CreateBlogForm user={user} />;
}
