import BlogDetails from "@/components/blog/BlogDeatils";
import CommentSection from "@/components/blog/CommentSection";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function Fallback() {
  return <div>Loading...</div>;
}

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

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const user = await verifyAuth(token);

  const post = data.post;

  return (
    <Suspense fallback={<Fallback />}>
      <BlogDetails post={post} />
      <CommentSection user={user} postId={post._id} />
    </Suspense>
  );
}
