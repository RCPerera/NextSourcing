import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';

/**
 * A wrapper component for routes that should only be accessible to non-authenticated users.
 * If the user is logged in, they will be redirected to the home page or their intended destination.
 */
const PublicRoute = ({ children }) => {
  const { isLoggedin, userRole, isLoading } = useContext(AppContent);
  const location = useLocation();

  // Get the redirect path from location state or default to appropriate home
  const from = location.state?.from || '/Home';
  
  // If authentication is still being determined, show loading
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If logged in, redirect to appropriate page based on role
  if (isLoggedin) {
    // For admin users, redirect to admin dashboard
    if (userRole === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    
    // For regular users, redirect to home or the location they were trying to access
    return <Navigate to={from} replace />;
  }

  // If not logged in, show the public component (e.g., login page)
  return children;
};

export default PublicRoute;