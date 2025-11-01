const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one technology required",
      },
    },
    livelink: {
      type: String,
      sparse: true,
    },
    githublink: {
      type: String,
      sparse: true, // ✅ not unique
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1699999999/default_project.png",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);



projectSchema.index({ title: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Project", projectSchema);
