import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MongoDB URI is missing in .env file");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectToDatabase;
