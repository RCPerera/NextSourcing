import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderById } from '../../services/orderService';
import { FiSearch, FiPackage, FiCheck, FiTruck, FiCalendar, FiMapPin } from 'react-icons/fi';

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      toast.warning('Please enter an order number');
      return;
    }
    
    setLoading(true);
    try {
      const response = await getOrderById(orderNumber);
      if (response.success) {
        setOrder(response.order);
      } else {
        toast.error(response.message || 'Order not found');
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepNumber = (status) => {
    const statusMap = {
      'Processing': 1,
      'Confirmed': 2,
      'Shipped': 3,
      'Delivered': 4
    };
    return statusMap[status] || 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track the status of your order</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="orderNumber" className="block text-gray-700 mb-2">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number"
                className="w-full border rounded-md px-4 py-2"
              />
            </div>
            <div className="self-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-6 rounded-md flex items-center"
              >
                {loading ? 'Searching...' : (
                  <>
                    <FiSearch className="mr-2" /> Track Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="border-b pb-4 mb-6">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Order #{order._id}</h2>
                  <p className="text-gray-600">
                    <FiCalendar className="inline mr-1" />
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`
                    px-4 py-2 rounded-full font-medium
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    ${order.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Progress */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Shipping Status</h3>
              
              <div className="relative">
                {/* Progress bar */}
                <div className="h-1 bg-gray-200 absolute top-6 left-0 right-0 z-0">
                  <div 
                    className="h-1 bg-green-500" 
                    style={{ width: `${getStatusStepNumber(order.status) * 33.33}%` }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                  <div className="text-center">
                    <div className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${getStatusStepNumber(order.status) >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      <FiPackage size={20} />
                    </div>
                    <div className="mt-2 text-sm">Processing</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${getStatusStepNumber(order.status) >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      <FiCheck size={20} />
                    </div>
                    <div className="mt-2 text-sm">Confirmed</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${getStatusStepNumber(order.status) >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      <FiTruck size={20} />
                    </div>
                    <div className="mt-2 text-sm">Shipped</div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${getStatusStepNumber(order.status) >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      <FiMapPin size={20} />
                    </div>
                    <div className="mt-2 text-sm">Delivered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.orderItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded mr-4"></div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name || 'Product'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-right text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t">
                      <td colSpan="2" className="px-4 py-4 text-right font-medium">Total:</td>
                      <td className="px-4 py-4 text-right text-lg font-bold">${order.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Shipping Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Delivery Address</h4>
                  <p className="text-gray-700">
                    {order.shippingAddress?.address}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                    {order.shippingAddress?.country}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <p className="text-gray-700">
                    {order.user?.name || 'Customer'}<br />
                    {order.user?.email || 'email@example.com'}<br />
                    {order.user?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* View Order Details Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-blue-600 text-white py-2 px-6 rounded-md"
              >
                View Full Order Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;