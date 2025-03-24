const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  upload_at: { type: Date, default: Date.now },
  educational: { type: String, required: true },
  skill: { type: String, required: true },
  experience: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isPremium: {
    type: Boolean,
    default: true,
  },
  resume: [ResumeSchema],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);