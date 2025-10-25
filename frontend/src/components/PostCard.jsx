import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  X,
  Copy,
  Twitter,
  Linkedin,
  Send,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Comments from "./Comments";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";

const PostCard = ({ info }) => {
  const { user, userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(
    info.likes?.some(
      (like) => like === userData?._id || like?._id === userData?._id
    )
  );

  const [likeCount, setLikeCount] = useState(info.likes?.length || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [comments, setComments] = useState(info.comments || []);
  const [openShare, setOpenShare] = useState(false);

  const commentCount = comments.length;

  const handleLike = async () => {
    if (!user) return toast.error("Please login first!");
    if (loadingLike) return;

    setLoadingLike(true);
    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      const token = await user.getIdToken(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/like/${info._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLiked(res.data.liked);
      setLikeCount(res.data.likes);
    } catch (err) {
      console.error("Error updating like:", err);
      toast.error("Failed to like post.");
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!user) return toast.error("Please login first!");

    setLoadingComment(true);
    try {
      const token = await user.getIdToken(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/comment/${info._id}`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res.data.comments);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment!");
    } finally {
      setLoadingComment(false);
    }
  };

  const postUrl = `${window.location.origin}/post/${info._id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied!");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-slate-900/40 border border-gray-800/50 hover:border-gray-700/80 transition-all duration-300 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800/30">
          <div className="flex items-center gap-3">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={info.by?.profilePic || "https://via.placeholder.com/44"}
              alt={info.by?.displayName || "User"}
              className="rounded-full w-11 h-11 object-cover border border-gray-700/50 cursor-pointer"
            />
            <div className="flex flex-col">
              <h3 className="font-semibold text-white text-sm cursor-pointer hover:opacity-80">
                {info.by?.displayName || "Unknown"}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(info.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-black group">
          <motion.img
            src={info.image}
            alt={info.title}
            className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-10 text-center">
              <div className="flex flex-col items-center">
                <Heart className="w-8 h-8 fill-pink-400 text-pink-400 mb-2" />
                <span className="text-white font-bold text-lg">
                  {likeCount}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-white font-bold text-lg">
                  {commentCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex items-center justify-between border-b border-gray-800/30">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleLike}
              disabled={loadingLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:text-pink-400 transition-colors"
            >
              <motion.div
                animate={isAnimating ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.6 }}
              >
                <Heart
                  className={`w-6 h-6 ${isLiked ? "fill-pink-500 text-pink-500" : "text-gray-300"}`}
                />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => setOpenComment(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-300 hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={() => setOpenShare(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-300 hover:text-purple-400 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/20 border border-gray-700/30">
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-pink-500 text-pink-500" : "text-gray-400"}`}
            />
            <span className="text-sm font-semibold text-gray-300">
              {likeCount}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3
              className="font-bold text-white mb-1 cursor-pointer"
              onClick={() => navigate(`/post/${info._id}`)}
            >
              {info.title}
            </h3>
            <p className="text-gray-300 text-sm line-clamp-3">
              {info.description}
            </p>
          </div>
          {commentCount > 0 && (
            <button
              onClick={() => setOpenComment(true)}
              className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
            >
              View all {commentCount} comments
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {openComment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenComment(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-slate-900/95 border border-gray-700/50 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                  <h2 className="text-lg font-bold text-white">Comments</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setOpenComment(false)}
                    className="p-2 hover:bg-gray-800/50 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="overflow-y-auto max-h-[calc(80vh-160px)] p-4 space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment, i) => (
                      <Comments key={i} comment={comment} index={i} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
                      <MessageCircle className="w-12 h-12 mb-3 text-gray-600/50" />
                      No comments yet. Be the first!
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-700/50 p-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none"
                  />
                  <motion.button
                    onClick={handleComment}
                    disabled={loadingComment}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
                  >
                    Post
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openShare && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenShare(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="w-full max-w-sm bg-slate-900/95 rounded-2xl border border-gray-700/50 p-5 text-white shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Share Post</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setOpenShare(false)}
                    className="p-1 hover:bg-gray-800 rounded-full"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Copy className="w-5 h-5 text-cyan-400" />
                    Copy Link
                  </motion.button>

                  <motion.a
                    href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Send className="w-5 h-5 text-green-400" />
                    WhatsApp
                  </motion.a>

                  <motion.a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Twitter className="w-5 h-5 text-sky-400" />
                    Twitter
                  </motion.a>

                  <motion.a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Linkedin className="w-5 h-5 text-blue-500" />
                    LinkedIn
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;
