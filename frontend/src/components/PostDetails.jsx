import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart,  Share2, ArrowLeft, MoreVertical, Loader, X, Copy, Twitter, Linkedin, Send } from "lucide-react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import Comments from "./Comments";

const PostDetails = () => {
  const { id } = useParams();
  const { userData, user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [openShare, setOpenShare] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = await user.getIdToken(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(res.data);
        setComments(res.data.comments || []);
        setIsLiked(res.data.likes?.some((like) => like._id === userData?._id) || false);
        setLikeCount(res.data.likes?.length || 0);
      } catch (err) {
        console.error("Error fetching post:", err);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPost();
  }, [id, userData, user]);

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
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/like/${id}`,
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
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/comment/${id}`,
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

  const postUrl = `${window.location.origin}/post/${id}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1629] to-[#0A0F1C] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Loader className="w-12 h-12 text-cyan-400" />
        </motion.div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1629] to-[#0A0F1C] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-gray-400">The post you're looking for doesn't exist.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1629] to-[#0A0F1C] px-4 py-8 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 hover:bg-gray-800/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-300" />
          </motion.button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Post Details
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl overflow-hidden bg-slate-900/40 border border-gray-800/50 backdrop-blur-sm">
              
              <div className="flex items-center justify-between p-4 border-b border-gray-800/30">
                <div className="flex items-center gap-3">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={post.by?.profilePic}
                    alt={post.by?.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-700/50 cursor-pointer"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{post.by?.displayName}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                
              </div>

              
              {post.image && (
                <div className="relative overflow-hidden bg-black">
                  <motion.img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}

              
              <div className="p-4 border-b border-gray-800/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={handleLike}
                      disabled={loadingLike}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:text-pink-400 transition-colors disabled:opacity-50"
                    >
                      <motion.div
                        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <Heart
                          className={`w-6 h-6 ${
                            isLiked ? "fill-pink-500 text-pink-500" : "text-gray-300"
                          }`}
                        />
                      </motion.div>
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

                  <motion.div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/20 border border-gray-700/30">
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-pink-500 text-pink-500" : "text-gray-400"}`} />
                    <span className="text-sm font-semibold text-gray-300">{likeCount}</span>
                  </motion.div>
                </div>

                
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                  <p className="text-gray-300 leading-relaxed">{post.description}</p>
                </div>
              </div>

              
              <div className="p-4 border-b border-gray-800/30">
                <div className="flex gap-3">
                  <img src={userData?.profilePic || "https://via.placeholder.com/32"} alt="user" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                    <motion.button
                      onClick={handleComment}
                      disabled={loadingComment}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50"
                    >
                      Post
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="rounded-2xl overflow-hidden bg-slate-900/40 border border-gray-800/50 backdrop-blur-sm h-fit sticky top-8">
              <div className="p-4 border-b border-gray-800/30">
                <h3 className="font-bold text-white text-lg">Comments ({comments.length})</h3>
              </div>

              <div className="space-y-3 p-4 max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {comments.length > 0 ? (
                    comments.map((comment, i) => (
                      <Comments key={comment._id || i} comment={comment} index={i} />
                    ))
                  ) : (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 text-sm py-4">
                      No comments yet
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      
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
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Send className="w-5 h-5 text-green-400" />
                    WhatsApp
                  </motion.a>

                  <motion.a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="w-full flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700/40 hover:bg-gray-700/40 transition-all"
                  >
                    <Twitter className="w-5 h-5 text-sky-400" />
                    Twitter
                  </motion.a>

                  <motion.a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
    </div>
  );
};

export default PostDetails;