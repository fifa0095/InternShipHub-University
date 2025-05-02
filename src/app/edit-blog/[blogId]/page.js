// app/edit-blog/[id]/page.js
import EditBlogForm from "@/components/blog/EditBlog";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { getBlogPostByIdAction } from "@/actions/blog";

export default async function EditBlogPage({ params }) {
  const { blogId } = params;
  const data = await getBlogPostByIdAction(blogId);
  if (data.error) notFound();

  const token = (await cookies()).get("token")?.value;
  const user = await verifyAuth(token);
  const uid = user?.userId;

  const { post } = data;
  const resBlog = JSON.parse(post);
    
  

  if (!resBlog) return <p className="text-center text-gray-500 pt-20">Blog not found</p>;

  return <EditBlogForm blog={resBlog} user={user} />;
}
