const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      minlength: 10,
      maxlength: 200,
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 300,
    },
    image: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: { type: [commentSchema], default: [] },
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
