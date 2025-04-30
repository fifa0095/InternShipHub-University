// src/app/blog/[slug]/page.js
import { getBlogPostByIdAction } from "@/actions/blog";
import BlogDetails from "@/components/blog/BlogDeatils";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import CommentSection from "@/components/blog/CommentSection";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function Fallback() {
  return <div>Loading...</div>;
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = params;

  const data = await getBlogPostByIdAction(slug);
  if (data.error) notFound();

  // ✅ แก้ให้ await cookies()
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = await verifyAuth(token);

  const { post } = data;
  const parsedPost = JSON.parse(post);

  return (
    <Suspense fallback={<Fallback />}>
      <BlogDetails post={parsedPost} />
      <CommentSection user={user} postId={parsedPost._id} />
    </Suspense>
  );
}
