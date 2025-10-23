import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import ProjectCard from "../components/ProjectCard";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../components/Footer";

const Profile = () => {
  const { userData, loading, project, updateUserData } =
    useContext(AuthContext);
  const [bio, setBio] = useState(userData?.bio || "");
  const [editOpen, setEditOpen] = useState(false);
  const [picChangeOpen, setPicChangeOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);


  

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121826]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!userData)
    return (
      <div className="w-full h-screen flex items-center justify-center text-white bg-[#121826]">
        No user data found
      </div>
    );


  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be < 5MB");
    if (!file.type.startsWith("image/"))
      return toast.error("Select image file only");
    setProfilePic(file);
  };

  const updateProfilePic = async () => {
    try {
      let imageUrl = profilePic;
      if (profilePic instanceof File) {
        const formData = new FormData();
        formData.append("file", profilePic);
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

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/profilePic`,
        {
          imageUrl,
          userid: userData._id,
        }
      );

      updateUserData({ profilePic: imageUrl });
      toast.success("Profile picture updated!");
      setPicChangeOpen(false);
      setProfilePic(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update profile pic"
      );
    }
  };

  const updateBio = async () => {
    try {
      if (!bio) return toast.error("Enter bio");
      if (bio.length > 300) return toast.error("Bio max 300 characters");

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/bio`,
        {
          bio,
          userid: userData._id,
        }
      );

      updateUserData({ bio });
      toast.success("Bio updated successfully!");
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update bio");
    }
  };

  

  return (
    <div className="bg-[#0A0F1C] min-h-screen w-full text-zinc-400 flex flex-col overflow-x-hidden">
      <nav className="bg-[#121826]/80 h-20 w-full px-6 flex justify-between items-center sticky top-0 z-50 shadow-md backdrop-blur-md">
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
      </nav>

      {picChangeOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md relative">
            <button
              onClick={() => setPicChangeOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {profilePic && (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-full border border-zinc-600"
              />
            )}
            <button
              onClick={updateProfilePic}
              className="mt-4 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-500"
            >
              Update
            </button>
          </div>
        </div>
      )}

      <section className="flex flex-wrap px-4 sm:px-6 py-10 gap-6">
        <div className="flex-1 min-w-[300px] max-w-full md:max-w-[50%] bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6 flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <div className="relative w-32 h-32">
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-gray-800 shadow-[0_0_25px_#22d3ee] hover:scale-105 cursor-pointer transition-transform duration-300"
                onDoubleClick={() => setPicChangeOpen(true)}
              />
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Joined on:{" "}
              <span className="text-white font-medium">
                {userData.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-start gap-4 w-full">
            {userData.bio && (
              <div>
                <h2 className="text-white font-semibold text-md mb-1">Bio</h2>
                <p className="text-zinc-300">{userData.bio}</p>
              </div>
            )}

            <button
              onClick={() => setEditOpen(!editOpen)}
              className="self-start px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition"
            >
              {editOpen ? "Close Bio Editor" : "Edit Bio"}
            </button>

            {editOpen && (
              <div className="mt-2">
                <textarea
                  placeholder="Enter your bio..."
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  className="w-full p-3 rounded-md bg-[#1A1F2E] text-white border border-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={4}
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {bio.length} / 300 characters
                </p>

                <button
                  onClick={updateBio}
                  className="mt-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-500"
                >
                  Update Bio
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-[300px] max-w-full md:max-w-[50%] bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-lg text-white font-semibold">Name</h2>
            <p className="text-zinc-300">{userData.displayName}</p>
          </div>
          <div>
            <h2 className="text-lg text-white font-semibold">Email</h2>
            <p className="text-zinc-300">{userData.email}</p>
          </div>
        </div>

        <div className="w-full bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6">
          <h2 className="text-lg text-white font-semibold mb-6">Projects</h2>
          {project && project.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.map((p, i) => (
                <ProjectCard key={i} info={p} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">No projects found yet.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
