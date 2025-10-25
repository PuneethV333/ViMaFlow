import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Reply } from "lucide-react";

const Comments = ({ comment, index = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);

  

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/50 transition-all group"
    >
      <motion.img
        whileHover={{ scale: 1.1 }}
        src={comment.userid?.profilePic || "https://via.placeholder.com/32"}
        alt={comment.userid?.displayName || "User"}
        className="w-8 h-8 rounded-full object-cover border border-gray-600/50 cursor-pointer flex-shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        
        <div className="flex items-center gap-2 mb-1">
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

        
        <p className="text-sm text-gray-300 break-words mb-2">
          {comment.comment}
        </p>
      </div>
    </motion.div>
  );
};

export default Comments;