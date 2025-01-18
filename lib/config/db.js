import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://fifa0095:Zxcv0095.@cluster0.ndbzq.mongodb.net/internshipHuf')
    console.log('DB connected');
}