// src/app/companies/page.js
import CompanyBlogsComponent from "@/components/BlogCompany/CompanyBlogs";
import { notFound } from "next/navigation";

export default async function CompaniesPage() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_PATH +"/api/getReview");

    if (!response.ok) {
      throw new Error("Failed to fetch blog data");
    }

    const posts = await response.json();

    // ตรวจสอบว่า posts เป็น array หรือไม่
    if (!Array.isArray(posts)) {
      throw new Error("Invalid blog data format");
    }

    // ไม่ต้องกรอง filter ใด ๆ แล้ว
    return (
      <div className="bg-gray-100 min-h-screen py-10 px-4">
        <CompanyBlogsComponent posts={posts} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching company blogs:", error);
    return notFound(); // หากโหลดข้อมูลไม่ได้ ให้ไปหน้า 404
  }
}
