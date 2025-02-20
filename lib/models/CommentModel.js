import mongoose from "mongoose";

// กำหนด Schema สำหรับ Comment
const CommentSchema = new mongoose.Schema(
  {
    // blogs_id ใช้สำหรับเชื่อมโยงกับ Blog model (ในคอลเล็กชัน blogs) เพื่อระบุว่าคอมเม้นต์นี้เกี่ยวข้องกับบล็อกโพสต์ใด
    blogs_id: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },

    // uid ใช้สำหรับเชื่อมโยงกับ User ที่ทำการคอมเม้นต์
    uid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },

    // content คือข้อความหรือเนื้อหาของคอมเม้นต์
    content: { type: String, required: true },

    // createdAt เก็บวันที่และเวลาที่คอมเม้นต์ถูกสร้าง
    createdAt: { type: Date, default: Date.now },

    // updatedAt เก็บวันที่และเวลาที่คอมเม้นต์ถูกปรับปรุง
    updatedAt: { type: Date, default: Date.now },
  },
  {
    // การตั้งค่า timestamps จะช่วยให้ MongoDB สร้างฟิลด์ createdAt และ updatedAt ให้อัตโนมัติ
    timestamps: true,
  }
);

// ถ้ามีการสร้าง Comment model อยู่แล้วให้ใช้ตัวนั้น ถ้ายังไม่มีให้สร้างใหม่
const CommentModel = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default CommentModel;
