import { connectToDatabase } from "@/lib/db";
import User from "@/models/User"; // สมมติว่าใช้ UserModel ในการเก็บข้อมูล
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const LoadDB = async () => {
  await connectToDatabase();
};

LoadDB();

// API สำหรับการดึงข้อมูล Resume
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user.resume); // ดึงข้อมูล Resume ของ User
    }

    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// API สำหรับการอัปโหลด Resume
export async function POST(request) {
  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    // ตรวจสอบการมีอยู่ของไฟล์ Resume
    const resumeFile = formData.get("resume");
    if (!resumeFile) {
      return NextResponse.json(
        { error: "No resume file found in the request" },
        { status: 400 }
      );
    }

    // ตรวจสอบข้อมูลที่จำเป็นสำหรับ Resume
    const educational = formData.get("educational");
    const skill = formData.get("skill");
    const experience = formData.get("experience");
    const userId = formData.get("userId");

    if (!educational || !skill || !experience || !userId) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // จัดการไฟล์ Resume
    const resumeFileName = resumeFile.name || `resume_${timestamp}`;
    const resumeFileByteData = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(resumeFileByteData);

    const publicDir = path.join(process.cwd(), "public/uploads");
    const filePath = `${publicDir}/${timestamp}_${resumeFileName}`;

    // ตรวจสอบให้แน่ใจว่า directory มีอยู่
    await mkdir(publicDir, { recursive: true });

    await writeFile(filePath, buffer);

    const resumeFileUrl = `/uploads/${timestamp}_${resumeFileName}`;

    // เตรียมข้อมูล Resume
    const resumeData = {
      educational,
      skill,
      experience,
      file: resumeFileUrl, // URL ของไฟล์ Resume
    };

    // ค้นหาผู้ใช้ในฐานข้อมูลและอัปเดต Resume
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // เพิ่ม Resume ใหม่เข้าไปในข้อมูลของผู้ใช้
    user.resume.push(resumeData);
    await user.save();

    return NextResponse.json(
      { success: true, msg: "Resume uploaded successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST API:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
