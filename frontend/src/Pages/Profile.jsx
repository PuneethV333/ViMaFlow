import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../Context/AuthProvider";
import ProjectCard from "../components/ProjectCard";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import ViMaCompass from "../components/ViMaCompass";
import { gsap } from "gsap";
import ProfilePostSection from "../components/ProfilePostSection";
import ResumeReviewer from "../components/ResumeReviewer";
import { Plus } from "lucide-react";
import { set } from "mongoose";

const ProfilePicWithRing = ({ src, onClick }) => {
  const ringGradientRef = useRef();

  useEffect(() => {
    gsap.to(ringGradientRef.current, {
      backgroundPosition: "200% 0%",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    });
  }, []);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background:
            "linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6, #ec4899, #f97316, #22d3ee)",
          backgroundSize: "200% 200%",
        }}
        ref={ringGradientRef}
      ></div>

      <div className="absolute inset-1 rounded-full bg-[#121826]"></div>

      <img
        src={src}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-gray-800 shadow-[0_0_25px_#22d3ee] hover:scale-105 cursor-pointer transition-transform duration-300 relative z-10"
        onClick={onClick}
      />
    </div>
  );
};

const Profile = () => {
  const {
    userData,
    loading,
    project,
    setProject,
    updateUserData,
    setUserData,
    user,
  } = useContext(AuthContext);
  const [bio, setBio] = useState(userData?.bio || "");
  const [editOpen, setEditOpen] = useState(false);
  const [picChangeOpen, setPicChangeOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [userPost, setUserPost] = useState(null);
  const [openRole, setOpenRole] = useState(false);
  const [openProjUplode, setOpenProjUplode] = useState(false);
  const [role, setRole] = useState(userData.role);
  const [projTitle, setProjTitle] = useState("");
  const [projImg, setProjImg] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");

  const skillIcons = {
    Python: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
    JavaScript: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
    TypeScript: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png",
    Cplusplus: "https://cdn-icons-png.flaticon.com/512/6132/6132222.png",
    Java: "https://cdn-icons-png.flaticon.com/512/226/226777.png",
    Go: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    Rust: "https://cdn-icons-png.flaticon.com/512/5968/5968384.png",
    React: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
    Nextjs: "https://cdn-icons-png.flaticon.com/512/5968/5968672.png",
    TailwindCSS: "https://cdn-icons-png.flaticon.com/512/5968/5968706.png",
    HTML5: "https://cdn-icons-png.flaticon.com/512/732/732212.png",
    CSS3: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
    Nodejs: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
    Expressjs: "https://cdn-icons-png.flaticon.com/512/919/919842.png",
    MongoDB: "https://cdn-icons-png.flaticon.com/512/919/919836.png",
    PostgreSQL: "https://cdn-icons-png.flaticon.com/512/5968/5968342.png",
    Firebase: "https://cdn-icons-png.flaticon.com/512/5968/5968358.png",
    Docker: "https://cdn-icons-png.flaticon.com/512/919/919853.png",
    Kubernetes: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    Git: "https://cdn-icons-png.flaticon.com/512/2111/2111288.png",
    AWS: "https://cdn-icons-png.flaticon.com/512/873/873120.png",
    Azure: "https://cdn-icons-png.flaticon.com/512/873/873107.png",
    GCP: "https://cdn-icons-png.flaticon.com/512/873/873108.png",
    TensorFlow: "https://cdn-icons-png.flaticon.com/512/5968/5968702.png",
    MachineLearning: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    DataScience: "https://cdn-icons-png.flaticon.com/512/4140/4140051.png",
    Linux: "https://cdn-icons-png.flaticon.com/512/226/226772.png",
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/user/${userData._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserPost(res.data);
      } catch (err) {
        console.error("Error fetching user's posts:", err);
      }
    };

    fetchUserPosts();
  }, [user, userData]);

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

  const handleFileChangeofProj = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("File size must be < 5MB");
    if (!file.type.startsWith("image/"))
      return toast.error("Select image file only");
    setProjImg(file);
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

  const uplodeProj = async () => {
    try {
      if (
        !projTitle?.trim() ||
        !projDescription?.trim() ||
        !technologies?.length
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      if (projDescription.length > 500) {
        toast.error("Description can't be greater than 500 characters.");
        return;
      }

      let imageUrl = projImg;
      if (projImg instanceof File) {
        const formData = new FormData();
        formData.append("file", projImg);
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

      const token = await user.getIdToken(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/addProj`,
        {
          title: projTitle.trim(),
          description: projDescription.trim(),
          image: imageUrl,
          technologies,
          githublink: githubLink?.trim() || "",
          livelink: liveLink?.trim() || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProject((prev) => [...prev, res.data.project]);
      toast.success("Project added successfully!");

      setOpenProjUplode(false)
      setProjTitle("");
      setProjDescription("");
      setProjImg("");
      setTechnologies([]);
      setGithubLink("");
      setLiveLink("");
    } catch (err) {
      console.error("Error adding project:", err);

      if (err.response?.data?.error?.includes("E11000")) {
        const dupField = err.response.data.error.includes("livelink")
          ? "Live Link"
          : "Title";
        toast.error(`${dupField} already exists. Please use a different one.`);
        return;
      }

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
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

  const updateRole = async () => {
    try {
      if (!role) return toast.error("select role");
      if (role == userData.role) return toast.info("role is set already");
      const token = await user.getIdToken(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/role`,
        {
          role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setOpenRole(!openRole);
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
            <ProfilePicWithRing
              src={userData.profilePic}
              onClick={() => setPicChangeOpen(true)}
            />

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

        {openRole && (
          <div className="mt-4 bg-[#1A1F2E] p-4 rounded-xl border border-zinc-700 shadow-lg w-full max-w-sm">
            <h3 className="text-white font-semibold mb-3 text-center">
              Select Role
            </h3>

            <div className="flex flex-col sm:flex-row justify-around gap-3">
              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  role === "user"
                    ? "bg-cyan-600 text-white border border-cyan-400 shadow-md"
                    : "bg-[#121826] text-zinc-300 border border-zinc-600 hover:bg-[#1E2436]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="user"
                  onChange={(e) => setRole(e.target.value)}
                  checked={role === "user"}
                  className="accent-cyan-500"
                />
                <span>User</span>
              </label>

              <label
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  role === "mentor"
                    ? "bg-cyan-600 text-white border border-cyan-400 shadow-md"
                    : "bg-[#121826] text-zinc-300 border border-zinc-600 hover:bg-[#1E2436]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  onChange={(e) => setRole(e.target.value)}
                  checked={role === "mentor"}
                  className="accent-cyan-500"
                />
                <span>Mentor</span>
              </label>
            </div>

            <button
              onClick={updateRole}
              className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition-all duration-200 shadow-md"
            >
              Update Role
            </button>
          </div>
        )}

        <div className="flex-1 min-w-[300px] max-w-full md:max-w-[50%] bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6 space-y-6">
          <div>
            <h2 className="text-lg text-white font-semibold">Name</h2>
            <p className="text-zinc-300">{userData.displayName}</p>
          </div>
          <div>
            <h2
              className="text-lg text-white font-semibold cursor-pointer"
              onClick={() => {
                setOpenRole(!openRole);
              }}
            >
              Role
            </h2>
            <p className="text-zinc-300">{userData.role}</p>
          </div>
          <div>
            <h2 className="text-lg text-white font-semibold">Email</h2>
            <p className="text-zinc-300">{userData.email}</p>
          </div>
        </div>

        {/* Add Project */}
        {openProjUplode && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 text-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md relative animate-fadeIn">
              <h1 className="text-3xl font-bold text-center mb-6 text-white">
                🚀 Add a New Project
              </h1>

              <button
                onClick={() => setOpenProjUplode(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>

              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <textarea
                  name="description"
                  placeholder="Enter detailed description of your project"
                  value={projDescription}
                  onChange={(e) => setProjDescription(e.target.value)}
                  rows={4}
                  className="bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-xs text-gray-400 text-right -mt-2">
                  {projDescription.length}/500
                </p>

                <input
                  type="text"
                  name="technologies"
                  placeholder="Technologies Used"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  className="bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  name="livelink"
                  placeholder="Live Project Link"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className="bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  name="github"
                  placeholder="GitHub Repository Link"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  className="bg-zinc-800 text-white placeholder-gray-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeofProj}
                  className="bg-zinc-800 text-white px-4 py-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                />

                <button
                  onClick={uplodeProj}
                  className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-xl transition-all duration-300 shadow-md hover:scale-[1.03] active:scale-[0.97]"
                >
                  📤 Upload Project
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6">
          <div className="flex justify-between">
            <h2 className="text-lg text-white font-semibold mb-6">Projects</h2>
            <button
              className="flex items-center gap-2 text-sm text-zinc-300 bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 hover:text-white transition-all duration-200"
              onClick={() => setOpenProjUplode(true)}
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
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

      <section className="w-full bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6 mt-6">
        <h2 className="text-lg text-white font-semibold mb-4">My Posts</h2>

        {userPost && userPost.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {userPost.map((p, i) => (
              <ProfilePostSection key={i} info={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center w-full text-lg">
            No posts yet
          </p>
        )}
      </section>

      <section className="w-full bg-[#121826] rounded-xl border border-zinc-700 shadow-md p-6 mt-6">
        <h2 className="text-lg text-white font-semibold mb-4">Skills</h2>

        {userData.skills && userData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {userData.skills.map((skill, i) => {
              const key = skill.replace(/[^a-zA-Z0-9]/g, "");
              const icon =
                skillIcons[key] ||
                "https://cdn-icons-png.flaticon.com/512/565/565547.png";

              return (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-cyan-700 text-white text-sm px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform duration-200"
                >
                  <img src={icon} alt={skill} className="w-4 h-4" />
                  <span>{skill}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-zinc-400">No skills added yet.</p>
        )}
      </section>

      <ViMaCompass />

      <ResumeReviewer />

      <Footer />
    </div>
  );
};

export default Profile;
