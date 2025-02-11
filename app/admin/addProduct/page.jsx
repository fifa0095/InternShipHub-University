"use client";
import { assets } from "@/Assets/assets";
import React, { useState, useEffect } from "react";
import Image from "next/image";

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
    console.log(data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("author", data.author);
    formData.append("authorImg", data.authorImg);
    if (image) formData.append("image", image);

    console.log("Form Submitted", formData);
    // ส่งไปยัง backend API
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-5 px-5 sm:pt-12 sm:pl-16"
    >
      <p className="text-xl">Upload Thumbnail</p>
      <label htmlFor="image">
        <Image
          className="mt-4"
          src={image ? image.preview : assets.upload_area}
          width={140}
          height={70}
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
      <select
        name="category"
        onChange={onChangeHandler}
        className="w-40 mt-4 px-4 py-3 border text-gray-500"
        required
      >
        <option value="Developer">Developer</option>
        <option value="Designer">Designer</option>
        <option value="Data Analyst">Data Analyst</option>
        <option value="Cybersecurity">Cybersecurity</option>
      </select>
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
