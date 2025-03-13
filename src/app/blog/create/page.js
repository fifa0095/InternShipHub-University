// นำเข้า component ที่ใช้ในการสร้างบล็อก
import CreateBlogForm from "@/components/blog/CreateBlog";
// นำเข้าฟังก์ชัน verifyAuth ที่ใช้ในการยืนยันตัวตนของผู้ใช้
import { verifyAuth } from "@/lib/auth";
// นำเข้า cookies API ของ Next.js ที่ใช้ดึงข้อมูลจาก cookies
import { cookies } from "next/headers";

// ฟังก์ชันหน้าเพจสำหรับสร้างบล็อก
export default async function CreateBlogPage() {
  // ดึงค่า token จาก cookies
  const token = (await cookies()).get("token")?.value;

  // ใช้ token ที่ได้จาก cookies มาตรวจสอบและยืนยันตัวตนของผู้ใช้
  const user = await verifyAuth(token);

  // คืนค่าคอมโพเนนต์ CreateBlogForm โดยส่งค่า user ไปให้ฟอร์ม
  // ซึ่ง user นี้จะถูกใช้เพื่อแสดงข้อมูลของผู้ใช้ที่ล็อกอิน
  return <CreateBlogForm user={user} />;
}
