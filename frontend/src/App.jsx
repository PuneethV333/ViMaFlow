import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import { ToastContainer } from "react-toastify";
import LoginRestriction from "./RistrictedRoutes/LoginRistricion";
import PostDetails from "./components/PostDetails";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <LoginRestriction>
              <Dashboard />
            </LoginRestriction>
          }
        />
        <Route
          path="/profile"
          element={
            <LoginRestriction>
              <Profile />
            </LoginRestriction>
          }
        />
        <Route
          path="/post/:id"
          element={
            <LoginRestriction>
              <PostDetails />
            </LoginRestriction>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
