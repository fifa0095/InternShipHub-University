import EditBlogForm from "@/components/blog/EditBlog";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getBlogById(blogId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/getBlogByBlogId/${blogId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return { error: "Blog not found" };
    }

    return { post: data[0] };
  } catch (err) {
    console.error("❌ Failed to fetch blog:", err.message);
    return { error: err.message };
  }
}

export default async function EditBlogPage({ params }) {
  const { blogId } = params;
  const data = await getBlogById(blogId);

  if (data.error || !data.post) return <p className="text-center text-gray-500 pt-20">Blog not found</p>;

  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);
  
  return <EditBlogForm blog={data.post} user={user} />;
}
