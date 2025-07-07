import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPlay } from 'react-icons/fi';

const Header = () => {
  const {userData} = useContext(AppContent);
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login'); // Navigate to the sign-up page
  };

  const handleWatchDemoClick = () => {
    // You could implement a video modal here or navigate to a demo page
    console.log("Watch demo clicked");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="relative pt-20 pb-32 px-4 md:px-0 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 800 800">
          <defs>
            <pattern id="header-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.6" fill="#1d4ed8"></circle>
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#header-pattern)"></rect>
        </svg>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left space-y-6"
            variants={containerVariants}
          >
            {userData && (
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-2"
              >
                <span className="text-sm font-medium">Welcome back, {userData.name}!</span>
                <img className="w-5 h-5 animate-wave" src={assets.hand_wave} alt="Wave"/>
              </motion.div>
            )}

            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Premium <span className="text-blue-600">Garments</span> For Your Business
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0"
            >
              Discover our exceptional quality garment manufacturing services tailored to meet your business needs with precision and care.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStartedClick}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300"
              >
                Get Started
                <FiArrowRight />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchDemoClick}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <div className="bg-blue-600 text-white p-1 rounded-full">
                  <FiPlay size={10} />
                </div>
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">Quality Assured</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="w-full lg:w-1/2"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div 
                className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-md z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">Quality Certified</span>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-3 rounded-lg shadow-md z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
              >
                <div className="text-sm font-bold">Custom Orders</div>
                <div className="text-xs">Fast Turnaround</div>
              </motion.div>

              <motion.div 
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-0 rounded-lg overflow-hidden shadow-2xl border-8 border-white"
              >
                <img 
                  src={assets.header_img} 
                  alt="Garment Factory Showcase"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-12 md:h-24" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>

      {/* Custom animation styles */}
      <style jsx="true">{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 1.5s infinite;
          transform-origin: bottom right;
        }
      `}</style>
    </motion.div>
  );
};

export default Header;