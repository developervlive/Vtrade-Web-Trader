import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    <div className="min-h-screen bg-[#0e1219] flex flex-col items-center justify-center p-6 font-sans text-[#ebf6ff]">
      <div className="w-full max-w-md bg-[#1a1f2c] p-8 rounded-xl shadow-lg border border-[#00E1A1]">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-6 justify-center select-none">
          {/*}  <FintechLogo />
          {/*  <h1 className="text-3xl font-bold text-[#00FF66] ">Digital Brains</h1> */}
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-[#00E1A1] to-[#00FF66] bg-clip-text text-transparent 
               hover:from-[#00CC8A] hover:to-[#00E659] transition-all duration-500 ease-in-out cursor-pointer"
          >
            V Trade
          </h1>
        </div>

        {/* Conditional Views */}
        {view === "login" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-[#a1b0cc]">
              Login to your account
            </h2>
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-2 mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-2 mb-6 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <button
              onClick={handleLogin}
              className="w-full   bg-gradient-to-r from-[#00E1A1] to-[#00FF66]  hover:from-[#00CC8A] hover:to-[#00E659] py-3 rounded-md font-semibold transition disabled:opacity-50"
            >
              Login
            </button>
            <p className="mt-4 text-center text-[#6b7a99]">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setView("signup");
                }}
                className="text-[#00CC8A] hover:underline"
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {view === "signup" && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-[#a1b0cc] hover:[#00E1A1]">
              Create a new account
            </h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-2 mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-2 mb-3 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#252d3d] border border-[#2a3040] rounded-md px-3 py-2 mb-6 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]"
            />
            <button className="w-full  bg-gradient-to-r from-[#00E1A1] to-[#00FF66]  hover:from-[#00CC8A] hover:to-[#00E659]  py-3 rounded-md font-semibold transition disabled:opacity-50">
              Sign Up
            </button>
            <p className="mt-4 text-center text-[#6b7a99]">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setView("login");
                }}
                className="text-[#00E1A1] hover:underline"
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
