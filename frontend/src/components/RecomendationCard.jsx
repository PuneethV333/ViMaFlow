import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { toast } from "react-toastify";

const RecomendationCard = ({ info }) => {
  const { user, userData, setUserData, fetchPostData } = useContext(AuthContext);

  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {
    setFollowing(userData?.following?.includes(info._id) || false);
  }, [userData, info._id]);

  const handleFollowToggle = async () => {
    if (!user) return toast.error("Please login first!");
    try {
      setLoadingFollow(true);
      const token = await user.getIdToken();
      const endpoint = following ? "unfollow" : "follow";

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update/follow`,
        { endpoint, respientId: info._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newFollowState = !following;
      setFollowing(newFollowState);

      if (res.data) setUserData(res.data);

      
      await fetchPostData(user);

      toast.success(
        newFollowState ? "Now following this user!" : "Unfollowed successfully"
      );
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
      toast.error("Error updating follow status");
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between
      bg-white/80 backdrop-blur-md border border-zinc-200 shadow-sm hover:shadow-lg
      hover:-translate-y-1 transition-all duration-300
      rounded-2xl p-5 md:p-6
      w-[85vw] sm:w-60 md:w-64 lg:w-64
      min-h-[280px] sm:min-h-[300px]"
    >
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border border-gray-200">
        <img
          src={
            info.profilePic ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              info.displayName || "User"
            )}&background=random&color=fff`
          }
          alt={info.displayName}
          className="w-full h-full object-cover"
        />
        {loadingFollow && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700">
            ⏳
          </div>
        )}
      </div>

      <h1 className="text-lg font-semibold text-gray-800 text-center">
        {info.displayName || "Unknown User"}
      </h1>

      {info.skills?.length > 0 && (
        <p className="text-xs sm:text-sm text-gray-500 text-center mt-1 px-3 line-clamp-2">
          {info.skills.slice(0, 3).join(", ")}
          {info.skills.length > 3 && " ..."}
        </p>
      )}

      <button
        onClick={handleFollowToggle}
        disabled={loadingFollow}
        className={`mt-4 px-5 py-2 rounded-full text-sm sm:text-base font-medium text-white w-full sm:w-auto
          transition-all duration-200 ${
            following
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          } ${loadingFollow ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {loadingFollow
          ? "Please wait..."
          : following
          ? "Unfollow"
          : "Follow"}
      </button>
    </div>
  );
};

export default RecomendationCard;
