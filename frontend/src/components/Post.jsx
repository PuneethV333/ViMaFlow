import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import PostCard from "./PostCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Post = () => {
  const { user } = useContext(AuthContext);
  const [followrsPost, setFollowersPost] = useState(null);

  useEffect(() => {
    const getFollowingPosts = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/user/following`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFollowersPost(res.data);
      } catch (err) {
        console.warn(
          "Backend posts not found yet:",
          err.response?.data?.message || err.message || "Unknown error"
        );
        setFollowersPost(null);
      }
    };
    if (user) getFollowingPosts();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1629] to-[#0A0F1C] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-15 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 top-0 py-4 px-4 md:py-6 text-center bg-gradient-to-b from-[#0A0F1C]/80 via-[#0A0F1C]/50 to-transparent backdrop-blur-md border-b border-cyan-500/10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="text-cyan-400" size={28} />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Explore
          </h1>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="text-blue-400" size={28} />
          </motion.div>
        </div>
      </motion.div>

      <div className="relative z-10 w-full py-8">
        <AnimatePresence mode="wait">
          {followrsPost?.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-8 px-4 max-w-2xl mx-auto"
            >
              {followrsPost.map((p, i) => (
                <motion.div
                  key={p._id || i}
                  variants={itemVariants}
                  exit="exit"
                  className="w-full max-w-xl"
                >
                  <PostCard info={p} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center min-h-[60vh] px-4"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-lg text-center max-w-md"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-6"
                >
                  <Sparkles className="mx-auto text-cyan-400" size={56} />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  No Posts Yet
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Follow amazing creators or start sharing your own projects to
                  fill your feed!
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      
    </div>
  );
};

export default Post;
