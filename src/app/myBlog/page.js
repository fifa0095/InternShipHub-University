"use client";

import EditAccount from "@/components/account/EditAccount";
import MyBlogs from "@/components/blog/MyBlogs";
import { useAuth } from "@/components/Layout/context";

export default function MyBlogsPage() {
  const { user } = useAuth();
  const uid = user?.userId;

  console.log("user:", user);
  console.log("user id:", uid);

  return (
    <>
      <EditAccount user={user} />
      <MyBlogs uid={uid} />
    </>
  );
}
