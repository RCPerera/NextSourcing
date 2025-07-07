import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets.js";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../context/AppContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiUser, FiLogOut, FiMail, FiMenu, FiX, FiChevronDown, FiHome, FiInfo, FiPhone, FiShoppingBag, FiGrid, FiShoppingCart, FiTarget, FiDollarSign } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, userRole, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
  
  // Get the cart context to access cart items
  const { cart } = useContext(CartContext);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localUserData, setLocalUserData] = useState(userData);
  
  // Calculate cart items count - accessing items array correctly
  const cartItemsCount = cart && cart.items ? cart.totalItems : 0;

  // Check for navigation state from login and update local state
  useEffect(() => {
    if (location.state?.justLoggedIn && location.state?.userData) {
      setLocalUserData(location.state.userData);
      // Clear the state to prevent issues on page refresh
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      setLocalUserData(userData);
    }
  }, [location, userData, navigate]);

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

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp')
      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setUserMenuOpen(false);
  }  
  
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl+'/api/auth/logout');
      
      // Always update local state regardless of response
      setIsLoggedin(false);
      setUserData(null);
      setLocalUserData(null);
      
      if (data && data.success) {
        toast.success("Logged out successfully");
      } else {
        toast.error(data.message || "Logout failed");
      }
      
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still update local state even if request fails
      setIsLoggedin(false);
      setUserData(null);
      setLocalUserData(null);
      toast.error("Logout failed but session cleared locally");
      
      navigate('/');
    }
    setUserMenuOpen(false);
  }
  
  const handleNavigation = (path) => {
    console.log('Attempting navigation to:', path);
    console.log('Current user role:', userRole);
    console.log('Is logged in:', userData !== null);
    
    try {
      navigate(path);
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to navigate to the requested page');
    }
  };

  const isActive = (path) => location.pathname === path;

  // Define all nav links
  const allNavLinks = [
    { name: "Home", path: "/", icon: <FiHome />, showFor: ["admin", "user"] },
    { name: "About Us", path: "/about-us", icon: <FiInfo />, showFor: ["user"] },
    { name: "Contact", path: "/contact-us", icon: <FiPhone />, showFor: ["user"] },
    { name: "Products", path: "/products", icon: <FiShoppingBag />, showFor: ["user"] },
    { name: "Dashboard", path: "/admin-dashboard", icon: <FiGrid />, showFor: ["admin"] },
    { name: "Defect Game", path: "/defect-game", icon: <FiTarget />, showFor: ["admin", "user"] }
  ];
  
  // Filter nav links based on user role
  const role = userRole || "user"; // Default to user if no role is specified
  const navLinks = allNavLinks.filter(link => link.showFor.includes(role));

  // Use localUserData instead of userData for rendering
  const userInfo = localUserData || userData;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-blue-600 shadow-md' : 'bg-blue-500 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`px-3 py-2 text-sm font-medium relative group transition-colors ${
                  isActive(link.path) ? 'text-white font-bold' : 'text-blue-100 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.icon}
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`}></span>
              </button>
            ))}
          </nav>

          {/* User Menu / Login */}
          <div className="flex items-center gap-4">
            {/* Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => handleNavigation("/cart")}
                className={`flex items-center justify-center p-2 rounded-full text-white hover:bg-blue-700 transition-colors ${
                  isActive("/cart") ? 'bg-blue-700' : ''
                }`}
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount > 99 ? '99+' : cartItemsCount}
                  </span>
                )}
              </button>
            </div>
            
            {userInfo ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
                    scrolled ? 'text-white hover:bg-blue-700' : 'text-white hover:bg-blue-600'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-medium">
                    {userInfo.name ? userInfo.name[0].toUpperCase() : <FiUser />}
                  </div>
                  <span className="hidden sm:block">{userInfo.name ? userInfo.name.split(' ')[0] : 'Account'}</span>
                  <FiChevronDown className={`transition-transform ${userMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-400 uppercase">Account</p>
                      <p className="text-sm font-medium text-gray-700">{userInfo.email || userInfo.name}</p>
                      {userRole && (
                        <p className="text-xs text-blue-600 mt-1">Role: {userRole}</p>
                      )}
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleNavigation("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiUser className="mr-2 text-blue-500" />
                        My Profile
                      </button>
                      
                      {/* Order History link */}
                      <button
                        onClick={() => {
                          handleNavigation("/orders");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiShoppingBag className="mr-2 text-blue-500" />
                        My Orders
                      </button>
                      
                      {userRole === 'admin' && (
                        <>
                          <button
                            onClick={() => {
                              console.log('Admin dashboard button clicked');
                              handleNavigation("/admin-dashboard");
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiGrid className="mr-2 text-blue-500" />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              console.log('Finance dashboard button clicked');
                              handleNavigation("/admin/finance");
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiDollarSign className="mr-2 text-blue-500" />
                            Finance Dashboard
                          </button>
                        </>
                      )}
                      {!userInfo.isAccountVerified && (
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
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium transition rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-md hover:from-blue-700 hover:to-blue-800"
              >
                Login 
                <img src={assets.arrow_icon} alt="" className="w-4 h-4" />
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md md:hidden text-white hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
        <div className="md:hidden bg-blue-600 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Cart link for mobile */}
            <button
              onClick={() => handleNavigation("/cart")}
              className={`${
                isActive("/cart")
                  ? 'text-blue-600 bg-white'
                  : 'text-white hover:text-white hover:bg-blue-700'
              } block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between`}
            >
              <div className="flex items-center">
                <FiShoppingCart className="mr-3" />
                Cart
              </div>
              {cartItemsCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </button>
            
            {/* Order history link for mobile */}
            {userInfo && (
              <button
                onClick={() => handleNavigation("/orders")}
                className={`${
                  isActive("/orders")
                    ? 'text-blue-600 bg-white'
                    : 'text-white hover:text-white hover:bg-blue-700'
                } block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center`}
              >
                <FiShoppingBag className="mr-3" />
                My Orders
              </button>
            )}
            
            {/* Regular nav links */}
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigation(link.path)}
                className={`${
                  isActive(link.path)
                    ? 'text-blue-600 bg-white'
                    : 'text-white hover:text-white hover:bg-blue-700'
                } block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </button>
            ))}
            
            {/* Admin specific mobile menu items */}
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => {
                    handleNavigation("/admin/finance");
                    setMobileMenuOpen(false);
                  }}
                  className={`${
                    isActive("/admin/finance")
                      ? 'text-blue-600 bg-white'
                      : 'text-white hover:text-white hover:bg-blue-700'
                  } block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center`}
                >
                  <FiDollarSign className="mr-3" />
                  Finance Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
