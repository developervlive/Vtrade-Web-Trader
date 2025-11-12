import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "./logo.png";

const Login = () => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Example validation logic (no backend)
    if (!username || !password) {
      toast.error("Please enter username and password");
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Example: hardcoded login validation
    if (username === "admin123@gmail.com" && password === "1234") {
      toast.success("Login successful!");
      navigate("/home");
    } else {
      toast.error("Invalid username or password");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      setIsLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Account created successfully!");
    setView("login");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0f1a] via-[#1a1b2e] to-[#252841] flex items-center justify-center p-4 font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#00E1A1]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#03ee80]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00E1A1]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Section - Only Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={logo}
                alt="V Trade Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00E1A1]/20 to-[#03ee80]/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-[#1a1b2e]/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 p-6 sm:p-8">
          {/* Toggle Switch */}
          <div className="flex bg-[#252841] rounded-xl p-1 mb-6 sm:mb-8">
            <button
              onClick={() => setView("login")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                view === "login"
                  ? "bg-gradient-to-r from-[#00E1A1] to-[#03ee80] text-black shadow-lg shadow-[#00E1A1]/20"
                  : "text-[#6b7a99] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setView("signup")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                view === "signup"
                  ? "bg-gradient-to-r from-[#00E1A1] to-[#03ee80] text-black shadow-lg shadow-[#00E1A1]/20"
                  : "text-[#6b7a99] hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {view === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#a1b0cc] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#252841] border border-[#2d3150] rounded-xl px-4 py-3.5 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E1A1]/5 to-[#03ee80]/5 pointer-events-none"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-[#a1b0cc]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs text-[#00E1A1] hover:text-[#03ee80] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#252841] border border-[#2d3150] rounded-xl px-4 py-3.5 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E1A1]/5 to-[#03ee80]/5 pointer-events-none"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00E1A1] to-[#03ee80] hover:from-[#00d191] hover:to-[#02db78] text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg shadow-[#00E1A1]/20"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {view === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#a1b0cc] mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#252841] border border-[#2d3150] rounded-xl px-4 py-3.5 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E1A1]/5 to-[#03ee80]/5 pointer-events-none"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1b0cc] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#252841] border border-[#2d3150] rounded-xl px-4 py-3.5 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E1A1]/5 to-[#03ee80]/5 pointer-events-none"></div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a1b0cc] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#252841] border border-[#2d3150] rounded-xl px-4 py-3.5 text-white placeholder-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-[#00E1A1]/50 focus:border-transparent transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00E1A1]/5 to-[#03ee80]/5 pointer-events-none"></div>
                </div>
                <p className="text-xs text-[#6b7a99] mt-2">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 bg-[#252841] border-[#2d3150] rounded focus:ring-[#00E1A1] focus:ring-2"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-[#a1b0cc]">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-[#00E1A1] hover:text-[#03ee80] transition-colors"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-[#00E1A1] hover:text-[#03ee80] transition-colors"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00E1A1] to-[#03ee80] hover:from-[#00d191] hover:to-[#02db78] text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed shadow-lg shadow-[#00E1A1]/20"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[#6b7a99]">
            © {new Date().getFullYear()} V Trade. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
