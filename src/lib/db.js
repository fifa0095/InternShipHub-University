import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MongoDB URI is missing in .env file");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI); // ✅ ลบ options ที่ไม่จำเป็นออก
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectToDatabase;
