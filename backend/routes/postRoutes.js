const express = require("express");
const {
  getAllPosts,
  updateLike,
  addComment,
  getPostById,
  getPostDataUser,
  updatedPost,
  getFollowingPosts,
} = require("../controllers/postControllers");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/", verifyToken, getAllPosts);
router.get("/:postId", verifyToken, getPostById);
router.post("/like/:postId", verifyToken, updateLike);
router.post("/comment/:postId", verifyToken, addComment);
router.get("/user/following", verifyToken, getFollowingPosts);
router.post("/upload", updatedPost);
router.get("/user/:userId", verifyToken, getPostDataUser);

module.exports = router;
