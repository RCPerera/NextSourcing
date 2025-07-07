import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, markOrderAsDelivered } from '../../services/orderService';
import { toast } from 'react-toastify';
import AdminSidebar from './AdminSidebar';
import { 
  FiFilter, 
  FiRefreshCw, 
  FiSearch, 
  FiEdit, 
  FiEye, 
  FiTrash2,
  FiDownload,
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle, 
  FiTruck, 
  FiClock, 
  FiPackage,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const OrderList = () => {
  // State for orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    minTotal: '',
    maxTotal: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch orders on initial load and when pagination changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);
  
  // Function to fetch orders with filters and pagination
  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', ordersPerPage);
      
      // Apply filters if they exist
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minTotal) params.append('minTotal', filters.minTotal);
      if (filters.maxTotal) params.append('maxTotal', filters.maxTotal);
      
      const response = await getAllOrders(params.toString());
      
      if (response.success) {
        setOrders(response.orders);
        setTotalPages(Math.ceil(response.totalOrders / ordersPerPage));
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Apply filters and reset pagination
  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      startDate: '',
      endDate: '',
      minTotal: '',
      maxTotal: ''
    });
    setCurrentPage(1);
    fetchOrders();
    setShowFilters(false);
  };
  
  // Handle order status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      let response;
      
      if (newStatus === 'Delivered') {
        response = await markOrderAsDelivered(orderId);
      } else {
        response = await updateOrderStatus(orderId, newStatus);
      }
      
      if (response.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, orderStatus: newStatus, ...(newStatus === 'Delivered' ? { isDelivered: true, deliveredAt: new Date() } : {}) } 
            : order
        ));
        
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('An error occurred while updating the order status');
    }
  };
  
  // Helper function to get status badge color
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
  
  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="text-yellow-600" />;
      case 'Processing': return <FiPackage className="text-blue-600" />;
      case 'Shipped': return <FiTruck className="text-purple-600" />;
      case 'Delivered': return <FiCheckCircle className="text-green-600" />;
      case 'Cancelled': return <FiXCircle className="text-red-600" />;
      default: return <FiAlertCircle className="text-gray-600" />;
    }
  };
  
  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to handle order export (placeholder)
  const handleExportOrders = () => {
    toast.info('Export functionality will be implemented soon.');
  };
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50"
              >
                <FiFilter className="mr-2" /> Filter
              </button>
              
              <button
                type="button"
                onClick={handleExportOrders}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <FiDownload className="mr-2" /> Export
              </button>
              
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
            </div>
          </div>
          
          {/* Filter panel */}
          {showFilters && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Order Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <label htmlFor="minTotal" className="block text-sm font-medium text-gray-700 mb-1">
                    Min Total ($)
                  </label>
                  <input
                    type="number"
                    id="minTotal"
                    name="minTotal"
                    value={filters.minTotal}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label htmlFor="maxTotal" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Total ($)
                  </label>
                  <input
                    type="number"
                    id="maxTotal"
                    name="maxTotal"
                    value={filters.maxTotal}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="1000.00"
                  />
                </div>
                
                {/* Search Filter */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Order ID, Customer name, email"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Order table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-50 p-4 border-b">
              <div className="text-sm text-gray-500">
                Showing {orders.length > 0 ? (currentPage - 1) * ordersPerPage + 1 : 0} - {Math.min(currentPage * ordersPerPage, orders.length + ((currentPage - 1) * ordersPerPage))} orders
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search orders..."
                  className="mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                <button 
                  type="button" 
                  onClick={applyFilters}
                  className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiSearch />
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
                <p className="mt-4 text-gray-500">{error}</p>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiRefreshCw className="mr-2" /> Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FiRefreshCw className="mr-2" /> Reset Filters
                </button>
              </div>
            ) : (
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
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {order._id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.user?.name || 'Guest'}</div>
                          <div className="text-xs text-gray-500">{order.shippingAddress?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderItems?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.totalPrice?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(order.orderStatus)}
                            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-900" title="View">
                              <FiEye />
                            </Link>
                            <Link to={`/admin/orders/edit/${order._id}`} className="text-yellow-600 hover:text-yellow-900" title="Edit">
                              <FiEdit />
                            </Link>
                            
                            {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                              <div className="relative group">
                                <button className="text-blue-600 hover:text-blue-900" title="Update Status">
                                  <FiPackage />
                                </button>
                                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block">
                                  <div className="py-1">
                                    {order.orderStatus !== 'Processing' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Processing')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        Mark as Processing
                                      </button>
                                    )}
                                    {order.orderStatus !== 'Shipped' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        Mark as Shipped
                                      </button>
                                    )}
                                    {order.orderStatus !== 'Delivered' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      >
                                        Mark as Delivered
                                      </button>
                                    )}
                                    {order.orderStatus !== 'Cancelled' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                      >
                                        Cancel Order
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            {!loading && orders.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                        // Show up to 5 page numbers
                        let pageNumber;
                        
                        if (totalPages <= 5) {
                          // If we have 5 or fewer pages, show all
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          // If we're near the start, show 1-5
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If we're near the end, show last 5 pages
                          pageNumber = totalPages - 4 + index;
                        } else {
                          // Otherwise show current page and 2 on each side
                          pageNumber = currentPage - 2 + index;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              pageNumber === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;