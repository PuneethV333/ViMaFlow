import React, { useContext, useState } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { toast } from 'react-toastify';

const Login = () => {
  const { signInViaEmail, viaGoogle, viaGit } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gitLoading, setGitLoading] = useState(false);

  const handleBtn = async () => {
    if (!email || !pass) {
      toast.error('Please enter email and password');
      return;
    }
    try {
      await signInViaEmail(email, pass);
    } catch (err) {
      toast.error(err);
    }
  };

  const handleViaGoogle = async () => {
    try {
      setGoogleLoading(true);
      await viaGoogle();
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleViaGit = async () => {
    try {
      setGitLoading(true);
      await viaGit();
    } catch (err) {
      console.error(err);
      toast.error('Failed to sign in with GitHub');
    } finally {
      setGitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[#121826] rounded-xl p-6 sm:p-8 flex flex-col gap-6 shadow-lg">
        <img
          src="https://res.cloudinary.com/deymewscv/image/upload/v1760784489/smaller_mobile_versi_y0q4zd.png"
          alt="ViMa-Flow"
          className="w-20 sm:w-24 mx-auto"
        />

        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-3 rounded-md bg-[#1A1F2C] text-white text-sm border border-[#2A2F3C] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="px-4 py-3 rounded-md bg-[#1A1F2C] text-white text-sm border border-[#2A2F3C] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleBtn}
          className="py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Sign In
        </button>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleViaGoogle}
            disabled={googleLoading}
            className={`flex items-center justify-center gap-2 py-3 rounded-md bg-white text-black transition ${
              googleLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760518991/google-logo-png-icon-free-download-SUF63j_l4nq2t.png"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </span>
          </button>

          <button
            onClick={handleViaGit}
            disabled={gitLoading}
            className={`flex items-center justify-center gap-2 py-3 rounded-md bg-white text-black transition ${
              gitLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src="https://res.cloudinary.com/deymewscv/image/upload/v1760783248/hpntxfgjwtdfzv8hdbrl.png"
              alt="Github"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">
              {gitLoading ? 'Signing in...' : 'Sign in with Github'}
            </span>
          </button>
        </div>

        <a
          href="/signup"
          className="text-center text-sm text-gray-400 hover:text-blue-400 transition"
        >
          Don't have an account? <span className="text-blue-500">Sign up</span>
        </a>
      </div>
    </div>
  );
};

export default Login;