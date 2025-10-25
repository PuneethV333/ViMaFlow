const { default: mongoose } = require("mongoose");
const Post = require("../models/posts");
const User = require("../models/user");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments.userid", "displayName profilePic")
      .populate("likes", "displayName profilePic")
      .populate("by", "displayName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

const updateLike = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const postId = req.params.postId;

    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes.pull(user._id);
    } else {
      post.likes.push(user._id);
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("likes", "displayName profilePic")
      .populate("by", "displayName profilePic");

    res.status(200).json({
      likes: updatedPost.likes.length,
      liked: !alreadyLiked,
      post: updatedPost,
    });
  } catch (err) {
    console.error("Error updating like:", err);
    res.status(500).json({ message: "Server error updating like" });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = req.params.postId;

    if (!comment || comment.trim().length < 10) {
      return res
        .status(400)
        .json({ message: "Comment must be at least 10 characters." });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userid: req.user.id, comment: comment.trim() });
    await post.save();

    await post.populate("comments.userid", "displayName profilePic");

    res.status(200).json({ comments: post.comments });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(id).populate(
      "by",
      "displayName profilePic"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

const getPostDataUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ by: userId })
      .populate("by", "displayName profilePic")
      .populate("likes", "displayName profilePic")
      .populate("comments.userid", "displayName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching user's posts" });
  }
};

const updatedPost = async (req, res) => {
  try {
    const { imageUrl, title, description, userid } = req.body;
    if (!imageUrl || !userid || !title || !description)
      return res.status(400).json({ message: "Enter all the fields" });

    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = new Post({
      title: title,
      description: description,
      image: imageUrl,
      by: userid,
    });

    const savedPost = await post.save();
    const populatedPost = await savedPost.populate(
      "by",
      "displayName profilePic"
    );
    res.status(200).json({ message: "Post created", post: populatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while adding posts" });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const currentUser = await User.findOne({
      firebaseUid: req.user.firebaseUid,
    });
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ by: { $in: currentUser.following } })
      .populate("by", "displayName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching following posts:", err);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

module.exports = {
  getAllPosts,
  updateLike,
  addComment,
  getPostById,
  getPostDataUser,
  updatedPost,
  getFollowingPosts,
};
