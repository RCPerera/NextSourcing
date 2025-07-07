import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion"; // Assuming framer-motion is installed
import { FiArrowRight, FiTrendingUp } from "react-icons/fi";

const Banner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Background pattern element */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="h-full w-full" viewBox="0 0 800 800">
          <defs>
            <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
              <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#1d4ed8"></circle>
            </pattern>
          </defs>
          <rect width="800" height="800" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Content section */}
          <motion.div 
            className="md:w-1/2 w-full"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
              <FiTrendingUp className="mr-2" />
              <span className="text-sm font-medium">New Seasonal Collection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 leading-tight">
              Premium Quality <span className="text-blue-600">Garments</span> For Your Business
            </h1>
            
            <p className="mb-8 text-lg text-gray-600 leading-relaxed max-w-2xl">
              Explore our new collection of high-quality fabrics and garments designed to meet the highest industry standards. Manufactured with precision and care for your unique business needs.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Collection
                <FiArrowRight className="ml-2" />
              </button>
              
              <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-all duration-300 flex items-center">
                Request Samples
              </button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">20+</div>
                <div className="text-sm text-gray-500">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">150+</div>
                <div className="text-sm text-gray-500">Product Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-500">Customer Satisfaction</div>
              </div>
            </div>
          </motion.div>
          
          {/* Image section */}
          <motion.div 
            className="md:w-1/2 w-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main image with shadow and border */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white transform rotate-1 hover:rotate-0 transition-all duration-300">
                <img 
                  src={assets.banner_img} 
                  alt="Garment Factory Premium Collection"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Floating accent elements */}
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-4 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-300">
                <div className="font-bold">New Arrivals</div>
                <div className="text-sm">Summer 2025</div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-800 p-3 rounded-full shadow-lg transform rotate-12 hover:rotate-0 transition-all duration-300">
                <div className="font-bold text-xl">25%</div>
                <div className="text-xs">DISCOUNT</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Wave divider at bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg className="relative block w-full h-12 md:h-24" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default Banner;