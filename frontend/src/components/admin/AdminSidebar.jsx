import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiBarChart2, 
  FiSettings, 
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiPackage,
  FiTruck,
  FiUser,
  FiGrid,
  FiPieChart,
  FiActivity,
  FiFileText,
  FiCreditCard,
  FiBox,
  FiAlertCircle,
  FiBell,
  FiCalendar
} from 'react-icons/fi';
import { AppContent } from '../../context/AppContext';
import logo from '../../assets/logo.png';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, userRole, setIsLoggedin, setUserData, setUserRole, backendUrl } = useContext(AppContent);
  
  // State for collapsible sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // State for mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Current active section based on path
  const getActiveSection = () => {
    if (location.pathname.includes('/admin-dashboard')) return 'overview';
    if (location.pathname.includes('/admin/orders')) return 'orders';
    if (location.pathname.includes('/admin/inventory')) return 'inventory';
    if (location.pathname.includes('/admin/employees')) return 'employees';
    return 'overview';
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection());
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        setUserRole(null);
        navigate('/login');
      } else {
        console.error('Error logging out:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Define sidebar menu items with role access
  const sidebarItems = [
    { id: 'overview', name: 'Dashboard', icon: <FiHome />, roles: ['admin', 'manager'], path: '/admin-dashboard' },
    { id: 'employees', name: 'Employee Management', icon: <FiUsers />, roles: ['admin'], path: '/admin-dashboard' },
    { id: 'orders', name: 'View Orders', icon: <FiPackage />, roles: ['admin', 'manager', 'sales'], path: '/admin/orders' },
    { id: 'production', name: 'HR Managemnt', icon: <FiPackage />, roles: ['admin', 'manager'], path: '/admin/employee-salary' },
    { id: 'inventory', name: 'Inventory Management', icon: <FiBox />, roles: ['admin', 'manager', 'inventory'], path: '/admin/inventory' },
    { id: 'defects', name: 'Defect Game Control', icon: <FiAlertCircle />, roles: ['admin', 'quality'], path: '/defect-game' },
    { id: 'finance', name: 'Finance Management', icon: <FiDollarSign />, roles: ['admin', 'finance'] },
    { id: 'announcements', name: 'Announcements', icon: <FiBell />, roles: ['admin', 'manager'], path: '/admin/announcements' },
    { id: 'settings', name: 'Settings', icon: <FiSettings />, roles: ['admin'], path: '/admin/settings' }
  ];

  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(userRole || 'admin')
  );

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="fixed bottom-6 right-6 z-50 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform z-30 bg-white shadow-lg pt-16 transition-transform duration-300 ease-in-out 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className={`flex items-center justify-between px-4 py-5 border-b border-gray-100
            ${sidebarCollapsed ? 'justify-center' : ''}`}>
            {!sidebarCollapsed && (
                <div>
                    <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
                </div>
            )}
            <button 
                onClick={toggleSidebar}
                className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 hidden md:block transition-colors"
            >
                {sidebarCollapsed ? <FiChevronRight /> : <FiChevronDown />}
            </button>
        </div>
        <div className="py-4">
          <nav className="px-4 space-y-1">
            {filteredSidebarItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveSection(item.id);
                  if (mobileMenuOpen) setMobileMenuOpen(false);
                }}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} 
                  w-full py-3 px-4 rounded-lg transition-colors text-base
                  ${location.pathname === item.path || (location.pathname.includes(item.id) && item.id !== 'overview')
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {!sidebarCollapsed && (
                  <span className="ml-4 truncate">{item.name}</span>
                )}
              </Link>
            ))}
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} 
                w-full py-3 px-4 rounded-lg transition-colors text-base mt-8
                text-red-600 hover:bg-red-50
              `}
            >
              <span className="text-xl"><FiLogOut /></span>
              {!sidebarCollapsed && (
                <span className="ml-4 truncate">Logout</span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;