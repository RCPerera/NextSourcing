import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { FiCheckCircle, FiClock, FiTruck, FiArrowRight } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        
        if (response.success) {
          setOrder(response.order);
        } else {
          setError(response.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="mb-6">{error}</p>
          <Link 
            to="/orders" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-8 rounded-lg text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
          <p className="mb-6">We couldn't find the order you're looking for.</p>
          <Link 
            to="/orders" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
          >
            Go to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center mb-8">
          <FiCheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-lg">
            Thank you for your order. Your order number is: <span className="font-mono font-semibold">{order._id}</span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          
          {/* Order Status */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FiClock className="text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Order Status</h3>
            </div>
            <div className="ml-7">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {order.orderStatus}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {/* Shipping Information */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FiTruck className="text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-700">Shipping Information</h3>
            </div>
            <div className="ml-7">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Phone: {order.shippingAddress.phoneNumber}</p>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Method</h3>
            <p>{order.paymentMethod}</p>
          </div>
          
          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h3>
            <div className="bg-gray-50 rounded-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                        }}
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                          {item.category === 'fabric' && item.fabricMeasurement && ` (${item.fabricMeasurement} meters)`}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Total */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Total</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Items</p>
                <p>${order.itemsPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping</p>
                <p>${order.shippingPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tax</p>
                <p>${order.taxPrice.toFixed(2)}</p>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-semibold">
                <p>Total</p>
                <p>${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Link 
            to="/orders" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
          >
            View All Orders
          </Link>
          <Link 
            to="/products" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Continue Shopping <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;