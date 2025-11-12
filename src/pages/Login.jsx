import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "./logo.png";

const Login = () => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Example validation logic (no backend)
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // Example: hardcoded login validation
    if (username === "admin" && password === "1234") {
      toast.success("Login successful!");
      navigate("/home");
      // Proceed with next steps (e.g., redirect, update UI, etc.)
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1219] flex flex-col items-center justify-center p-4 md:p-6 font-sans text-[#ebf6ff]">
      <div className="w-full max-w-[90vw] sm:max-w-md bg-[#1a1f2c] p-4 sm:p-6 md:p-8 rounded-xl shadow-lg border border-[#00E1A1] mx-auto">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6 select-none">
          {/* Logo Image */}
          <img
            src={logo}
            alt="V Trade Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 object-contain"
          />
          {/* Brand Name */}
        </div>

        {/* Conditional Views */}
        {view === "login" && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#a1b0cc]">
              Login to your account
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-3 sm:py-2 text-sm sm:text-base mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-3 sm:py-2 text-sm sm:text-base mb-4 sm:mb-6 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#00E1A1] to-[#00FF66] hover:from-[#00CC8A] hover:to-[#00E659] py-3 sm:py-3 rounded-md font-semibold text-sm sm:text-base transition disabled:opacity-50"
            >
              Login
            </button>
            <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-[#6b7a99]">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setView("signup");
                }}
                className="text-[#00CC8A] hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {view === "signup" && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#a1b0cc]">
              Create a new account
            </h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-3 sm:py-2 text-sm sm:text-base mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-3 sm:py-2 text-sm sm:text-base mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-3 sm:py-2 text-sm sm:text-base mb-4 sm:mb-6 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <button className="w-full bg-gradient-to-r from-[#00E1A1] to-[#00FF66] hover:from-[#00CC8A] hover:to-[#00E659] py-3 sm:py-3 rounded-md font-semibold text-sm sm:text-base transition disabled:opacity-50">
              Sign Up
            </button>
            <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-[#6b7a99]">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setView("login");
                }}
                className="text-[#00E1A1] hover:underline font-medium"
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
