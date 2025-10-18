const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 50, 
  },
  description: {
    type: String,
    required: true,
    maxlength: 300,
  },
  technologies: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one technology required'],
  },
  livelink: {
    type: String,
    unique: true,
    sparse: true, 
  },
  githublink: {
    type: String,
    unique: true,
    sparse: true,
  },
  image: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
