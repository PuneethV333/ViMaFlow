import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";
import { HiMenu } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import Footer from "../components/Footer";
import Analytics from "../components/Analytics";
import Post from "../components/Post";
import { IoIosAddCircleOutline } from "react-icons/io";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading, setPostData, signout } =
    useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const [openAddPost, setOpenAddPost] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [postImg, setPostImg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be < 5MB");
    if (!file.type.startsWith("image/"))
      return toast.error("Select image file only");
    setPostImg(file);
  };

  const updatePosts = async () => {
    try {
      let imageUrl = postImg;
      if (postImg instanceof File) {
        const formData = new FormData();
        formData.append("file", postImg);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );

        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = cloudRes.data.secure_url;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/upload`,
        {
          imageUrl,
          title,
          description,
          userid: userData._id,
        }
      );
      const newPost = res.data.post;
      setPostData((prev) => [newPost, ...prev]);

      toast.success("Profile picture updated!");
      setOpenAddPost(false);
      setPostImg(null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add post");
    }
  };

  useEffect(() => {
    if (openAddPost) {
      setOpen(!open);
    }
  }, [openAddPost]);

  const colorMap = {
    green: "text-green-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
  };

  const cards = [
    {
      title: "Active Users",
      value: "1,245",
      change: "+12%",
      color: "green",
      label: "This week",
    },
    {
      title: "New Signups",
      value: "342",
      change: "+8%",
      color: "blue",
      label: "Today",
    },
    {
      title: "Revenue",
      value: "₹12.3K",
      change: "+₹2.3K",
      color: "green",
      label: "This month",
    },
    {
      title: "Retention Rate",
      value: "98%",
      change: "Stable",
      color: "yellow",
      label: "Last 30 days",
    },
    {
      title: "Support Tickets",
      value: "27",
      change: "+5",
      color: "red",
      label: "Pending",
    },
    {
      title: "System Uptime",
      value: "99.99%",
      change: "100%",
      color: "green",
      label: "Last 7 days",
    },
  ];

  return (
    <div className="bg-[#0A0F1C] min-h-screen w-full text-zinc-400 flex flex-col overflow-x-hidden">
      <Navbar user={user} userData={userData} signout={signout} />

      <div className="px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight">
          Welcome back, {userData?.displayName || "Explorer"} 👋
        </h1>
        <p className="text-sm text-zinc-400 mt-1 sm:text-3xl">
          Ready to flow through your dashboard?
        </p>
      </div>

      <Post />

      <AnimatePresence>
        {openAddPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0F1C] w-full max-w-2xl p-6 rounded-2xl shadow-2xl border border-cyan-500/20 relative"
            >
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setOpenAddPost(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-800 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>

              <h2 className="text-white text-xl font-bold mb-4">
                Add New Post
              </h2>

              <div className="flex flex-col gap-4">
                <input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  type="text"
                  placeholder="Post title"
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <textarea
                  placeholder="Post description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  rows={4}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  className="text-gray-300"
                  onChange={handleFileChange}
                />

                <button
                  className="px-6 py-2 bg-cyan-600 rounded-md hover:bg-cyan-500 text-white font-semibold transition"
                  onClick={updatePosts}
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-50">
        <div
          ref={menuRef}
          id="menu-bar"
          className={`absolute bottom-16 right-0 flex flex-col gap-3 bg-[#121826] p-4 rounded-xl shadow-xl text-white w-52 border border-zinc-700 backdrop-blur-md ${
            open ? "block" : "hidden"
          }`}
        >
          <button
            onClick={() => navigate("/chats")}
            className="flex items-center gap-3 hover:text-blue-400 transition text-left py-2"
          >
            <HiMiniChatBubbleLeftEllipsis className="text-xl" />
            <span className="text-sm font-medium">Chat</span>
          </button>

          <button
            onClick={() => {
              setOpenAddPost(true);
            }}
            className="flex items-center gap-3 hover:text-green-400 transition text-left py-2"
          >
            <IoIosAddCircleOutline className="text-xl" />
            <span className="text-sm font-medium">Add Post</span>
          </button>

          <button
            onClick={signout}
            className="flex items-center gap-3 hover:text-red-400 transition text-left py-2"
          >
            <IoIosLogOut className="text-xl" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 cursor-pointer text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <HiMenu className="text-xl" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 py-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[#121826] border border-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white text-lg font-semibold">{card.title}</h3>
              <span className={`${colorMap[card.color]} text-sm`}>
                {card.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1f2937] p-4 rounded-lg text-white flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-400">Total Revenue</p>
          <h3 className="text-2xl font-bold">₹1,05,000</h3>
        </div>
        <div>
          <p className="text-sm text-zinc-400">New Signups</p>
          <h3 className="text-2xl font-bold">425</h3>
        </div>
      </div>

      <Analytics />

      <Footer />
    </div>
  );
};

export default Dashboard;
