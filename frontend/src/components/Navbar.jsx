import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";

const Navbar = ({ userData }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#121826]/80 h-[80px] w-full px-6 flex justify-between items-center sticky top-0 z-50 shadow-md backdrop-blur-md">
      <a href="/" className="block">
        <img
          src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
          alt="ViMa-Flow"
          className="w-28 drop-shadow-lg hidden sm:block"
        />
        <img
          src="https://res.cloudinary.com/deymewscv/image/upload/v1760798310/make_the_background_emesg0.png"
          alt="ViMa-Flow"
          className="w-24 drop-shadow-lg block sm:hidden"
        />
      </a>

      <div className="hidden md:flex items-center gap-6">
        <a
          href="/profile"
          className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:ring-2 hover:ring-blue-500 hover:bg-stone-200"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={userData?.profilePic}
              alt="user-pic"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-[#0A0F1C] whitespace-nowrap">
            {userData?.displayName}
          </span>
        </a>
      </div>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden text-white text-2xl"
      >
        <HiMenu />
      </button>

      {mobileOpen && (
        <div className="absolute top-[80px] right-0 w-full bg-[#121826] flex flex-col items-start px-6 py-4 gap-4 border-t border-zinc-700 md:hidden z-40">
          <a
            href="/dashboard"
            className="text-sm text-zinc-300 hover:text-blue-400 transition"
          >
            Dashboard
          </a>
          <a
            href="/profile"
            className="text-sm text-zinc-300 hover:text-blue-400 transition"
          >
            Profile
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
