"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MyBlogs({ uid }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const fetchMyBlogs = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/blogs/user/${uid}`);
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

  if (!uid) {
    return <p className="text-gray-500">User not found</p>;
  }

  if (loading) {
    return <p className="text-gray-500">Loading your blogs...</p>;
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 My Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-gray-500">You haven’t written any blogs yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {blogs.map((blog) => (
            <li key={blog._id} className="py-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <p className="text-lg font-semibold text-blue-700">{blog.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{blog.description}</p>
                </div>
                <a
                  href={`/blog/${blog._id}`}
                  className="text-sm text-blue-500 underline mt-2 md:mt-0"
                >
                  View →
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
