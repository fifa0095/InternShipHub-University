"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // นำเข้า useRouter
import DeleteBlog from "./DeleteBlog"; // 👉 import มาใช้

export default function MyBlogs({ uid }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // เพิ่ม useRouter เพื่อใช้การนำทาง

  useEffect(() => {
    if (!uid) return;

    const fetchMyBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/getBlogByUid/${uid}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch blogs");

        setBlogs(data);
      } catch (err) {
        console.error("❌ Error fetching blogs:", err);
        toast.error("Failed to load your blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [uid]);

  // ✅ ฟังก์ชันลบ blog ออกจาก state
  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  // ฟังก์ชันเปิดหน้า EditBlog
  const handleEdit = (blogId) => {
    router.push(`/edit-blog/${blogId}`); // เปลี่ยนเส้นทางไปยังหน้า EditBlog
  };

  if (!uid) {
    return <p className="text-gray-500">User not found</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading your blogs...</p>;
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 My Blogs</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t written any blogs yet.</p>
      ) : (
        <div className="max-h-[400px] overflow-y-auto border border-gray-200 rounded-md">
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog._id} className="py-4 px-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                  <div>
                    <p className="text-lg font-semibold text-blue-700">{blog.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={`/blog/${blog._id}`}
                      className="text-sm text-blue-500 underline"
                    >
                      View →
                    </a>
                    
                    <button
                      onClick={() => handleEdit(blog._id)} // เพิ่มปุ่ม Edit
                      className="text-sm text-blue-500 underline"
                    >
                      Edit
                    </button>
                    <DeleteBlog blogId={blog._id} onDelete={() => handleDelete(blog._id)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
