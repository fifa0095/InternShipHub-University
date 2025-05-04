import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env file!");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async (mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        console.log(mongoose.connection.name)
        console.log("📌 Database Name:");
        console.log("📌 Database Name:", mongoose.connection.name);

        // ดึงรายการ Collections ทั้งหมด
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📂 Collections:", collections.map((col) => col.name));

        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


export default connectToDatabase;
