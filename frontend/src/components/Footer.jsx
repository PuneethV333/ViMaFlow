import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#121826]/80 text-zinc-400 py-10 px-6 sm:px-12 mt-auto border-t border-zinc-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
        
        <div className="flex flex-col gap-3">
          <img
            src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
            alt="ViMaFlow Logo"
            className="w-24 sm:w-28 mx-auto sm:mx-0 drop-shadow-lg"
          />
          <p className="text-sm leading-relaxed text-center sm:text-left">
            ViMaFlow is your launchpad for innovation, collaboration, and growth. Built for creators, dreamers, and doers.
          </p>
        </div>

        
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-white font-semibold text-lg mb-2">Explore</h3>
          <div className="flex flex-col sm:flex-col gap-1">
            {["Home", "About", "Login", "Signup"].map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase()}`}
                className="hover:text-[#6EE7B7] transition"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-white font-semibold text-lg mb-2">Connect</h3>
          <div className="flex justify-center sm:justify-start gap-4 flex-wrap">
            <a
              href="https://github.com/PuneethV333"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6EE7B7] transition"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/puneeth-v-78a394336/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#6EE7B7] transition"
            >
              LinkedIn
            </a>
            <a
              href="mailto:puneethvijayakumar@gmail.com"
              className="hover:text-[#6EE7B7] transition"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      
      <div className="mt-10 text-center text-sm text-zinc-500">
        &copy; 2025 ViMaFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
