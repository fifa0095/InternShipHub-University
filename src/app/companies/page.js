// src/app/companies/page.js
import { getBlogPostsAction } from "@/actions/blog"; // ฟังก์ชันดึงข้อมูล Blog ทั้งหมด
import CompanyBlogsComponent from "@/components/BlogCompany/CompanyBlogs";
import { notFound } from "next/navigation";

export default async function CompaniesPage() {
  const data = await getBlogPostsAction(); // ดึงข้อมูลบล็อกทั้งหมด

  if (!data.success || !data.posts) {
    return notFound(); // ถ้าไม่มีข้อมูล ส่งไปหน้า 404
  }

  // กรองเฉพาะบล็อกที่มีหมวดหมู่ 'company'
  const companyBlogs = data.posts.filter((post) =>
    Array.isArray(post.tags)
      ? post.tags.includes("company") // รองรับ Array
      : post.tags === "company"
  );

  return <CompanyBlogsComponent posts={companyBlogs} />;
}
