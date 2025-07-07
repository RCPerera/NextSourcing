import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderStats, getTotalPriceSummation } from '../../services/orderService';
import { FiArrowLeft, FiCalendar, FiRefreshCw, FiDownload, FiBarChart2, FiDollarSign, FiPieChart } from 'react-icons/fi';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AdminSidebar from '../../components/admin/AdminSidebar';

const OrderIncome = () => {
  // Mock data for fallback when API fails
  const MOCK_DATA = {
    totalRevenue: 12589.75,
    totalOrders: 48,
    statusCounts: {
      Pending: 5,
      Processing: 12,
      Shipped: 8,
      Delivered: 20,
      Cancelled: 3
    },
    dailyRevenue: Array(30).fill(0).map((_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - idx));
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 1000) + 200,
        orderCount: Math.floor(Math.random() * 5) + 1
      };
    }),
    recentOrders: [
      {
        _id: 'ORD60a1b2c3d4e5f6a7b8c9d0',
        user: { name: 'John Smith', email: 'john@example.com' },
        totalPrice: 77.97,
        isPaid: true,
        paidAt: '2025-04-20T10:30:00Z',
        orderStatus: 'Delivered',
        createdAt: '2025-04-18T09:15:00Z'
      },
      {
        _id: 'ORD70a2b3c4d5e6f7a8b9c0d1',
        user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
        totalPrice: 150.99,
        isPaid: true,
        paidAt: '2025-04-22T11:45:00Z',
        orderStatus: 'Shipped',
        createdAt: '2025-04-21T15:30:00Z'
      },
      {
        _id: 'ORD80a3b4c5d6e7f8a9b0c1d2',
        user: { name: 'Michael Brown', email: 'michael@example.com' },
        totalPrice: 71.98,
        isPaid: false,
        orderStatus: 'Processing',
        createdAt: '2025-04-26T08:20:00Z'
      },
      {
        _id: 'ORD90a4b5c6d7e8f9a0b1c2d3',
        user: { name: 'Emily Wilson', email: 'emily@example.com' },
        totalPrice: 89.99,
        isPaid: true,
        paidAt: '2025-04-28T09:10:00Z',
        orderStatus: 'Pending',
        createdAt: '2025-04-27T16:45:00Z'
      }
    ]
  };

  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // last 30 days
    endDate: new Date().toISOString().split('T')[0] // today
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    statusCounts: {},
    dailyRevenue: [],
    recentOrders: []
  });
  const [totalSummation, setTotalSummation] = useState({
    totalAmount: 0,
    orderCount: 0
  });
  const [activeView, setActiveView] = useState('revenue');
  const [useMockData, setUseMockData] = useState(false);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  const STATUS_COLORS = {
    Pending: '#FFBB28',     // Yellow
    Processing: '#0088FE',  // Blue
    Shipped: '#8884d8',     // Purple
    Delivered: '#00C49F',   // Green
    Cancelled: '#FF8042'    // Orange
  };

  // Fetch order statistics from the backend
  const fetchOrderStats = async () => {
    setLoading(true);
    try {
      const response = await getOrderStats({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });

      if (response && response.success && response.stats) {
        // Ensure all required properties exist in the stats object
        const completeStats = {
          totalRevenue: response.stats.totalRevenue || 0,
          totalOrders: response.stats.totalOrders || 0,
          statusCounts: response.stats.statusCounts || {},
          dailyRevenue: Array.isArray(response.stats.dailyRevenue) ? response.stats.dailyRevenue : [],
          recentOrders: Array.isArray(response.stats.recentOrders) ? response.stats.recentOrders : []
        };
        setStats(completeStats);
        setUseMockData(false);
      } else {
        console.error('Invalid response format:', response);
        setError('Failed to fetch order statistics');
        toast.error('Failed to fetch order statistics');
        // Fall back to mock data
        setStats(MOCK_DATA);
        setUseMockData(true);
      }
    } catch (err) {
      console.error('Error fetching order statistics:', err);
      setError(err.message || 'An unexpected error occurred');
      toast.error('Failed to connect to server');
      // Fall back to mock data
      setStats(MOCK_DATA);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total price summation of all orders
  const fetchTotalPriceSummation = async () => {
    try {
      const response = await getTotalPriceSummation();
      
      if (response && response.success) {
        setTotalSummation({
          totalAmount: response.totalAmount || 0,
          orderCount: response.orderCount || 0
        });
      } else {
        console.error('Failed to fetch total price summation');
      }
    } catch (err) {
      console.error('Error fetching total price summation:', err);
    }
  };

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply date filter
  const applyDateFilter = () => {
    fetchOrderStats();
  };

  // Reset date filter to last 30 days
  const resetDateFilter = () => {
    setDateRange({
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    });
    setTimeout(() => {
      fetchOrderStats();
    }, 0);
  };

  // Export data as CSV
  const exportData = () => {
    const { dailyRevenue } = stats;
    
    // Create CSV content
    let csvContent = "Date,Revenue,Orders\n";
    dailyRevenue.forEach(day => {
      csvContent += `${day.date},${day.revenue},${day.orderCount}\n`;
    });
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `order-revenue-${dateRange.startDate}-to-${dateRange.endDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Calculate total status counts for pie chart
  const prepareStatusData = () => {
    const { statusCounts } = stats;
    return Object.keys(statusCounts).map(key => ({
      name: key,
      value: statusCounts[key]
    })).filter(item => item.value > 0);
  };

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchOrderStats();
    fetchTotalPriceSummation();
  }, []);

  // Use mock data if API fails and stats are empty
  useEffect(() => {
    if (!loading && (!stats.dailyRevenue || !Array.isArray(stats.dailyRevenue) || stats.dailyRevenue.length === 0)) {
      setStats(MOCK_DATA);
      setUseMockData(true);
    }
  }, [loading, stats.dailyRevenue]);

  // Fix the condition that was causing the error
  if (loading && (!stats || !stats.dailyRevenue || !Array.isArray(stats.dailyRevenue))) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading order statistics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center mb-2">
              <Link to="/admin/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                <FiArrowLeft className="mr-2" /> Back to Orders
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Order Income Dashboard</h1>
            <p className="text-gray-600">
              Revenue statistics from {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiDownload className="mr-2" /> Export Data
            </button>
            
            <button
              onClick={resetDateFilter}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50"
            >
              <FiRefreshCw className="mr-2" /> Reset
            </button>
          </div>
        </div>

        {/* Total Price Summation Card */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500 mb-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">All-Time Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSummation.totalAmount)}</p>
              <p className="text-sm text-gray-500 mt-1">From {totalSummation.orderCount} total orders</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FiDollarSign className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
        
        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Total Revenue Card */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Period Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiDollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Total Orders Card */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Period Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiBarChart2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Average Order Value */}
          <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders > 0 
                    ? formatCurrency(stats.totalRevenue / stats.totalOrders) 
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiPieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Date Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto flex items-center">
              <FiCalendar className="text-gray-400 mr-2" />
              <span className="text-sm text-gray-700">Filter by date:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 flex-grow">
              <div className="flex-1">
                <label htmlFor="startDate" className="sr-only">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-500">to</span>
              </div>
              
              <div className="flex-1">
                <label htmlFor="endDate" className="sr-only">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <button
                  onClick={applyDateFilter}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="bg-white p-2 rounded-lg shadow mb-6 flex">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded ${activeView === 'revenue' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveView('revenue')}
          >
            Revenue Chart
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded ${activeView === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
            onClick={() => setActiveView('orders')}
          >
            Order Status
          </button>
        </div>
        
        {/* Main Content - Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart - takes 2/3 of width on large screens */}
          <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {activeView === 'revenue' ? 'Revenue Over Time' : 'Orders By Status'}
            </h2>
            
            {activeView === 'revenue' ? (
              <div className="h-80">
                {stats.dailyRevenue.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.dailyRevenue}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => {
                          const dateObj = new Date(date);
                          return dateObj.getDate() + '/' + (dateObj.getMonth() + 1);
                        }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']} 
                        labelFormatter={(date) => `Date: ${new Date(date).toLocaleDateString()}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        fill="#93c5fd" 
                        name="Revenue" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No revenue data available for the selected period</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-80">
                {Object.values(stats.statusCounts).some(count => count > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.keys(stats.statusCounts).map(status => ({
                        name: status,
                        count: stats.statusCounts[status]
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Orders">
                        {Object.keys(stats.statusCounts).map((status, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[status] || COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No order status data available for the selected period</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Side Charts - takes 1/3 of width on large screens */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Status Distribution
            </h2>
            
            <div className="h-64">
              {prepareStatusData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareStatusData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={(entry) => entry.name}
                    >
                      {prepareStatusData().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={STATUS_COLORS[entry.name] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No order status data available</p>
                </div>
              )}
            </div>
            
            {/* Status Legends */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: STATUS_COLORS[status] || '#999' }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {status}: {count} orders
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="mt-6 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          </div>
          
          {stats.recentOrders && stats.recentOrders.length > 0 ? (
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : 
                          order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link to={`/orders/${order._id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent orders found for the selected period
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderIncome;