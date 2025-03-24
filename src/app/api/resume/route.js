import connectToDatabase from "@/lib/db"; 
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const resumeSchema = z.object({
  educational: z.string().min(1, "กรุณาระบุข้อมูลการศึกษา"),
  skill: z.string().min(1, "กรุณาระบุทักษะความสามารถ"),
  experience: z.string().min(1, "กรุณาระบุประสบการณ์ทำงาน"),
});

export async function POST(request) {
  try {
    const token = cookies().get("token")?.value;
    const user = await verifyAuth(token);

    if (!user) {
      return NextResponse.json({ 
        error: "คุณไม่ได้รับอนุญาตให้อัปโหลด Resume กรุณาเข้าสู่ระบบ" 
      }, { status: 401 });
    }

    const formData = await request.formData();

    // ตรวจสอบข้อมูลที่ได้จาก formData
    const educational = formData.get("educational");
    const skill = formData.get("skill");
    const experience = formData.get("experience");

    console.log("Received Data:", { educational, skill, experience }); // เพิ่มบรรทัดนี้เพื่อตรวจสอบ

    // ตรวจสอบความถูกต้องของข้อมูล
    const validateFields = resumeSchema.safeParse({
      educational,
      skill,
      experience
    });

    if (!validateFields.success) {
      return NextResponse.json({
        error: validateFields.error.errors[0].message
      }, { status: 400 });
    }

    try {
      await connectToDatabase();
      console.log("Connected to MongoDB");

      // ค้นหาผู้ใช้ในฐานข้อมูลและอัปเดต Resume
      const userData = await User.findById(user.userId);
      if (!userData) {
        return NextResponse.json({ error: "ไม่พบข้อมูลผู้ใช้" }, { status: 404 });
      }

      // เพิ่ม Resume ใหม่เข้าไปในข้อมูลของผู้ใช้
      userData.resume.push({
        upload_at: new Date(),
        educational: validateFields.data.educational,
        skill: validateFields.data.skill,
        experience: validateFields.data.experience
      });
      await userData.save();

      return NextResponse.json(
        { success: true, msg: "อัปโหลด Resume สำเร็จ" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error during database operation:", error);
      return NextResponse.json(
        { error: "เกิดข้อผิดพลาดในการประมวลผลคำขอ โปรดลองอีกครั้ง" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST API:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์", details: error.message },
      { status: 500 }
    );
  }
}
