// src/app/companies/page.js
import CompanyBlogsComponent from "@/components/BlogCompany/CompanyBlogs";
import { notFound } from "next/navigation";

export default async function CompaniesPage() {
  try {
    const response = await fetch("http://localhost:8080/api/getBlog");

    if (!response.ok) {
      throw new Error("Failed to fetch blog data");
    }

    const posts = await response.json();

    // ตรวจสอบว่า posts เป็น array หรือไม่
    if (!Array.isArray(posts)) {
      throw new Error("Invalid blog data format");
    }

    // กรองเฉพาะบล็อกที่มีหมวดหมู่ 'company'
    const companyBlogs = posts.filter((post) =>
      Array.isArray(post.tags) ? post.tags.includes("company") : post.tags === "company"
    );

    return <CompanyBlogsComponent posts={companyBlogs} />;
  } catch (error) {
    console.error("Error fetching company blogs:", error);
    return notFound(); // หากโหลดข้อมูลไม่ได้ ให้ไปหน้า 404
  }
}
