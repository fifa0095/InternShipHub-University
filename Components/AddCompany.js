"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const AddCompany = ({ onSuccess }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    author: "Tanaton benten",
    authorImg: "/author_img.png",
    category: "company", // บังคับค่าเป็น "company"
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
      formData.append("category", "company"); // บังคับค่าเป็น "company"
      formData.append("author", data.author);
      formData.append("authorImg", data.authorImg);
      if (image) formData.append("image", image);

      const response = await axios.post("/api/blog", formData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(null);
        setData({
          title: "",
          description: "",
          author: "Tanaton benten",
          authorImg: "/author_img.png",
          category: "Company",
        });

        if (onSuccess) onSuccess(); // รีเฟรชหน้าหลังจากเพิ่มสำเร็จ
      } else {
        toast.error("Failed to submit company blog");
      }
    } catch (error) {
      console.error("Error submitting blog:", error);
      toast.error("An error occurred while submitting the blog.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="absolute top-5 right-5 bg-white p-5 shadow-lg border rounded-lg">
      <p className="text-lg font-bold">Add Company Blog</p>

      <label htmlFor="image" className="block mt-3">
        <Image
          className="cursor-pointer"
          src={image ? image.preview : "/upload_area.png"}
          width={140}
          height={70}
          alt="Upload Thumbnail"
        />
      </label>
      <input onChange={onImageChange} type="file" id="image" hidden required />

      <p className="mt-4">Blog Title</p>
      <input
        name="title"
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border"
        type="text"
        placeholder="Enter title"
        required
      />

      <p className="mt-4">Description</p>
      <textarea
        name="description"
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border"
        placeholder="Enter description"
        required
      />

      <button type="submit" className="bg-black text-white w-full mt-5 py-2">
        Post Blog
      </button>
    </form>
  );
};

export default AddCompany;
