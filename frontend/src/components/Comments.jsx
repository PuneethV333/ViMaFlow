import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Reply } from "lucide-react";

const Comments = ({ comment, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 
                 hover:border-gray-600/50 transition-all group w-full max-w-2xl mx-auto"
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        src={
          comment.userid?.profilePic ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            comment.userid?.displayName || "User"
          )}&background=random&color=fff`
        }
        alt={comment.userid?.displayName || "User"}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-600/50 
                   cursor-pointer flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-semibold text-sm text-white hover:opacity-80 cursor-pointer transition-opacity">
            {comment.userid?.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>

        <p className="text-sm text-gray-300 break-words mb-2 leading-snug">
          {comment.comment}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <Heart
              size={16}
              className={`${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {likeCount}
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-1 hover:text-blue-400 transition-colors"
          >
            <Reply size={16} />
            Reply
          </button>
        </div>

        {showReplyInput && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Write a reply..."
              className="w-full bg-gray-700/50 text-white text-sm rounded-md p-2 outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Comments;
