import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  reload,
} from "firebase/auth";
import { Auth, googleProvider, gitProvider } from "../config/firebase";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user data from backend
  const fetchUserData = async (firebaseUser) => {
    if (!firebaseUser) return setUserData(null);
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(res.data);
    } catch (err) {
      console.warn("Backend user not found yet:", err.response?.data?.message);
      setUserData(null);
    }
  };

  // Fetch project data
  const fetchProjectData = async (userid) => {
    if (!userid) return [];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/user/${userid}`
      );
      return res.data || [];
    } catch (err) {
      console.warn("Backend project not found:", err.response?.data?.message);
      return [];
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, async (crrUser) => {
      setUser(crrUser);
      if (crrUser) await fetchUserData(crrUser);
      else setUserData(null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userId = userData?._id;
    if (userId) {
      fetchProjectData(userId).then((data) => setProject(data || []));
    } else {
      setProject([]);
    }
  }, [userData]);

  const updateUserData = (newData) => {
    setUserData((prev) => ({ ...prev, ...newData }));
  };

  const signUpViaEmail = async (email, password, fullname) => {
    try {
      const userCred = await createUserWithEmailAndPassword(Auth, email, password);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
        email,
        firebaseUid: userCred.user.uid,
        displayName: fullname,
      });
      toast.success("🎉 User registered successfully!");
      return userCred.user;
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signup failed");
    }
  };

  const signInViaEmail = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(Auth, email, password);
      await reload(userCred.user);
      await fetchUserData(userCred.user);
      toast.success("✅ Logged in successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Signin failed");
    }
  };

  const signout = async () => {
    await Auth.signOut();
    setUser(null);
    setUserData(null);
    toast.info("👋 Signed out successfully!");
  };

  const viaGoogle = async () => {
    try {
      const res = await signInWithPopup(Auth, googleProvider);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
        email: res.user.email,
        displayName: res.user.displayName,
        firebaseUid: res.user.uid,
      });
      await fetchUserData(res.user);
      toast.success("🎉 Logged in with Google!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google login failed");
    }
  };

  const viaGit = async () => {
    try {
      const res = await signInWithPopup(Auth, gitProvider);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/git`, {
        email: res.user.email,
        displayName: res.user.displayName,
        firebaseUid: res.user.uid,
      });
      await fetchUserData(res.user);
      toast.success("🎉 Logged in with GitHub!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "GitHub login failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        project,
        signUpViaEmail,
        signInViaEmail,
        signout,
        viaGoogle,
        viaGit,
        updateUserData,
        fetchUserData,
        fetchProjectData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
