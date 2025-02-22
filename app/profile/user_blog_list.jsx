"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const userBlogs = [
      {
        id: 1,
        title: "ThaiBev Internship 2025",
        description: "โอกาสสำหรับน้องๆ นักศึกษา...",
        image: assets.blog_sample_1,
        category: "Internship",
      },
      {
        id: 2,
        title: "Agoda Summer Internship ! ☀️",
        description: "Join us for the 10-week internship...",
        image: assets.blog_sample_2,
        category: "On-site",
      },
    ];
    setBlogs(userBlogs);
  }, []);

  const handleEdit = (id) => {
    console.log("Editing blog", id);
  };

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto">
      {blogs.map((blog) => (
        <div 
          key={blog.id} 
          className="w-full bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] flex flex-col"
        >
          {/* Fixed Image Container */}
          <div className="w-full h-[180px] overflow-hidden border border-black">
            <Image 
              src={blog.image} 
              alt="Blog" 
              width={600} 
              height={180} 
              className="w-full h-full object-cover"
            />
          </div>

          <p className="ml-5 mt-3 px-2 inline-block bg-black text-white text-sm">{blog.category}</p>

          <div className="p-5 flex flex-col">
            <h5 className="text-lg font-medium">{blog.title}</h5>
            <p className="text-sm text-gray-700">{blog.description}</p>

            {/* Buttons */}
            <div className="mt-3 flex justify-between">
              <button 
                onClick={() => handleEdit(blog.id)} 
                className="flex items-center text-blue-500"
              >
                <Image src={assets.edit_icon} width={16} height={16} alt="Edit" className="mr-1"/> EDIT
              </button>
              <button 
                onClick={() => handleDelete(blog.id)} 
                className="flex items-center text-red-500"
              >
                <Image src={assets.delete_icon} width={16} height={16} alt="Delete" className="mr-1"/> DELETE
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBlogList;
