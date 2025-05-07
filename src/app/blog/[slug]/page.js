// app/blog/[slug]/page.jsx หรือ .tsx (ไม่มี use client)
import BlogDetails from "@/components/blog/BlogDeatils";
import ClientCommentSection from "./ClientCommentSection"; // 👈 สร้าง Client Wrapper
import { notFound } from "next/navigation";

async function getBlogById(slug) {
  try {
    const res = await fetch(`http://localhost:8080/api/getBlogByBlogId/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return { error: "No blog found" };
    }

    return { post: data[0] };
  } catch (err) {
    console.error("❌ Failed to fetch blog:", err.message);
    return { error: err.message };
  }
}

export default async function BlogDetailsPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const data = await getBlogById(slug);
  if (data.error || !data.post) notFound();

  const post = data.post;

  return (
    <>
      <BlogDetails post={post} />
      <ClientCommentSection postId={post._id} /> {/* 👈 ย้าย useAuth ไปข้างใน */}
    </>
  );
}
