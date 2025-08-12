



import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ClipLoader } from "react-spinners";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const res = await axios.post(
        `http://localhost:5000/auth/${endpoint}`,
        formData,
        {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate("/");
        toast.success(isLogin ? "Login successful" : "Signup successful");
      } else {
        throw new Error(res.data.message || "Authentication failed");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         (err.code === 'ECONNABORTED' ? "Request timed out" : "Authentication failed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to MagicCoupon</h1>
        <p className="text-xl">Your gateway to amazing discounts!</p>
      </div>

      {/* Auth Form Container */}
      <div className="flex-1 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Login to MagicCoupon" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {error && (
              <p className="text-sm text-red-600 font-semibold text-center">
                ⚠ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center"
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={20} />
              ) : isLogin ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
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