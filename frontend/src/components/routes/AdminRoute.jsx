import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';

/**
 * A wrapper component for routes that require admin privileges.
 * If the user is not logged in or not an admin, they will be redirected.
 */
const AdminRoute = ({ children }) => {
  const { isLoggedin, userRole, isLoading } = useContext(AppContent);
  const location = useLocation();

  // If authentication is still being determined, show loading indicator
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!isLoggedin) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If logged in but not admin, redirect to home with unauthorized message
  if (userRole !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/Home" replace />;
  }

  // If admin, render the protected admin component
  return children;
};

export default AdminRoute;