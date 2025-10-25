const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  aiGeneratedPath: {
    raw: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: [String], default: [] },
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

module.exports = mongoose.model("User", userSchema);
