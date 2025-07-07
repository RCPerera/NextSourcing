import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiArrowRight } from "react-icons/fi";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
// import required modules
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css/navigation";
import { Link } from "react-router-dom";

// Updated news with more garment industry relevant content and added dates
const news = [
  {
    id: 1,
    title: "Sustainable Practices Transform Garment Manufacturing",
    description:
      "Leading garment factories embrace eco-friendly materials and processes, setting new industry standards for sustainability while maintaining high-quality production.",
    image: assets.News_4,
    date: "April 18, 2025",
    readTime: "4 min read",
    category: "Industry Trends"
  },
  {
    id: 2,
    title: "Innovation in Smart Fabrics Revolutionizes Clothing Industry",
    description:
      "New intelligent textiles with moisture-wicking, temperature-regulating properties are changing the future of garment manufacturing, increasing demand for high-tech production capabilities.",
    image: assets.News_4,
    date: "April 15, 2025",
    readTime: "5 min read",
    category: "Technology"
  },
  {
    id: 3,
    title: "Supply Chain Resilience: Lessons for Garment Manufacturers",
    description:
      "Industry experts share strategies for building more robust and adaptable supply chains following global disruptions, emphasizing local sourcing and digital tracking systems.",
    image: assets.News_4,
    date: "April 10, 2025",
    readTime: "6 min read",
    category: "Operations"
  },
  {
    id: 4,
    title: "Labor Practices in Garment Industry: Setting New Standards",
    description:
      "Progressive garment factories implement worker-centric policies that improve conditions, increase retention, and boost productivity while meeting international compliance standards.",
    image: assets.News_4,
    date: "April 5, 2025",
    readTime: "3 min read",
    category: "HR & Compliance"
  },
  {
    id: 5,
    title: "Digital Transformation: AI-Powered Quality Control Systems",
    description:
      "Advanced machine learning algorithms now detect fabric defects with 99.8% accuracy, dramatically reducing waste and improving overall garment quality across production lines.",
    image: assets.News_4,
    date: "April 1, 2025",
    readTime: "4 min read",
    category: "Technology"
  },
];

function News() {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-blue-600 font-medium text-sm uppercase tracking-wider mb-2 inline-block"
            >
              Latest Updates
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-800"
            >
              Industry News & Insights
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "60px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="h-1 bg-blue-600 mt-4 mb-2"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-600 md:max-w-md"
            >
              Stay informed with the latest developments and trends in the garment manufacturing industry.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Link to="/news" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">
              View all articles
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>

        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
              centeredSlides: false,
            },
            1024: {
              slidesPerView: 3,
              centeredSlides: false,
            },
          }}
          modules={[Pagination, Navigation, Autoplay, EffectCoverflow]}
          className="newsSwiper mt-8"
        >
          {news.map((item) => (
            <SwiperSlide key={item.id} className="pb-12">
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg h-full flex flex-col"
              >
                <div className="relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-56 object-cover" 
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <div className="flex items-center mr-4">
                      <FiCalendar className="mr-1" />
                      {item.date}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      {item.readTime}
                    </div>
                  </div>
                  
                  <Link to={`/news/${item.id}`} className="block mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {item.description}
                  </p>
                  
                  <Link 
                    to={`/news/${item.id}`} 
                    className="mt-auto inline-flex items-center text-blue-600 font-medium text-sm hover:text-blue-800 transition-colors"
                  >
                    Read more
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Custom styles for pagination bullets */}
      <style jsx="true">{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #e2e8f0;
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #3b82f6;
          transform: scale(1.2);
        }
        .swiper-button-prev,
        .swiper-button-next {
          color: #3b82f6;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-button-prev:after,
        .swiper-button-next:after {
          font-size: 18px;
        }
        .newsSwiper {
          padding: 20px 10px 40px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default News;