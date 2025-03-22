"use client";
import { assets } from "@/Assets/assets";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const Page = () => {
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null); // สำหรับเก็บข้อมูลไฟล์ PDF
  const [data, setData] = useState({
    educational: "",
    skill: "",
    experience: "",
  });

  // ฟังก์ชันเปลี่ยนค่าในฟอร์ม
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // ฟังก์ชันเพื่อจัดการการอ่านรูปภาพ
  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // เก็บข้อมูลของไฟล์ที่อ่านได้
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URL (base64)
    }
  };

  // ฟังก์ชันเพื่อจัดการการอ่านไฟล์ PDF
  const onPdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdf(reader.result); // เก็บข้อมูลของไฟล์ PDF ที่อ่านได้
      };
      reader.readAsArrayBuffer(file); // อ่านไฟล์ PDF เป็น ArrayBuffer
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  // ฟังก์ชันที่ทำงานเมื่อฟอร์มถูกส่ง
  const handleSubmit = (e) => {
    e.preventDefault();
    // ที่นี่คุณสามารถใช้ข้อมูลที่อ่านได้จากไฟล์ เช่น แสดงไฟล์ PDF หรือ รูปภาพใน UI
    console.log("Form data:", data);
    console.log("Image Data URL:", image); // ข้อมูลของรูปภาพ
    console.log("PDF Data (ArrayBuffer):", pdf); // ข้อมูลของไฟล์ PDF
  };

  return (
    <form onSubmit={handleSubmit} className="pt-5 px-5 sm:pt-12 sm:pl-16 mt-10">
      <div className="text-center">
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
          Upload your resume
        </h1>
        <label htmlFor="image">
          <Image
            className="rounded-md border-4 border-white mt-4 px-4 py-3"
            src={image || assets.upload_area}
            width={720}
            height={360}
            alt="Thumbnail"
          />
        </label>
        <input onChange={onImageChange} type="file" id="image" hidden required />
      </div>

      <p className="text-xl mt-4">Educational Background</p>
      <input
        name="educational"
        onChange={onChangeHandler}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        placeholder="Educational background"
        required
      />

      <p className="text-xl mt-4">Skills</p>
      <input
        name="skill"
        onChange={onChangeHandler}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        type="text"
        placeholder="Your skills"
        required
      />

      <p className="text-xl mt-4">Experience</p>
      <textarea
        name="experience"
        onChange={onChangeHandler}
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
        placeholder="Describe your experience"
        required
      />

      <p className="text-xl mt-4">Upload PDF Resume</p>
      <input
        type="file"
        onChange={onPdfChange}
        accept="application/pdf"
        required
        className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
      />

      <button type="submit" className="bg-black text-white w-40 mt-8 h-12">
        Submit Resume
      </button>
    </form>
  );
};

export default Page;
