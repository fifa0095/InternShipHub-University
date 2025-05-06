"use client"

// นำเข้า component ที่ใช้ในการสร้างบล็อก
import CreateBlogForm from "@/components/blog/CreateBlog";
import { useAuth } from "@/components/Layout/context";


// ฟังก์ชันหน้าเพจสำหรับสร้างบล็อก
export default async function CreateBlogPage() {

  const { user } = useAuth()
  console.log("user in page createblog: " , user)
  
  

  // คืนค่าคอมโพเนนต์ CreateBlogForm โดยส่งค่า user ไปให้ฟอร์ม
  // ซึ่ง user นี้จะถูกใช้เพื่อแสดงข้อมูลของผู้ใช้ที่ล็อกอิน
  return <CreateBlogForm user={user} />;
}
