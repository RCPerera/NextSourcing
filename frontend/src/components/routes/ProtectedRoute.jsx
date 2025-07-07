import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';

/**
 * A wrapper component for routes that require authentication.
 * If the user is not logged in, they will be redirected to the login page.
 */
const ProtectedRoute = ({ children }) => {
  // Get authentication state from context
  const { isLoggedin, isLoading } = useContext(AppContent);
  const location = useLocation();

  // Always call hooks at the top level, before any conditional returns
  useEffect(() => {
    // Only show toast when loading is complete and user is not logged in
    if (!isLoggedin && !isLoading) {
      // Use a small timeout to prevent potential toast flicker during redirects
      const toastTimer = setTimeout(() => {
        toast.error('Please log in to access this page');
      }, 100);
      
      return () => clearTimeout(toastTimer);
    }
  }, [isLoggedin, isLoading]);

  // Render loading, redirect or children - all hooks must be called before this point
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isLoggedin) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;