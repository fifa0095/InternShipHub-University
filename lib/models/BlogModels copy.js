import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    src_from: {
        type: String,
        required: true
    },
    image:{
        type:String,
        require:true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    authorImg:{
        type:String,
        require:true
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// ตรวจสอบว่าโมเดลมีอยู่แล้วหรือไม่ เพื่อป้องกันข้อผิดพลาด
const BlogModel = mongoose.models.Blogs || mongoose.model('Blogs', BlogSchema);

export default BlogModel;
