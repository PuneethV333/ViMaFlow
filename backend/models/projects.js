const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    technologies: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one technology required",
      },
    },
    livelink: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    githublink: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    image: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1699999999/default_project.png",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);