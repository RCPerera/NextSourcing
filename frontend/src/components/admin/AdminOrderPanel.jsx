import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPieChart, FiTrendingUp, FiAlertCircle, FiDollarSign, FiPackage, FiTruck, FiCheck, FiCalendar, FiEdit } from 'react-icons/fi';
import { getAllOrders, getOrderStats, updateOrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';

// Optional: If you have chart libraries installed
// import { Line, Bar, Pie } from 'react-chartjs-2';

const AdminOrderPanel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0, 
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalSales: 0,
    dailySales: [],
    monthlySales: []
  });
  
  // Status update state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState({});
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Date filters
  const [dateRange, setDateRange] = useState('week'); // 'today', 'week', 'month', 'year'

  useEffect(() => {
    fetchOrderStats();
  }, [dateRange]);

  const fetchOrderStats = async () => {
    setLoading(true);
    try {
      const response = await getOrderStats(dateRange);
      if (response.success) {
        setOrderStats(response);
      } else {
        setError(response.message || 'Failed to fetch order statistics');
      }
    } catch (err) {
      console.error('Error fetching order statistics:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recentOrders = orderStats.recentOrders || [];

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setStatusUpdating(true);
    try {
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrderStats(); // Refresh the stats after update
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setUpdatingOrderId(null);
      setStatusUpdating(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Orders Dashboard</h2>
      
      {/* Time Range Filter */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setDateRange('today')}
            className={`py-2 px-4 text-sm font-medium rounded-l-lg border ${
              dateRange === 'today'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setDateRange('week')}
            className={`py-2 px-4 text-sm font-medium border-t border-b ${
              dateRange === 'week'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setDateRange('month')}
            className={`py-2 px-4 text-sm font-medium ${
              dateRange === 'month'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setDateRange('year')}
            className={`py-2 px-4 text-sm font-medium rounded-r-lg border ${
              dateRange === 'year'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 flex-col">
          <FiAlertCircle className="text-red-500 h-12 w-12 mb-4" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchOrderStats}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Orders Card */}
            <div className="bg-white rounded-lg shadow p-6 transition-transform transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 bg-opacity-50">
                  <FiPackage className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-bold">{orderStats.totalOrders || 0}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <FiTrendingUp className="text-green-500 mr-1" />
                <span className="text-green-500 font-semibold">
                  {orderStats.orderGrowth || 0}%
                </span>
                <span className="text-gray-500 ml-1">vs. previous period</span>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-lg shadow p-6 transition-transform transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 bg-opacity-50">
                  <FiDollarSign className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-500">Total Revenue</h3>
                  <p className="text-2xl font-bold">{formatCurrency(orderStats.totalSales || 0)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <FiTrendingUp className="text-green-500 mr-1" />
                <span className="text-green-500 font-semibold">
                  {orderStats.revenueGrowth || 0}%
                </span>
                <span className="text-gray-500 ml-1">vs. previous period</span>
              </div>
            </div>

            {/* Processing Orders Card */}
            <div className="bg-white rounded-lg shadow p-6 transition-transform transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 bg-opacity-50">
                  <FiTruck className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-500">Processing</h3>
                  <p className="text-2xl font-bold">{orderStats.processingOrders || 0}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Link to="/admin/orders?status=processing" className="text-blue-600 hover:text-blue-800">
                  View all processing orders &rarr;
                </Link>
              </div>
            </div>

            {/* Delivered Orders Card */}
            <div className="bg-white rounded-lg shadow p-6 transition-transform transform hover:scale-105">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 bg-opacity-50">
                  <FiCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-500">Delivered</h3>
                  <p className="text-2xl font-bold">{orderStats.deliveredOrders || 0}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-500 font-semibold">
                  {Math.round((orderStats.deliveredOrders / orderStats.totalOrders) * 100) || 0}%
                </span>
                <span className="text-gray-500 ml-1">completion rate</span>
              </div>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Order Status Distribution</h3>
              </div>
              <div className="p-6">
                {/* This section would include a Pie chart - for now using a simple display */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="text-sm">
                      <span className="font-medium">Pending:</span> {orderStats.pendingOrders || 0}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <div className="text-sm">
                      <span className="font-medium">Processing:</span> {orderStats.processingOrders || 0}
                    </div>
                  </div>
                  <div className="flex items-center">
            {/* Sales Trend */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
              </div>
              <div className="p-6">
                {/* Placeholder for chart */}
                <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization will appear here</p>
                  {/* <Line data={lineChartData} options={lineChartOptions} /> */}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
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
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.user?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrderPanel;