import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FiHome, FiUsers, FiPackage, FiAlertCircle, FiDollarSign, 
  FiBell, FiSettings, FiTrendingUp, FiCalendar, FiClock, 
  FiMenu, FiX, FiChevronRight, FiChevronDown, FiSearch 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import EmployeeManagement from '../components/admin/EmployeeManagement';
import { AppContent } from '../context/AppContext';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userData, userRole, setIsLoggedin, setUserData, setUserRole, backendUrl } = useContext(AppContent);

    // Redirect if not admin
    React.useEffect(() => {
        if (userRole !== 'admin') {
            toast.error("Unauthorized access. Redirecting to home page.");
            navigate('/Home');
        }
    }, [userRole, navigate]);

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
                toast.success('Logged out successfully');
                navigate('/login');
            } else {
                toast.error(data.message || 'Error logging out');
            }
        } catch (error) {
            toast.error('Error logging out');
            console.error('Logout error:', error);
        }
    };

    // Analytics data for the overview dashboard
    const analytics = {
        todayDate: new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        cards: [
            { 
                title: 'Total Employees', 
                value: '150', 
                change: '+12%', 
                icon: <FiUsers className="h-6 w-6" />,
                color: 'blue',
                bgColor: 'bg-blue-100'
            },
            { 
                title: 'Production', 
                value: '1,250', 
                suffix: 'units', 
                change: '+5%', 
                icon: <FiPackage className="h-6 w-6" />,
                color: 'green',
                bgColor: 'bg-green-100'
            },
            { 
                title: 'Active Orders', 
                value: '45', 
                change: '+24%', 
                icon: <FiTrendingUp className="h-6 w-6" />,
                color: 'purple',
                bgColor: 'bg-purple-100'
            },
            { 
                title: 'Defect Rate', 
                value: '0.8', 
                suffix: '%', 
                change: '-0.2%', 
                icon: <FiAlertCircle className="h-6 w-6" />,
                color: 'red',
                bgColor: 'bg-red-100',
                positive: true
            },
            { 
                title: 'Inventory Status', 
                value: '85', 
                suffix: '%', 
                change: '-2%', 
                icon: <FiPackage className="h-6 w-6" />,
                color: 'yellow',
                bgColor: 'bg-yellow-100'
            },
            { 
                title: 'Monthly Revenue', 
                value: '$156,200', 
                change: '+18%', 
                icon: <FiDollarSign className="h-6 w-6" />,
                color: 'indigo',
                bgColor: 'bg-indigo-100'
            }
        ],
        recentActivities: [
            { id: 1, activity: 'New employee onboarded', time: '2 hours ago', user: 'Sarah Johnson', type: 'employee' },
            { id: 2, activity: 'Order #45678 completed', time: '3 hours ago', user: 'Production Team', type: 'order' },
            { id: 3, activity: 'Quality check completed', time: '5 hours ago', user: 'Quality Team', type: 'quality' },
            { id: 4, activity: 'New order received', time: '8 hours ago', user: 'Sales Team', type: 'order' },
            { id: 5, activity: 'Inventory updated', time: '10 hours ago', user: 'Inventory Team', type: 'inventory' }
        ]
    };

    const renderOverviewSection = () => {
        return (
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userData?.name || 'Admin'}</h1>
                            <p className="text-gray-600 mt-1">{analytics.todayDate}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                />
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                            <button 
                                onClick={() => {/* add report generation function */}}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                Generate Report <FiChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analytics.cards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 font-medium">{card.title}</p>
                                    <div className="flex items-end mt-2">
                                        <h3 className={`text-2xl font-bold text-${card.color}-600`}>{card.value}</h3>
                                        {card.suffix && <span className="text-gray-500 ml-1 mb-0.5">{card.suffix}</span>}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-full ${card.bgColor}`}>
                                    <div className={`text-${card.color}-600`}>
                                        {card.icon}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 flex items-center">
                                <span className={`text-sm ${card.positive ? 'text-green-600' : card.change.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                                    {card.change}
                                </span>
                                <span className="text-gray-500 text-sm ml-1">from last month</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        {analytics.recentActivities.map((activity) => (
                            <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                            ${activity.type === 'employee' ? 'bg-blue-100 text-blue-600' : 
                                            activity.type === 'order' ? 'bg-green-100 text-green-600' : 
                                            activity.type === 'quality' ? 'bg-red-100 text-red-600' : 
                                            'bg-yellow-100 text-yellow-600'}`}>
                                            {activity.type === 'employee' ? <FiUsers /> : 
                                            activity.type === 'order' ? <FiPackage /> : 
                                            activity.type === 'quality' ? <FiAlertCircle /> : 
                                            <FiPackage />}
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-800">{activity.activity}</p>
                                            <p className="text-sm text-gray-500">{activity.user}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-400 flex items-center">
                                            <FiClock className="mr-1" size={14} />
                                            {activity.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderOrderSection = () => {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
                    <button 
                        onClick={() => navigate('/admin/orders')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        Create New Order <FiChevronRight size={16} />
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">All Orders</h3>
                                <p className="text-sm text-gray-600 mt-1">Manage all customer orders</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FiPackage className="text-blue-600 h-6 w-6" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="mt-4 w-full bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            View All Orders
                        </button>
                    </div>
                    
                    <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Order Reports</h3>
                                <p className="text-sm text-gray-600 mt-1">Generate detailed reports</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FiTrendingUp className="text-green-600 h-6 w-6" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/order-reports')}
                            className="mt-4 w-full bg-white text-green-600 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            View Reports
                        </button>
                    </div>
                    
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-800">Income Analysis</h3>
                                <p className="text-sm text-gray-600 mt-1">Revenue & profitability</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FiDollarSign className="text-purple-600 h-6 w-6" />
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/order-income')}
                            className="mt-4 w-full bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            View Income
                        </button>
                    </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="text-lg font-medium p-4 bg-gray-50 border-b border-gray-100">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Sample order data - in a real app, this would come from API */}
                                { [
                                    { id: 'ORD-1234', customer: 'John Smith', date: '2025-04-25', status: 'Processing', total: 245.50 },
                                    { id: 'ORD-1233', customer: 'Lisa Wong', date: '2025-04-24', status: 'Shipped', total: 130.20 },
                                    { id: 'ORD-1232', customer: 'Mark Taylor', date: '2025-04-23', status: 'Delivered', total: 89.99 },
                                    { id: 'ORD-1231', customer: 'Sarah Johnson', date: '2025-04-22', status: 'Cancelled', total: 204.75 },
                                    { id: 'ORD-1230', customer: 'David Brown', date: '2025-04-21', status: 'Delivered', total: 175.30 }
                                ].map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {order.customer}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                                ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 text-right">
                        <button 
                            onClick={() => navigate('/admin/orders')}
                            className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1 ml-auto"
                        >
                            View All Orders <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Order Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Order Status Overview */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h3 className="text-lg font-medium mb-4">Order Status Overview</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Processing</span>
                                    <span className="font-medium text-gray-900">24 orders (15%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Shipped</span>
                                    <span className="font-medium text-gray-900">37 orders (23%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Delivered</span>
                                    <span className="font-medium text-gray-900">85 orders (53%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '53%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Cancelled</span>
                                    <span className="font-medium text-gray-900">14 orders (9%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '9%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Period Performance */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h3 className="text-lg font-medium mb-4">Order Performance</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">This Week</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
                                <p className="text-sm text-green-600 mt-1">+12% from last week</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">This Month</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">162</p>
                                <p className="text-sm text-green-600 mt-1">+8% from last month</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">Avg. Order Value</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">$145.32</p>
                                <p className="text-sm text-green-600 mt-1">+5% from last month</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">$23,542</p>
                                <p className="text-sm text-green-600 mt-1">+15% from last month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'overview':
                return renderOverviewSection();
            case 'employees':
                return <EmployeeManagement />;
            case 'orders':
                return renderOrderSection();
            case 'production':
                return (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Production Management Section</p>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
                            <button 
                                onClick={() => navigate('/products/create')}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                Add New Product <FiChevronRight size={16} />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Products</h3>
                                        <p className="text-sm text-gray-600 mt-1">Manage all products</p>
                                    </div>
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <FiPackage className="text-blue-600 h-6 w-6" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="mt-4 w-full bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    View Products
                                </button>
                            </div>
                            
                            <div className="bg-green-50 p-5 rounded-lg border border-green-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">In Stock</h3>
                                        <p className="text-sm text-gray-600 mt-1">Check available stock</p>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <FiPackage className="text-green-600 h-6 w-6" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="mt-4 w-full bg-white text-green-600 border border-green-200 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    View Inventory
                                </button>
                            </div>
                            
                            <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Low Stock</h3>
                                        <p className="text-sm text-gray-600 mt-1">Items needing reorder</p>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <FiAlertCircle className="text-purple-600 h-6 w-6" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/inventory')}
                                    className="mt-4 w-full bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                >
                                    Check Low Stock
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <h3 className="text-lg font-medium p-4 bg-gray-50 border-b border-gray-100">Recent Inventory Updates</h3>
                            <div className="p-4">
                                <p className="text-gray-600">Click on any of the inventory management options above to view and manage products.</p>
                                <button 
                                    onClick={() => navigate('/products')}
                                    className="mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1"
                                >
                                    Go to Product List <FiChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'defects':
                return (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Defect Game Monitoring Section</p>
                    </div>
                );
            case 'finance':
                return (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Finance Reports Section</p>
                    </div>
                );
            case 'announcements':
                return (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Announcements Section</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Account Settings Section</p>
                    </div>
                );
            default:
                return null;
        }
    };

    // Define sidebar menu items with role access
    const sidebarItems = [
        { id: 'overview', name: 'Dashboard', icon: <FiHome />, roles: ['admin', 'manager'] },
        { id: 'employees', name: 'Employee Management', icon: <FiUsers />, roles: ['admin'] },
        { id: 'orders', name: 'View Orders', icon: <FiPackage />, roles: ['admin', 'manager', 'sales'], path: '/admin/orders' },
        { id: 'production', name: 'HR Managemnt', icon: <FiPackage />, roles: ['admin', 'manager'] , path: '/admin/employee-salary'},
        { id: 'inventory', name: 'Inventory Management', icon: <FiPackage />, roles: ['admin', 'manager', 'inventory'], path: '/admin/inventory' },
        { id: 'defects', name: 'Defect Game Control', icon: <FiAlertCircle />, roles: ['admin', 'quality'], path: '/defect-game' },
        { id: 'finance', name: 'Finance Management', icon: <FiDollarSign />, roles: ['admin', 'finance'], path: '/admin/finance' },
        { id: 'announcements', name: 'Announcements', icon: <FiBell />, roles: ['admin', 'manager'] },
        { id: 'settings', name: 'Settings', icon: <FiSettings />, roles: ['admin'] }
    ];

    // Filter sidebar items based on user role
    const filteredSidebarItems = sidebarItems.filter(item => 
        item.roles.includes(userRole || 'admin')
    );

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Use NavBar component */}
            <NavBar />
            
            <div className="flex flex-grow pt-16">
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
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.path) {
                                            navigate(item.path);
                                        } else {
                                            setActiveSection(item.id);
                                        }
                                        if (mobileMenuOpen) setMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} 
                                        w-full py-3 px-4 rounded-lg transition-colors text-base
                                        ${activeSection === item.id
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {!sidebarCollapsed && (
                                        <span className="ml-4 truncate">{item.name}</span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`flex-1 transition-all duration-300 ease-in-out
                    ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} p-4 md:p-8`}>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeSection.replace('-', ' ')}</h1>
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                            <FiCalendar className="opacity-70" />
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <ol className="flex items-center text-sm">
                            <li className="text-gray-500 hover:text-blue-600 transition-colors">
                                <button onClick={() => setActiveSection('overview')}>Dashboard</button>
                            </li>
                            {activeSection !== 'overview' && (
                                <>
                                    <span className="mx-2 text-gray-400">/</span>
                                    <li className="text-blue-600 font-medium capitalize">{activeSection}</li>
                                </>
                            )}
                        </ol>
                    </nav>

                    {renderSection()}
                </div>
            </div>
            
        </div>
    );
};

export default AdminDashboard;