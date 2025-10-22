import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { HiMiniChatBubbleLeftEllipsis } from "react-icons/hi2";
import { HiMenu } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import Footer from "../components/footer";
import Analytics from "../components/Analytics";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, loading, signout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121826]">
        <div className="loader animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
