import React from 'react';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import Banner from '../components/Banner';
import News from '../components/News';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FiCheck, FiTrendingUp, FiUsers, FiPackage } from 'react-icons/fi';
import { assets } from '../assets/assets';

function Landing() {
  // For the fade-in animation
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  // Features section content
  const features = [
    {
      icon: <FiPackage className="text-blue-600" size={24} />,
      title: "Premium Quality Products",
      description: "Our garments undergo rigorous quality checks to ensure they meet the highest industry standards."
    },
    {
      icon: <FiUsers className="text-blue-600" size={24} />,
      title: "Expert Team",
      description: "Our experienced team combines craftsmanship with modern manufacturing technologies."
    },
    {
      icon: <FiTrendingUp className="text-blue-600" size={24} />,
      title: "Fast Production",
      description: "Efficient production processes ensure quick turnaround times without compromising quality."
    }
  ];
  
  // Testimonials content
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "CEO, Fashion Forward",
      image: assets.testimonial1 || "https://randomuser.me/api/portraits/women/1.jpg",
      quote: "Working with this garment factory transformed our business. Their attention to detail and commitment to quality is unmatched in the industry."
    },
    {
      name: "Michael Chen",
      position: "Procurement Director, Style Co.",
      image: assets.testimonial2 || "https://randomuser.me/api/portraits/men/2.jpg",
      quote: "The consistency and reliability of their production has made them our exclusive manufacturing partner for three consecutive years."
    },
    {
      name: "Emily Rodriguez",
      position: "Founder, Eco Apparel",
      image: assets.testimonial3 || "https://randomuser.me/api/portraits/women/3.jpg",
      quote: "Their commitment to sustainable practices and ethical manufacturing aligns perfectly with our brand values. Highly recommended!"
    }
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      
      {/* Hero Section */}
      <Header />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">Exceptional Garment Manufacturing</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-4"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 } 
                  }
                }}
              >
                <div className="bg-blue-100 p-3 rounded-full inline-block mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Banner Section */}
      <Banner />
      
      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Our Process</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">How We Operate</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-4"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {['Consultation', 'Design', 'Production', 'Delivery'].map((step, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 } 
                  }
                }}
              >
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{step}</h3>
                <div className={`h-1 w-12 mx-auto ${index % 2 === 0 ? 'bg-blue-600' : 'bg-yellow-400'}`}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-800">What Our Clients Say</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto mt-4"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-all duration-300 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.2 } 
                  }
                }}
              >
                <div className="text-6xl text-blue-100 absolute top-4 right-4">"</div>
                <p className="text-gray-600 mb-6 relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4" 
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "20+", label: "Years Experience" },
              { number: "500+", label: "Happy Clients" },
              { number: "10,000+", label: "Products Delivered" },
              { number: "50+", label: "Countries Served" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.6, delay: index * 0.1 } 
                  }
                }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <News />
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-2/3 mb-8 md:mb-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Next Project?</h2>
              <p className="text-blue-100 text-lg">Contact us today to discuss how we can help bring your garment ideas to life.</p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <button 
                onClick={() => window.location.href='/contact'}
                className="bg-white text-blue-600 font-medium px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Contact Us Now
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Landing;