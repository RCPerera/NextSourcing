import React, { useContext } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

/**
 * Layout component that wraps the application content
 * Displays navigation and footer on most pages
 * Excludes navigation from certain pages like login and admin dashboard
 */
const Layout = ({ children }) => {
  const location = useLocation();
  const { userRole } = useContext(AppContent);
  
  // Pages that should not show the navbar
  const noNavbarPages = [
    '/reset-password',
    '/email-verify'
  ];
  
  // Check if current path is in the list of pages that don't need navbar
  const hideNavbar = noNavbarPages.includes(location.pathname) || 
                    (userRole === 'admin' && location.pathname.includes('/admin-dashboard'));
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - conditionally rendered based on route */}
      {!hideNavbar && <NavBar />}
      
      {/* Main content - add padding-top when navbar is present */}
      <main className={`flex-grow ${!hideNavbar ? 'pt-16 md:pt-20' : ''}`}>
        {children}
      </main>
      
      {/* Footer is always visible */}
      <Footer />
    </div>
  );
};

export default Layout;