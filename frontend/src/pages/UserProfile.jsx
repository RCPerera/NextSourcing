import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiKey, FiTrash2, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { AppContent } from '../context/AppContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axios from 'axios';

const UserProfile = () => {
  const { userData, setUserData, backendUrl, setIsLoggedin } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  
  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Delete account states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/user/profile`);
        if (data.success) {
          setProfileData(data.user);
          setEditedData(data.user);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userData) {
      fetchUserProfile();
    }
  }, [userData, backendUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/user/profile`, editedData);
      
      if (data.success) {
        setProfileData(data.user);
        setUserData(prev => ({...prev, name: data.user.name}));
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/user/update-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (data.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
        toast.success("Password updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to change password");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backendUrl}/api/user/profile`);
      
      if (data.success) {
        toast.success("Account deleted successfully");
        setIsLoggedin(false);
        setUserData(null);
        // Redirect to home page
        window.location.href = '/';
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete account");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 md:px-10">
              <div className="flex flex-col md:flex-row items-center text-white">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                  {profileData?.name ? profileData.name[0].toUpperCase() : <FiUser />}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-bold">{profileData?.name}</h1>
                  <p className="text-blue-100 mt-1">{profileData?.email}</p>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="p-6 md:p-10">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FiEdit className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FiSave className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedData.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-800">
                        <FiUser className="text-blue-600 mr-3" />
                        <span>{profileData?.name}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center text-gray-800">
                      <FiMail className="text-blue-600 mr-3" />
                      <span>{profileData?.email}</span>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editedData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-800">
                        <FiPhone className="text-blue-600 mr-3" />
                        <span>{profileData?.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={editedData.address || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="flex items-center text-gray-800">
                        <FiMapPin className="text-blue-600 mr-3" />
                        <span>{profileData?.address || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Account Management */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Management</h2>
                
                <div className="space-y-4">
                  {/* Password Change Section */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FiKey className="text-blue-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-800">Change Password</h3>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                    
                    {showPasswordForm && (
                      <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            required
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Update Password
                        </button>
                      </form>
                    )}
                  </div>
                  
                  {/* Delete Account Section */}
                  <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FiTrash2 className="text-red-600 mr-3" />
                        <h3 className="text-lg font-medium text-gray-800">Delete Account</h3>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        {showDeleteConfirm ? 'Cancel' : 'Delete Account'}
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    
                    {showDeleteConfirm && (
                      <div className="mt-4 p-4 border border-red-300 rounded-lg bg-white">
                        <div className="flex items-start mb-4">
                          <FiAlertCircle className="text-red-600 mr-3 mt-0.5" />
                          <div>
                            <p className="text-red-600 font-medium">Warning: This action cannot be undone</p>
                            <p className="text-gray-600 text-sm mt-1">
                              Once you delete your account, all your data will be permanently removed from our system.
                            </p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Enter your password to confirm
                          </label>
                          <input
                            id="deletePassword"
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                          />
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading || !deletePassword}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Permanently Delete My Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfile;
