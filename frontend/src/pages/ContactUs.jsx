import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiMessageCircle, FiClock, FiSend } from 'react-icons/fi';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { assets } from '../assets/assets';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, submitted: false, error: null });
    
    // Simulate form submission
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus({ submitting: false, submitted: true, error: null });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setFormStatus({ 
        submitting: false, 
        submitted: false, 
        error: "Something went wrong. Please try again later."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      {/* Hero Section */}
      <motion.section 
        className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden"
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
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 800 800">
            <defs>
              <pattern id="contact-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.6" fill="#1d4ed8"></circle>
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#contact-pattern)"></rect>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              variants={fadeIn}
            >
              Get In <span className="text-blue-600">Touch</span> With Us
            </motion.h1>
            
            <motion.div 
              className="h-1 w-24 bg-blue-600 mx-auto mb-8"
              variants={fadeIn}
            ></motion.div>
            
            <motion.p 
              className="text-lg text-gray-600 mb-8"
              variants={fadeIn}
            >
              We're here to answer any questions about our garment manufacturing services. Reach out to us and we'll respond as soon as possible.
            </motion.p>
          </div>
        </div>
      </motion.section>
      
      {/* Contact Information Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiMapPin className="text-blue-600" size={24} />,
                title: "Visit Us",
                info: [
                  "123 Garment Street",
                  "Colombo 10",
                  "Sri Lanka"
                ]
              },
              {
                icon: <FiPhone className="text-blue-600" size={24} />,
                title: "Call Us",
                info: [
                  "+94 123 456 789",
                  "+94 987 654 321"
                ]
              },
              {
                icon: <FiMail className="text-blue-600" size={24} />,
                title: "Email Us",
                info: [
                  "info@garmentfactory.com",
                  "sales@garmentfactory.com"
                ]
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-8 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto bg-blue-100 p-4 rounded-full inline-block mb-6">
                  {contact.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{contact.title}</h3>
                <div className="space-y-2">
                  {contact.info.map((line, i) => (
                    <p key={i} className="text-gray-600">{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Business Hours */}
      <motion.section
        className="py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:w-1/3 bg-blue-600 text-white p-8 flex items-center justify-center">
                <div className="text-center">
                  <FiClock size={40} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Business Hours</h3>
                  <p className="text-blue-100">When you can reach us</p>
                </div>
              </div>
              
              <div className="md:w-2/3 p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Weekdays:</h4>
                    <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Saturday:</h4>
                    <p className="text-gray-600">9:00 AM - 1:00 PM</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Sunday:</h4>
                    <p className="text-gray-600">Closed</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Holidays:</h4>
                    <p className="text-gray-600">Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Contact Form and Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Send Us A Message</h2>
              <div className="h-1 w-16 bg-blue-600 mb-8"></div>
              
              {formStatus.submitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p>Your message has been successfully sent. We will contact you very soon!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="johndoe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+94 123 456 789"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Please write your message here..."
                    ></textarea>
                  </div>
                  
                  {formStatus.error && (
                    <div className="text-red-500">
                      {formStatus.error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    className={`py-3 px-8 rounded-lg text-white font-medium flex items-center justify-center ${
                      formStatus.submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                  >
                    {formStatus.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
            
            {/* Map */}
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Location</h2>
              <div className="h-1 w-16 bg-blue-600 mb-8"></div>
              
              <div className="rounded-lg overflow-hidden shadow-lg h-96">
                {/* Replace with your actual Google Maps embed code */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81635598104!2d79.82118695!3d6.9218373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1659569296500!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            
            <motion.div 
              className="h-1 w-16 bg-blue-600 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            ></motion.div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "What is the minimum order quantity?",
                answer: "Our standard minimum order quantity is 500 pieces per style. However, we may be able to accommodate smaller orders for premium garments. Please contact our sales team for specific requirements."
              },
              {
                question: "How long does production typically take?",
                answer: "Production time varies depending on order size and complexity. On average, production takes 4-6 weeks after design approval. For larger orders, it may take 8-10 weeks."
              },
              {
                question: "Do you provide sampling services?",
                answer: "Yes, we offer sampling services to ensure the final product meets your requirements. The cost for samples varies based on complexity, and this fee is typically credited against your first order."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept wire transfers, PayPal for sample payments, and letters of credit for larger orders. Standard terms are 30% deposit upon order confirmation with the balance due before shipment."
              },
              {
                question: "Do you offer shipping services?",
                answer: "Yes, we offer comprehensive shipping services including customs clearance assistance. We can arrange for sea freight, air freight, or express shipping depending on your timeline and budget."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6 bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6">
                    <span className="text-gray-800 font-semibold">{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" strokeWidth="1.5" viewBox="0 0 24 24" width="24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <motion.section
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <FiMessageCircle className="text-white/80 mx-auto mb-6" size={40} />
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Can't find what you're looking for?</h3>
              <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                Our team is ready to answer any questions you may have about our garment manufacturing services.
              </p>
              <button 
                onClick={() => document.getElementById('name').focus()}
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

export default ContactUs;