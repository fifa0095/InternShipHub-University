const mongoose = require("mongoose");

// Comment Schema (Reused from BlogPostSchema)
const CommentSchema = new mongoose.Schema({
  content: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  authorName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Main Blog Schema (Merged)
const BlogSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  company_name: { type: String, required: true },
  content: { type: Array, required: true },
  type: { type: String, required: true },
  tag: { type: Object, required: true },
  src_from: { type: String, required: true },
  banner_link: { type: String, required: false }, // Added banner_link field
}, { 
  timestamps: true 
  
}); // Automatically adds createdAt & updatedAt

// Index for search optimization
BlogSchema.index({ title: "text", tags: "text", company_name: "text" });

module.exports = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

