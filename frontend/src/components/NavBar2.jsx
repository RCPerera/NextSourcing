import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiUser, FiLogOut, FiMail, FiMenu, FiX, FiChevronDown, FiHome, FiInfo, FiPhone, FiShoppingBag } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const sendVerificationOtp = async (e) => {
    e.stopPropagation();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setUserMenuOpen(false);
  };

  const logout = async (e) => {
    e.stopPropagation();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        toast.success("Logged out successfully");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
    setUserMenuOpen(false);
  };

  const goToUserProfile = (e) => {
    e.stopPropagation();
    navigate('/Home');
    setUserMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/Home", icon: <FiHome /> },
    { name: "About Us", path: "/about", icon: <FiInfo /> },
    { name: "Contact", path: "/appointments", icon: <FiPhone /> },
    { name: "Products", path: "/products", icon: <FiShoppingBag /> }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src={assets.logo} 
                alt="Company Logo" 
                className="h-8 md:h-10 w-auto cursor-pointer" 
                onClick={() => handleNavigation("/")}
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`px-4 py-2 text-sm font-medium relative group transition-colors ${
                    isActive(link.path) ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-1/2 ${isActive(link.path) ? 'w-1/2' : ''}`}></span>
                </button>
              ))}
            </nav>

            {/* User Menu / Login */}
            <div className="flex items-center">
              {userData ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-800 hover:bg-white/70'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium">
                      {userData.name ? userData.name[0].toUpperCase() : <FiUser />}
                    </div>
                    <span className="hidden sm:block">{userData.name ? userData.name.split(' ')[0] : 'Account'}</span>
                    <FiChevronDown className={`transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-medium text-gray-400 uppercase">Account</p>
                        <p className="text-sm font-medium text-gray-700">{userData.email || userData.name}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={goToUserProfile}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FiUser className="mr-2 text-blue-500" />
                          My Profile
                        </button>
                        {!userData.isAccountVerified && (
                          <button
                            onClick={sendVerificationOtp}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiMail className="mr-2 text-blue-500" />
                            Verify Email
                          </button>
                        )}
                      </div>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={logout}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut className="mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation("/login")}
                  className="px-5 py-2 text-sm font-medium transition rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:from-blue-700 hover:to-blue-800"
                >
                  Sign In
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="ml-4 inline-flex items-center justify-center p-2 rounded-md md:hidden text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className={`${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  } block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from going under the navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default NavBar;