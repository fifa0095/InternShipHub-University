// components/PredictList.js
"use client";
import React, { useEffect, useState } from "react";

export default function PredictList({ keyword }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.API_PATH}/api/search/${encodeURIComponent(keyword)}`);
        const data = await res.json();
        setBlogs(data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [keyword]);

  if (loading) return <p className="text-gray-500">Loading related blogs...</p>;

  return (
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Related Blogs:</h3>
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-bold text-blue-600 mb-2">{blog.title}</h4>
              <p className="text-gray-600 line-clamp-3">{blog.description}</p>
              <a
                href={`/blog/${blog._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 underline mt-2 inline-block"
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No related blogs found.</p>
      )}
    </div>
  );
}
