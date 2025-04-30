const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  upload_at: { type: Date, default: Date.now },
  educational: { type: String, required: true },
  skill: { type: String, required: true },
  experience: { type: String, required: true },
  predicted_job: { type: String, required: true }
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
  type: {
    type: String,
    required: true,
  },
  resume: [ResumeSchema],
});

// export default mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = mongoose.model('User', UserSchema);