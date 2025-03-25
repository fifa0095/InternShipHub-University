const mongoose = require("mongoose");

// Comment Schema (Reused from BlogPostSchema)
const CommentSchema = new mongoose.Schema({
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Main Blog Schema (Merged)
const BlogSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ใช้ ObjectId อ้างอิง User
    title: { type: String, required: true },
    company_name: { type: String, required: false }, // ชื่อบริษัท (Optional)
    content: { type: Array, required: true }, // Array รองรับ Rich Text / Markdown
    tags: { type: [String], required: false }, // ใช้ Array แทน category
    src_from: { type: String, required: false }, // แหล่งที่มา (Optional)
    banner_link: { type: String, required: false }, // ลิงก์รูปแบนเนอร์ (Optional)
    comments: [CommentSchema], // ระบบคอมเมนต์
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ระบบ upvote
  },
  {
    timestamps: true, // เพิ่ม createdAt & updatedAt อัตโนมัติ
  }
);

// Index for search optimization
BlogSchema.index({ title: "text", tags: "text", company_name: "text" });

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

