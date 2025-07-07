import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, setUserRole, setUserData } = useContext(AppContent);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isAdminEmail = (email) => {
    const adminEmailPattern = /^Admin\d{3}@next\.com$/;
    return adminEmailPattern.test(email);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!isLogin) {
      // Sign up validations
      if (!name.trim()) {
        newErrors.name = "Full Name is required";
        valid = false;
      } else if (!/^[A-Za-z\s]+$/.test(name)) {
        newErrors.name = "Full Name can only contain letters and spaces";
        valid = false;
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }
    }

    // These validations apply to both login and sign up
    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Set withCredentials to ensure cookies are sent/received
      axios.defaults.withCredentials = true;
      
      let endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      let requestData = isLogin ? { email, password } : { name, email, password };
      
      const { data } = await axios.post(backendUrl + endpoint, requestData);
      
      if (data.success) {
        if (isLogin) {
          // Extract user data and role
          const userData = data.userData || {};
          const userRole = userData.role || data.role;
          
          // Update local context first
          setIsLoggedin(true);
          setUserData(userData);
          if (userRole) {
            setUserRole(userRole);
          }
          
          toast.success("Login successful!");
          
          // Use React Router state to pass login info - this helps trigger re-renders
          const navigationState = {
            justLoggedIn: true,
            userData: userData,
            userRole: userRole
          };
          
          // Navigate based on role with state
          if (userRole === 'admin') {
            navigate("/admin-dashboard", { state: navigationState, replace: true });
          } else {
            navigate("/", { state: navigationState, replace: true });
          }
        } else {
          // Registration success
          toast.success("Registration successful! Please log in.");
          setIsLogin(true);
          setPassword("");
          setConfirmPassword("");
        }
      } else {
        toast.error(data.message || (isLogin ? "Login failed" : "Registration failed"));
      }
    } catch (error) {
      console.error("Error details:", error);
      
      // Enhanced error handling with specific messages
      if (!error.response) {
        toast.error("Network error - Cannot connect to server");
      } else if (error.response.status === 404) {
        toast.error("API endpoint not found");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(error.response?.data?.message || (isLogin ? "Login failed" : "Registration failed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <motion.img
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 p-8 sm:p-10 rounded-xl shadow-2xl w-full sm:w-96 text-indigo-300 text-sm"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-center text-sm mb-6">
          {isLogin ? "Login to your account" : "Sign up for a new account"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c] transition-all focus-within:ring-2 focus-within:ring-indigo-400">
                <img src={assets.person_icon} alt="" className="w-5 h-5 opacity-70" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="bg-transparent outline-none w-full text-white"
                  type="text"
                  placeholder="Full Name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs pl-5">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c] transition-all focus-within:ring-2 focus-within:ring-indigo-400">
              <img src={assets.mail_icon} alt="" className="w-5 h-5 opacity-70" />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="bg-transparent outline-none w-full text-white"
                type="email"
                placeholder="Email Address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs pl-5">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c] transition-all focus-within:ring-2 focus-within:ring-indigo-400">
              <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-70" />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="bg-transparent outline-none w-full text-white"
                type="password"
                placeholder="Password"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs pl-5">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5c] transition-all focus-within:ring-2 focus-within:ring-indigo-400">
                <img src={assets.lock_icon} alt="" className="w-5 h-5 opacity-70" />
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="bg-transparent outline-none w-full text-white"
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs pl-5">{errors.confirmPassword}</p>}
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-900 text-white font-medium transition-all hover:from-indigo-700 hover:to-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleForm}
              className="ml-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
