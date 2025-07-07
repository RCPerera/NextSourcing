import axios from "axios";
import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState("unknown");
  const [forceUpdate, setForceUpdate] = useState(0); // Add this state to force re-renders when needed

  // Force a context update to propagate to all components
  const triggerUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  // Enhanced user data setter that triggers a UI update
  const updateUserData = useCallback((data) => {
    setUserData(data);
    triggerUpdate();
  }, [triggerUpdate]);

  // Enhanced login state setter that triggers a UI update
  const updateLoginState = useCallback((isLoggedIn) => {
    setIsLoggedin(isLoggedIn);
    triggerUpdate();
  }, [triggerUpdate]);

  // Check if backend is reachable with improved error handling
  const checkBackendStatus = async () => {
    try {
      const response = await axios.get(`${backendUrl}`, { 
        timeout: 5000,
        // Don't throw error on non-2xx status codes for this check
        validateStatus: status => true
      });
      
      if (response.status >= 200 && response.status < 500) {
        console.log("Backend is reachable, status:", response.status);
        setBackendStatus("online");
        return true;
      } else {
        console.error("Backend returned error status:", response.status);
        setBackendStatus("error");
        
        // Show more specific error for server issues
        if (response.status >= 500) {
          toast.error("Server error detected. The backend might be experiencing issues.");
        }
        return false;
      }
    } catch (error) {
      console.error("Backend connection error:", error.message);
      setBackendStatus("offline");
      
      // More specific error messages based on error type
      if (error.code === 'ECONNABORTED') {
        toast.error("Connection to server timed out. The server might be overloaded or down.", {
          autoClose: 5000,
          hideProgressBar: false,
        });
      } else if (!error.response) {
        toast.error("Cannot connect to the server. Please check if the server is running at " + backendUrl, {
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
      return false;
    }
  };

  const getAuthState = async () => {
    setIsLoading(true);
    try {
      // Check if backend is reachable first
      const isBackendReachable = await checkBackendStatus();
      if (!isBackendReachable) {
        console.log("Backend is not reachable, skipping auth check");
        setIsLoggedin(false);
        setUserData(null);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      // Try the is-auth endpoint with proper error handling
      try {
        console.log("Attempting to check auth status at:", `${backendUrl}/api/auth/is-auth`);
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { timeout: 8000 });
        
        if (data && data.success) {
          console.log("Auth successful");
          setIsLoggedin(true);
          setUserData(data.user);
          
          if (data.user && data.user.role) {
            setUserRole(data.user.role);
          }
          
          // Force update after successful auth
          triggerUpdate();
        } else {
          console.log("Auth unsuccessful:", data?.message || "Unknown error");
          setIsLoggedin(false);
          setUserData(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth check error:", error.response?.data?.message || error.message);
        
        // If is-auth fails with 404, try the profile endpoint as a fallback
        if (error.response?.status === 404) {
          console.log("is-auth endpoint not found, trying profile endpoint...");
          try {
            const { data } = await axios.get(`${backendUrl}/api/auth/profile`, { timeout: 8000 });
            
            if (data && data.success) {
              console.log("Profile auth successful");
              setIsLoggedin(true);
              setUserData(data.user);
              
              if (data.user && data.user.role) {
                setUserRole(data.user.role);
              }
              return;
            } else {
              console.log("Profile auth unsuccessful:", data?.message || "Unknown error");
              setIsLoggedin(false);
              setUserData(null);
              setUserRole(null);
            }
          } catch (innerError) {
            console.error("Profile endpoint failed:", innerError.message);
            setIsLoggedin(false);
            setUserData(null);
            setUserRole(null);
          }
        } else if (error.response?.status === 401) {
          // This is normal for non-logged in users, handle silently
          console.log("User is not authenticated (401)");
          setIsLoggedin(false);
          setUserData(null);
          setUserRole(null);
        } else {
          // Handle other errors
          console.error("Authentication error:", error.message);
          setIsLoggedin(false);
          setUserData(null);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error("Unexpected error in getAuthState:", error);
      setIsLoggedin(false);
      setUserData(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      // Check if backend is reachable first
      const isBackendReachable = await checkBackendStatus();
      if (!isBackendReachable) {
        toast.error("Cannot connect to server to retrieve user data");
        return;
      }

      // Try is-auth endpoint first, then fall back to profile
      let userData = null;
      let errorMessage = null;
      
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, { timeout: 8000 });
        if (data && data.success) {
          userData = data.user;
        } else {
          errorMessage = data?.message;
        }
      } catch (error) {
        // Try profile endpoint as fallback
        if (error.response?.status === 404) {
          try {
            const { data } = await axios.get(`${backendUrl}/api/auth/profile`, { timeout: 8000 });
            if (data && data.success) {
              userData = data.user;
            } else {
              errorMessage = data?.message;
            }
          } catch (innerError) {
            errorMessage = innerError.response?.data?.message || innerError.message;
          }
        } else {
          errorMessage = error.response?.data?.message || error.message;
        }
      }
      
      if (userData) {
        setUserData(userData);
        if (userData.role) {
          setUserRole(userData.role);
        }
      } else {
        toast.error(errorMessage || "Could not retrieve user data");
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      toast.error("Failed to fetch your profile information");
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      // Check if backend is reachable first
      const isBackendReachable = await checkBackendStatus();
      if (!isBackendReachable) {
        // If backend is unreachable, just clear local state
        setIsLoggedin(false);
        setUserData(null);
        setUserRole(null);
        toast.info("Logged out locally. Server connection unavailable.");
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { timeout: 8000 });
      
      // Always clear local state regardless of response
      setIsLoggedin(false);
      setUserData(null);
      setUserRole(null);
      
      if (data && data.success) {
        toast.success("Logged out successfully");
      } else {
        toast.info("Logged out. " + (data?.message || ""));
      }
    } catch (error) {
      // If logout request fails, still clear local state
      setIsLoggedin(false);
      setUserData(null);
      setUserRole(null);
      
      console.error("Logout error:", error);
      toast.info("Logged out. Server may not have received the request.");
    }
  };

  useEffect(() => {
    getAuthState();
    
    // Set up an interval to periodically check backend status if not in production
    if (process.env.NODE_ENV !== 'production') {
      const statusInterval = setInterval(() => {
        checkBackendStatus().catch(console.error);
      }, 60000); // Check every minute
      
      return () => clearInterval(statusInterval);
    }
  }, []);

  const value = {
    backendUrl,
    isLoggedin, 
    setIsLoggedin: updateLoginState,
    userData, 
    setUserData: updateUserData,
    userRole, setUserRole,
    getUserData,
    logout,
    isLoading,
    backendStatus,
    refreshAuth: getAuthState,
    checkConnection: checkBackendStatus,
    forceUpdate,
    triggerUpdate
  };
  
  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};