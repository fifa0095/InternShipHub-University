import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { createUploadthing } from "uploadthing/next";

// สร้าง instance ของ fn สำหรับการอัปโหลด
const fn = createUploadthing();

export const ourFileRouter = {
  imageUploader: fn({ image: { maxFileSize: "2MB" } })
    // เพิ่ม middleware ตรวจสอบสิทธิ์การเข้าถึง
    .middleware(async (req) => {
      const token = (await cookies()).get("token")?.value;

      if (!token) {
        throw new Error("Token not found");
      }

      try {
        // ตรวจสอบตัวตนผู้ใช้
        const user = await verifyAuth(token);
        if (!user) {
          throw new Error("User not authenticated");
        }

        // ส่งค่า userId ไปกับ metadata
        return {
          userId: user.userId,
        };
      } catch (error) {
        console.error("Authentication failed:", error);
        throw new Error("Authentication failed");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // ตรวจสอบว่า userId ถูกส่งมาหรือไม่
      if (metadata.userId) {
        console.log("User ID:", metadata.userId);
      } else {
        console.error("No userId in metadata");
      }

      console.log("File URL:", file.url);

      // เพิ่มการบันทึกหรือทำอะไรบางอย่างกับไฟล์ URL หรือ metadata
      try {
        // สมมติว่าคุณต้องการบันทึก URL ของไฟล์ในฐานข้อมูล
        // await saveFileUrlToDatabase(metadata.userId, file.url);
      } catch (error) {
        console.error("Error saving file URL:", error);
      }
    }),
};
