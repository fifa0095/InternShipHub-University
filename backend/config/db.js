const mongoose = require('mongoose');



const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("❌ MongoDB URI is missing in .env file");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 
    console.log("✅ MongoDB Connected Successfully");
    console.log(mongoose.connection.name)
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

module.exports = connectDB;
