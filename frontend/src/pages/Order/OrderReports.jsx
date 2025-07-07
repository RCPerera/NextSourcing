import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderStatistics } from '../../services/orderService';
import { FiDownload, FiPrinter, FiFilter, FiRefreshCw, FiBarChart2, FiPieChart, FiCalendar } from 'react-icons/fi';
import AdminSidebar from '../../components/admin/AdminSidebar';

const OrderReports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('sales'); // sales, product, customer
  const [chartType, setChartType] = useState('bar'); // bar, line, pie
  const chartRef = useRef(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      };
      
      const response = await getOrderStatistics(params);
      if (response.success) {
        setStats(response.stats);
      } else {
        toast.error(response.message || 'Failed to fetch report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('An error occurred while fetching the report');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    fetchReportData();
  };

  const handleResetFilters = () => {
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setTimeout(() => {
      fetchReportData();
    }, 0);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = (format) => {
    // This would be implemented to export the data in different formats
    toast.info(`Exporting report as ${format}...`);
    
    // For demonstration purposes
    setTimeout(() => {
      toast.success(`Report exported as ${format} successfully`);
    }, 1000);
  };

  // Render loading state or empty state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar />
        <div className="flex-grow p-6">
          <div className="bg-white p-8 rounded-lg shadow-md flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading report data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Function to format dates in a readable way
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar />
      
      <div className="flex-grow p-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Reports</h1>
            <p className="text-gray-600">Generate and analyze order reports</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            
            <div className="relative">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FiDownload className="mr-2" /> Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                <div className="py-1">
                  <button 
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button 
                    onClick={() => handleExport('csv')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                  <button 
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border rounded-md px-3 py-2 w-full md:w-48"
              >
                <option value="sales">Sales Report</option>
                <option value="product">Product Performance</option>
                <option value="customer">Customer Analysis</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="border rounded-md pl-10 pr-3 py-2 w-full md:w-40"
                />
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="border rounded-md pl-10 pr-3 py-2 w-full md:w-40"
                />
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <div className="flex border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`flex-1 py-2 px-3 ${chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                >
                  <FiBarChart2 className="mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('pie')}
                  className={`flex-1 py-2 px-3 ${chartType === 'pie' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700'}`}
                >
                  <FiPieChart className="mx-auto" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
              >
                <FiFilter className="mr-2" /> Apply Filters
              </button>
              
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center"
              >
                <FiRefreshCw className="mr-2" /> Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm uppercase">Total Orders</h3>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
            <div className="mt-2 text-sm text-gray-600">
              {dateRange.startDate && dateRange.endDate ? 
                `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}` : 
                'All Time'}
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm uppercase">Total Revenue</h3>
            <p className="text-3xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
            <div className="mt-2 text-sm text-green-600">
              {stats?.revenueGrowth > 0 ? `+${stats.revenueGrowth}%` : stats?.revenueGrowth < 0 ? `${stats.revenueGrowth}%` : '0%'} from previous period
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm uppercase">Average Order Value</h3>
            <p className="text-3xl font-bold">${stats?.avgOrderValue?.toFixed(2) || '0.00'}</p>
            <div className="mt-2 text-sm text-gray-600">
              Per order average
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h3 className="text-gray-500 text-sm uppercase">Fulfillment Rate</h3>
            <p className="text-3xl font-bold">{stats?.fulfillmentRate || 0}%</p>
            <div className="mt-2 text-sm text-gray-600">
              Orders delivered on time
            </div>
          </div>
        </div>
        
        {/* Chart Area */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {reportType === 'sales' && 'Sales Trends'}
            {reportType === 'product' && 'Product Performance'}
            {reportType === 'customer' && 'Customer Analysis'}
          </h2>
          
          <div className="h-80" ref={chartRef}>
            {/* Chart would be rendered here using a library like Chart.js */}
            <div className="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-md">
              <div className="text-center text-gray-500">
                <FiBarChart2 className="mx-auto h-12 w-12 mb-2" />
                <p>Chart visualization would appear here</p>
                <p className="text-sm mt-2">Using actual chart libraries like Chart.js</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>
                        #{order._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user?.name || 'Guest Customer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                          ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.orderItems?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t">
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Orders →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderReports;