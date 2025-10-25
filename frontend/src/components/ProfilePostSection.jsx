import React from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";

const ProfilePostSection = ({ info }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      className="relative group rounded-xl overflow-hidden bg-slate-900/40 border border-gray-800/60 hover:border-gray-700/80 transition-all duration-300 cursor-pointer w-full aspect-square"
    >
      
      <motion.img
        src={info.image}
        alt={info.title || "Post"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100"
      >
        <div className="flex gap-4 items-center text-sm font-semibold">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{info.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>{info.comments?.length || 0}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePostSection;
