import { createBlogPostAction } from "@/actions/blog";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // อ่านข้อมูลจาก body ของคำขอ
    const body = await req.json();
    
    // อ่าน headers ของคำขอ
    const headers = req.headers;
    
    // เรียกใช้ฟังก์ชัน createBlogPostAction เพื่อประมวลผลข้อมูล
    const result = await createBlogPostAction(body, headers);

    // ส่งผลลัพธ์กลับในรูปแบบ JSON
    return NextResponse.json(result);
  } catch (error) {
    // หากเกิดข้อผิดพลาด ส่งข้อความ error กลับไป
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
