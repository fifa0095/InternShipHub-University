"use client";
import { assets } from "@/Assets/assets";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";


const Page = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Developer",
    author: "Tanaton benten",
    authorImg: "/author_img.png",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (image) URL.revokeObjectURL(image.preview);
      file.preview = URL.createObjectURL(file);
      setImage(file);
    }
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.preview);
    };
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("author", data.author);
      formData.append("authorImg", data.authorImg);
      if (image) formData.append("image", image);

      const response = await axios.post("/api/blog", formData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(false);
        setData({
          title: "",
          description: "",
          category: "Developer",
          author: "Tanaton benten",
          authorImg: "/author_img.png",
        });
      } else {
        toast.error("Failed to submit blog");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("An error occurred while submitting the blog.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-5 px-5 sm:pt-12 sm:pl-16 "
    >
        <div className="text-center">
            <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">Upload your resume</h1>
            <label htmlFor="image">
                <Image
                    className="rounded-md border-4 border-white mt-4 px-4 py-3"
                src={image ? image.preview : assets.upload_area}
                width={720}
                height={360}
                alt="Thumbnail"
                />
            </label>
            <input
                
                onChange={onImageChange}
                type="file"
                id="image"
                hidden
                required
            />
        </div>

        <p className="text-xl mt-4">Blog title</p>
        <input
            name="title"
            onChange={onChangeHandler}
            className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
            type="text"
            placeholder="Type here"
            required
        />

        <p className="text-xl mt-4">Blog Description</p>
        <textarea
            name="description"
            onChange={onChangeHandler}
            className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
            placeholder="Write content here"
            required
        />

        <p className="text-xl mt-4">Blog Category</p>

        <br />
        <button
            type="submit"
            className="bg-black text-white w-40 mt-8 h-12"
        >
            New Post
        </button>
        </form>
    );
    };

export default Page;
