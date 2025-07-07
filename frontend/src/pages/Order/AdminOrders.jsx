import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, markOrderAsDelivered } from '../../services/orderService';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { 
  FiFilter, 
  FiRefreshCw, 
  FiDownload, 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp,
  FiChevronRight, 
  FiChevronLeft,
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle, 
  FiTruck, 
  FiClock, 
  FiPackage,
  FiPrinter,
  FiEye,
  FiDollarSign
} from 'react-icons/fi';

const AdminOrders = () => {
  // Mock data for development when backend fails
  const MOCK_ORDERS = [
    {
      _id: 'ORD60a1b2c3d4e5f6a7b8c9d0',
      user: { name: 'John Smith', email: 'john@example.com' },
      orderItems: [
        { name: 'Cotton T-Shirt', quantity: 3, price: 25.99, image: '/images/products/tshirt.jpg', product: 'PROD001' }
      ],
      shippingAddress: { fullName: 'John Smith', address: '123 Main St', city: 'Colombo' },
      paymentMethod: 'Credit Card',
      totalPrice: 77.97,
      isPaid: true,
      paidAt: '2025-04-20T10:30:00Z',
      orderStatus: 'Delivered',
      isDelivered: true,
      deliveredAt: '2025-04-25T14:20:00Z',
      createdAt: '2025-04-18T09:15:00Z'
    },
    {
      _id: 'ORD70a2b3c4d5e6f7a8b9c0d1',
      user: { name: 'Sarah Johnson', email: 'sarah@example.com' },
      orderItems: [
        { name: 'Denim Jeans', quantity: 1, price: 59.99, image: '/images/products/jeans.jpg', product: 'PROD002' },
        { name: 'Silk Blouse', quantity: 2, price: 45.50, image: '/images/products/blouse.jpg', product: 'PROD003' }
      ],
      shippingAddress: { fullName: 'Sarah Johnson', address: '456 Oak Ave', city: 'Galle' },
      paymentMethod: 'PayPal',
      totalPrice: 150.99,
      isPaid: true,
      paidAt: '2025-04-22T11:45:00Z',
      orderStatus: 'Shipped',
      isDelivered: false,
      createdAt: '2025-04-21T15:30:00Z'
    },
    {
      _id: 'ORD80a3b4c5d6e7f8a9b0c1d2',
      user: { name: 'Michael Brown', email: 'michael@example.com' },
      orderItems: [
        { name: 'Formal Shirt', quantity: 2, price: 35.99, image: '/images/products/shirt.jpg', product: 'PROD004' }
      ],
      shippingAddress: { fullName: 'Michael Brown', address: '789 Pine St', city: 'Kandy' },
      paymentMethod: 'Cash on Delivery',
      totalPrice: 71.98,
      isPaid: false,
      orderStatus: 'Processing',
      isDelivered: false,
      createdAt: '2025-04-26T08:20:00Z'
    },
    {
      _id: 'ORD90a4b5c6d7e8f9a0b1c2d3',
      user: { name: 'Emily Wilson', email: 'emily@example.com' },
      orderItems: [
        { name: 'Summer Dress', quantity: 1, price: 89.99, image: '/images/products/dress.jpg', product: 'PROD005' }
      ],
      shippingAddress: { fullName: 'Emily Wilson', address: '101 Cedar Rd', city: 'Negombo' },
      paymentMethod: 'Credit Card',
      totalPrice: 89.99,
      isPaid: true,
      paidAt: '2025-04-28T09:10:00Z',
      orderStatus: 'Pending',
      isDelivered: false,
      createdAt: '2025-04-27T16:45:00Z'
    },
    {
      _id: 'ORD10a5b6c7d8e9f0a1b2c3d4',
      user: { name: 'David Lee', email: 'david@example.com' },
      orderItems: [
        { name: 'Winter Jacket', quantity: 1, price: 129.99, image: '/images/products/jacket.jpg', product: 'PROD006' },
        { name: 'Scarf', quantity: 1, price: 19.99, image: '/images/products/scarf.jpg', product: 'PROD007' }
      ],
      shippingAddress: { fullName: 'David Lee', address: '202 Maple Ave', city: 'Colombo' },
      paymentMethod: 'PayPal',
      totalPrice: 149.98,
      isPaid: false,
      orderStatus: 'Cancelled',
      isDelivered: false,
      createdAt: '2025-04-24T13:30:00Z'
    }
  ];
  
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    searchQuery: '',
    isPaid: ''
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc', // 'asc' or 'desc'
  });
  
  // Refs
  const searchInputRef = useRef(null);
  const filterPanelRef = useRef(null);
  
  // UI state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Functions
  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Create a params object for getAllOrders
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: sortConfig.key,
        direction: sortConfig.direction,
        ...filters
      };
      
      try {
        // Try to fetch from API first
        const response = await getAllOrders(params);
        
        if (response.success) {
          setOrders(response.orders || []);
          setTotalOrders(response.totalCount || 0);
          setTotalPages(Math.ceil((response.totalCount || 0) / itemsPerPage));
          setError(null);
          setUseMockData(false);
        } else {
          // If API returns error but not a server error, show the message
          throw new Error(response.message || 'Failed to fetch orders');
        }
      } catch (apiError) {
        console.error('API error, falling back to mock data:', apiError);
        
        // Fall back to mock data
        setOrders(MOCK_ORDERS);
        setTotalOrders(MOCK_ORDERS.length);
        setTotalPages(1);
        setError('Using demo data: Backend API temporarily unavailable');
        setUseMockData(true);
      }
    } catch (err) {
      console.error('Error in fetchOrders:', err);
      
      // Final fallback
      setOrders(MOCK_ORDERS);
      setTotalOrders(MOCK_ORDERS.length);
      setTotalPages(1);
      setError('Using demo data: ' + (err.message || 'Failed to fetch orders'));
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchOrders();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      searchQuery: '',
      isPaid: ''
    });
    setCurrentPage(1);
    setTimeout(() => {
      fetchOrders();
    }, 0);
  };

  const handleStatusUpdate = async (orderId, status) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', err);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    setProcessingOrderId(orderId);
    try {
      await markOrderAsDelivered(orderId);
      toast.success('Order marked as Delivered');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to mark order as delivered');
      console.error('Error marking order as delivered:', err);
    } finally {
      setProcessingOrderId(null);
    }
  };
  
  // Effect to fetch orders on mount and when filters or pagination change
  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage, sortConfig]);
  
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
  
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            
            <div className="flex space-x-2">
              <Link
                to="/admin/order-income"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                <FiDollarSign className="mr-2" /> Order Income
              </Link>
              
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm bg-white hover:bg-gray-50"
              >
                <FiFilter className="mr-2" /> Filter
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
                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
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
                
                {/* Payment Status Filter */}
                <div>
                  <label htmlFor="isPaid" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    id="isPaid"
                    name="isPaid"
                    value={filters.isPaid}
                    onChange={handleFilterChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">All Payment Statuses</option>
                    <option value="true">Paid</option>
                    <option value="false">Unpaid</option>
                  </select>
                </div>
                
                {/* Date Range Filters */}
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
                
                {/* Search Filter */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search (Order ID, Customer Name)
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
                      placeholder="Search orders..."
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
                Showing {orders.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalOrders)} of {totalOrders} orders
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
                  onClick={() => fetchOrders()}
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
                          <div className="text-xs text-gray-500">{order.shippingAddress?.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.totalPrice.toFixed(2)}
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
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/orders/${order._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            
                            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Delivered' && (
                              <div className="relative group">
                                <button
                                  className="text-blue-600 hover:text-blue-900 flex items-center"
                                  disabled={processingOrderId === order._id}
                                >
                                  Update Status 
                                  <FiChevronDown className="ml-1" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                                  <div className="py-1">
                                    {order.orderStatus !== 'Processing' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Processing')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        disabled={processingOrderId === order._id}
                                      >
                                        Mark as Processing
                                      </button>
                                    )}
                                    {order.orderStatus !== 'Shipped' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        disabled={processingOrderId === order._id}
                                      >
                                        Mark as Shipped
                                      </button>
                                    )}
                                    {!order.isDelivered && (
                                      <button
                                        onClick={() => handleMarkAsDelivered(order._id)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        disabled={processingOrderId === order._id}
                                      >
                                        Mark as Delivered
                                      </button>
                                    )}
                                    {order.orderStatus !== 'Cancelled' && (
                                      <button
                                        onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                        disabled={processingOrderId === order._id}
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
                      Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalOrders)}</span> of{' '}
                      <span className="font-medium">{totalOrders}</span> results
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
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive = pageNumber === currentPage;
                        
                        // Show current page, first page, last page, and pages adjacent to current page
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                isActive
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          // Show ellipsis
                          return (
                            <span
                              key={pageNumber}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        
                        return null;
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

export default AdminOrders;