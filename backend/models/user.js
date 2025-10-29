const mongoose = require("mongoose");

const resumeReviewSchema = new mongoose.Schema({
  resumeText: String,
  pdfUrl:String,
  score: Number,
  strengths: [String],
  suggestions: [String],
  atsFlags: [String],
  reviewedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  profilePic: { type: String, default: 'https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg' },
  bio: { type: String, default: "" },
  aiGeneratedPath: {
    raw: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  resumeReviews: [resumeReviewSchema],
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
