"use client";
import { assets } from "@/Assets/assets";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

const Page = () => {
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

  // ฟังก์ชันที่ทำงานเมื่อฟอร์มถูกส่ง
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("🔹 Data before sending:", data); // Log ข้อมูลที่ส่งไป API

    // สร้าง FormData แทนการใช้ JSON.stringify
    const formData = new FormData();
    formData.append("educational", data.educational);
    formData.append("skill", data.skill);
    formData.append("experience", data.experience);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData, // ส่ง formData แทน JSON
      });

      const result = await response.json();
      console.log("🔹 API Response:", result); // Log ค่าที่ API ส่งกลับมา

      if (response.ok) {
        toast.success("✅ Resume uploaded successfully!");
      } else {
        toast.error(`❌ Error: ${result.error || "Failed to upload resume."}`);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-5 px-5 sm:pt-12 sm:pl-16 mt-10">
      <div className="text-center">
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
          Input your skill
        </h1>
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

      <button type="submit" className="bg-black text-white w-40 mt-12 h-12">
        Submit
      </button>
    </form>
  );
};

export default Page;
