// core.js
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { createUploadthing } from "uploadthing/next";

// สร้าง instance ของ fn สำหรับการอัปโหลด
const fn = createUploadthing();

export const ourFileRouter = {
  imageUploader: fn({ image: { maxFileSize: "4MB" } })
    // เพิ่ม middleware ตรวจสอบสิทธิ์การเข้าถึง
    .middleware(async (req) => {
      const token = (await cookies()).get("token")?.value;
      if (!token) {
        throw new Error("Token not found");
      }
      const user = await verifyAuth(token);
      if (!user) {
        throw new Error("User not authenticated");
      }

      // ส่งค่า userId ไปกับ metadata
      return {
        userId: user.userId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.userId) {
        console.log("User ID:", metadata.userId);
      } else {
        console.error("No userId in metadata");
      }
      console.log("File URL:", file.url);
    }),
};

