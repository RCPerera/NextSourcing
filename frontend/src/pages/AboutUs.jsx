import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiTrendingUp, FiThumbsUp } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';

const AboutUs = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  // Team members data
  const teamMembers = [
    {
      name: "David Chen",
      position: "CEO & Founder",
      image: assets.team1 || "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "David has over 25 years of experience in the garment industry, having worked with major brands worldwide before founding our company in 2003."
    },
    {
      name: "Sarah Williams",
      position: "Head of Production",
      image: assets.team2 || "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "With a background in textile engineering, Sarah oversees all production processes, ensuring quality standards are maintained across all products."
    },
    {
      name: "Rajiv Patel",
      position: "Design Director",
      image: assets.team3 || "https://randomuser.me/api/portraits/men/47.jpg",
      bio: "Rajiv brings creative vision and technical expertise to our design department, with previous experience at leading fashion houses in Europe and Asia."
    },
    {
      name: "Anna Kim",
      position: "Quality Control Manager",
      image: assets.team4 || "https://randomuser.me/api/portraits/women/28.jpg",
      bio: "Anna's attention to detail ensures that every garment leaving our factory meets the highest standards of craftsmanship and durability."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-28 pb-20 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              staggerChildren: 0.2
            }
          }
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <defs>
              <pattern id="about-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.6" fill="#1d4ed8"></circle>
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#about-pattern)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              variants={fadeIn}
            >
              About <span className="text-blue-600">Our Company</span>
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-blue-600 mx-auto mb-8"
              variants={fadeIn}
            ></motion.div>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              variants={fadeIn}
            >
              Founded in 2003, we're a leading garment manufacturing company committed to delivering premium quality products with exceptional service and sustainable practices.
            </motion.p>
          </div>
        </div>
      </motion.section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
              <div className="h-1 w-16 bg-blue-600 mb-8"></div>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  Our journey began in a small workshop with just 10 employees and a vision to create high-quality garments that combine craftsmanship with modern production techniques. As demand for our products grew, so did our facility and team.
                </p>
                <p>
                  Today, we operate a state-of-the-art manufacturing facility spanning over 50,000 square feet, equipped with the latest technology and staffed by over 200 skilled professionals. Our growth is a testament to our unwavering commitment to quality and customer satisfaction.
                </p>
                <p>
                  Throughout our evolution, we've maintained our founding principles: attention to detail, ethical manufacturing practices, and building long-term relationships with our clients. These values continue to guide us as we expand our global footprint.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img 
                  src={assets.about_story || "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"} 
                  alt="Our Factory" 
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
                
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Core Values
            </motion.h2>
            
            <motion.div 
              className="h-1 w-16 bg-blue-600 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              The principles that guide every aspect of our business and ensure we deliver consistent value to our clients.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FiAward className="text-blue-600" size={28} />,
                title: "Quality Excellence",
                description: "We maintain rigorous quality standards across all our products and processes."
              },
              {
                icon: <FiUsers className="text-blue-600" size={28} />,
                title: "Customer Focus",
                description: "We prioritize understanding and meeting our clients' unique requirements."
              },
              {
                icon: <FiThumbsUp className="text-blue-600" size={28} />,
                title: "Ethical Practices",
                description: "We uphold fair labor practices and environmentally responsible manufacturing."
              },
              {
                icon: <FiTrendingUp className="text-blue-600" size={28} />,
                title: "Continuous Improvement",
                description: "We constantly innovate and refine our techniques and processes."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-50 p-3 rounded-full inline-block mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Our Leadership Team
            </motion.h2>
            
            <motion.div 
              className="h-1 w-16 bg-blue-600 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Meet the experienced professionals who guide our company towards excellence and innovation.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover object-center" 
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Certifications Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Accreditations & Certifications
            </motion.h2>
            
            <motion.div 
              className="h-1 w-16 bg-white mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
            
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              We adhere to international standards of quality and ethical manufacturing.
            </motion.p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {["ISO 9001:2015", "GOTS Certified", "Fair Trade Certified", "WRAP Certified", "OEKO-TEX Standard 100"].map((cert, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm py-4 px-6 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-white font-medium">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to work with us?</h3>
                <p className="text-blue-100 md:max-w-md">
                  Contact our team to discuss your garment manufacturing needs and discover how we can help bring your vision to life.
                </p>
              </div>
              
              <button 
                onClick={() => window.location.href='/contact'}
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
              >
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </motion.section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;