import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { signUpViaEmail, viaGoogle, viaGit } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gitLoading, setGitLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    try {
      await signUpViaEmail(email, password, displayName);
      toast.success("🎉 Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    }
  };

  const handleViaGoogle = async () => {
    try {
      setGoogleLoading(true);
      await viaGoogle();
      toast.success("🎉 Signed up with Google!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign up with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleViaGit = async () => {
    try {
      setGitLoading(true);
      await viaGit();
      toast.success("🎉 Signed up with GitHub!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign up with GitHub");
    } finally {
      setGitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-4 overflow-x-hidden">
      <div className="w-full max-w-sm bg-[#121826]/80 backdrop-blur-md border border-[#2A2F3C] rounded-xl p-5 sm:p-6 flex flex-col gap-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300">
        <img
          src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
          alt="ViMa-Flow"
          className="w-20 mx-auto drop-shadow-lg"
        />
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-white">
          Create your account 👋
        </h2>

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#1A1F2C] text-white text-sm border border-[#2A2F3C] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <input
          type="text"
          placeholder="Choose a display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#1A1F2C] text-white text-sm border border-[#2A2F3C] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <input
          type="password"
          placeholder="Create a secure password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg bg-[#1A1F2C] text-white text-sm border border-[#2A2F3C] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />

        <button
          onClick={handleSignup}
          className="py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all"
        >
          Sign Up
        </button>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleViaGoogle}
            disabled={googleLoading}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1A1F2C] text-white border border-[#2A2F3C] hover:bg-[#202636] transition ${
              googleLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760518991/google-logo-png-icon-free-download-SUF63j_l4nq2t.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">
              {googleLoading ? "Signing up..." : "Sign up with Google"}
            </span>
          </button>

          <button
            onClick={handleViaGit}
            disabled={gitLoading}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1A1F2C] text-white border border-[#2A2F3C] hover:bg-[#202636] transition ${
              gitLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760783248/hpntxfgjwtdfzv8hdbrl.png"
              alt="Github"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">
              {gitLoading ? "Signing up..." : "Sign up with GitHub"}
            </span>
          </button>
        </div>

        <a
          href="/login"
          className="text-center text-sm text-gray-400 hover:text-blue-400 transition"
        >
          Already have an account? <span className="text-blue-500">Log in</span>
        </a>
      </div>
    </div>
  );
};

export default Signup;
