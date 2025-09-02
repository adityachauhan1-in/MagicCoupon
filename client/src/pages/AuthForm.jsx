import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";

const AuthForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "signup";
      const res = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        formData,
        { timeout: 10000, headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        login(res.data.user, res.data.token);
        toast.success(isLogin ? "Login successful ✅" : "Signup successful ✅");
        navigate("/");
      } else {
        throw new Error(res.data.message || "Authentication failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        (err.code === "ECONNABORTED" ? "Request timed out" : "Authentication failed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight">MagicCoupon</h1>
        <p className="text-xl md:text-2xl">Get amazing discounts instantly!</p>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-20 -right-16 w-60 h-60 bg-indigo-200 rounded-full opacity-30"></div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition placeholder-gray-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition placeholder-gray-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition placeholder-gray-400 pr-12"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600 transition"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-semibold text-center animate-pulse">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 flex justify-center items-center"
            >
              {isLoading ? <ClipLoader color="#ffffff" size={20} /> : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600 z-10 relative">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 font-semibold hover:underline transition"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
