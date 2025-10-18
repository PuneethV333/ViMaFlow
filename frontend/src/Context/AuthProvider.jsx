import React, { createContext } from "react";
import { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reload,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Auth, gitProvider, googleProvider } from "../config/firebase";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AuthContext = createContext();

export const getFriendlyError = (err) => {
  if (err.code) {
    const firebaseErrors = {
      "auth/user-not-found": "No account found with this email",
      "auth/wrong-password": "Incorrect password",
      "auth/invalid-email": "Invalid email address",
      "auth/email-already-in-use": "Email already in use",
      "auth/weak-password": "Password should be at least 6 characters",
      "auth/popup-closed-by-user": "Popup closed before completing sign-in",
      "auth/cancelled-popup-request": "Popup cancelled, try again",
      "auth/too-many-requests": "Too many attempts, try again later",
    };
    return firebaseErrors[err.code] || "Something went wrong, please try again";
  } else if (err.response) {
    return err.response.data?.message || "Server error, please try again";
  } else {
    return err.message || "Something went wrong";
  }
};

export const saveGoogleUser = async (user, token) => {
  try {
    const email = user.email || "NoEmailProvided";
    const displayName = user.displayName || "Unknown Name";
    const uid = user.uid;

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/google`,
      { email, displayName, firebaseUid: uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data; 
  } catch (err) {
    if (err.response?.data?.message === "User already exists") {
      const token = await user.getIdToken();
      const existingRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return existingRes.data;
    }

    console.error(
      "Error saving Google user:",
      err.response?.data || err.message
    );
    toast.error("⚠ Failed to save Google user to backend");
    return null;
  }
};

export const saveGitUser = async (user, token) => {
  try {
    const email = user.email || "NoEmailProvided";
    const displayName = user.displayName || "Unknown Name";
    const uid = user.uid;

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/git`,
      { email, displayName, firebaseUid: uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data; 
  } catch (err) {
    if (err.response?.data?.message === "User already exists") {
      const existingRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return existingRes.data;
    }

    console.error(
      "Error saving Github user:",
      err.response?.data || err.message
    );
    toast.error("Failed to save Github user to backend");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, (crrUser) => {
      setUser(crrUser);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (firebaseUser) => {
    if (!firebaseUser) return setUserData(null);
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(res.data);
    } catch (err) {
      console.warn("Backend user not found yet:", err.response?.data?.message);
      setUserData(null);
      throw err;
    }
  };

  const signUpViaEmail = async (email, password, fullname) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        Auth,
        email,
        password
      );

      const token = await userCred.user.getIdToken();

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
        email,
        firebaseUid: userCred.user.uid,
        displayName: fullname,
      });

      toast.success("User registered successfully!");
      return userCred.user;
    } catch (err) {
      console.error(err);
      toast.error(getFriendlyError(err));
    }
  };

  const signInViaEmail = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(Auth, email, password);

      await reload(userCred.user);

      const token = await userCred.user.getIdToken();

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData(res.data);
      toast.success("User Login successfully!");
    } catch (err) {
      console.error(err);
      toast.error(getFriendlyError(err));
    }
  };

  const signout = async () => {
    await Auth.signOut();
    setUser(null);
    setUserData(null);
  };

  const viaGoogle = async () => {
    try {
      const res = await signInWithPopup(Auth, googleProvider);
      const token = await res.user.getIdToken();

      const savedUser = await saveGoogleUser(res.user, token);

      await fetchUserData(res.user);
    } catch (err) {
      console.error("Google signin error:", err);
      toast.error(getFriendlyError(err));
    }
  };

  const viaGit = async () => {
    try {
      const res = await signInWithPopup(Auth, gitProvider);
      const token = await res.user.getIdToken();

      const savedUser = await saveGitUser(res.user, token); // handles new or existing user

      await fetchUserData(res.user); // updates frontend state with user info
    } catch (err) {
      console.error("Git signin error:", err);
      toast.error(getFriendlyError(err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        signInViaEmail,
        signUpViaEmail,
        signout,
        viaGoogle,
        viaGit,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
