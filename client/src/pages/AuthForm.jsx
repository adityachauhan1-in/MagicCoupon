import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
    import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { ClipLoader } from "react-spinners";
         import PasswordInput from "../components/PassWordInput";
import { login as apiLogin, signup as apiSignup } from "../services/api";
 
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "https://magiccoupon-backend.onrender.com").replace(/^["']|["']$/g, '');

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
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
 
  };



  const clearForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setPasswordStrength(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // validation          user needs to fill all details 
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email validation    email is converted or formatted 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation for signup
    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = isLogin ? await apiLogin(formData) : await apiSignup(formData);
      if (res?.success) {
        login(res.user, res.token);
               toast.success(isLogin ? "Login successful ✅" : "Signup successful ✅");
        navigate("/");
      } else {
        throw new Error(res?.message || "Authentication failed");
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
    <div className=" h-60 flex flex-col">
                 {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-3 tracking-tight">MagicCoupon</h1>
                <p className="text-xl md:text-2xl">Get amazing discounts instantly!</p>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md relative overflow-hidden">



          {/* Google OAuth Button */}
          <div className="mb-6">
            {/* import Oauth from context  */}
          <a href={`${API_BASE_URL}/auth/google`} className="block">      
              <button className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition duration-300 flex items-center justify-center gap-3 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google 
              </button>
            </a>
          </div>
          
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

          
                 <PasswordInput 
                 onChange={handleChange}
                 value={formData.password}
                 isLogin={isLogin}/>
          

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
                          clearForm();
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
