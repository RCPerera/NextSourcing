import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderById, payOrder, cancelOrder } from '../../services/orderService';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

// Helper function to safely format order ID
const formatOrderId = (orderId) => {
  if (!orderId) return 'N/A';
  return typeof orderId === 'string' ? orderId.substring(0, 8) : 'N/A';
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cancellationProcessing, setCancellationProcessing] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        
        if (response.success) {
          setOrder(response.order);
        } else {
          setError(response.message || 'Failed to fetch order details');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Handle payment
  const handlePayNow = async () => {
    try {
      setPaymentProcessing(true);
      
      // For demo purposes, simulate a successful payment
      const paymentResult = {
        id: `PAY-${Date.now()}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        payer: {
          email_address: 'customer@example.com'
        }
      };
      
      const response = await payOrder(id, paymentResult);
      
      if (response.success) {
        setOrder(response.order);
        toast.success('Payment successful!');
      } else {
        toast.error(response.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      toast.error('An unexpected error occurred during payment');
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      setCancellationProcessing(true);
      const response = await cancelOrder(id);
      
      if (response.success) {
        setOrder(response.order);
        toast.success('Order cancelled successfully');
      } else {
        toast.error(response.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      toast.error('An unexpected error occurred while cancelling order');
    } finally {
      setCancellationProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FiAlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">{error}</h2>
        <Link to="/orders" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-1" /> Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <FiAlertCircle className="h-12 w-12 text-yellow-500" />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">Order not found</h2>
        <Link to="/orders" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <FiArrowLeft className="mr-1" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Link to="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order #{formatOrderId(order?._id)}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Placed on {formatDate(order?.createdAt)}
              </p>
            </div>
            
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                order.orderStatus === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.orderStatus}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Order Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {order.orderStatus === 'Delivered' ? (
                    <FiCheckCircle className="text-green-500 mr-2" />
                  ) : order.orderStatus === 'Cancelled' ? (
                    <FiXCircle className="text-red-500 mr-2" />
                  ) : (
                    <FiAlertCircle className="text-yellow-500 mr-2" />
                  )}
                  <span>{order.orderStatus}</span>
                  {order.isDelivered && (
                    <span className="ml-2 text-xs text-gray-500">
                      (Delivered on {formatDate(order.deliveredAt)})
                    </span>
                  )}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Payment Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  {order.isPaid ? (
                    <>
                      <FiCheckCircle className="text-green-500 mr-2" />
                      <span>Paid</span>
                      <span className="ml-2 text-xs text-gray-500">
                        (Paid on {formatDate(order.paidAt)})
                      </span>
                    </>
                  ) : (
                    <>
                      <FiXCircle className="text-red-500 mr-2" />
                      <span>Not Paid</span>
                      
                      {order.orderStatus !== 'Cancelled' && (
                        <button
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                          onClick={handlePayNow}
                          disabled={paymentProcessing}
                        >
                          {paymentProcessing ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                    </>
                  )}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Payment Method
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.paymentMethod}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Shipping Address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.shippingAddress ? (
                    <address className="not-italic">
                      {order.shippingAddress.fullName || 'N/A'}<br />
                      {order.shippingAddress.address || 'N/A'}<br />
                      {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.postalCode || 'N/A'}<br />
                      {order.shippingAddress.country || 'N/A'}<br />
                      <span className="text-gray-500">{order.shippingAddress.phoneNumber || order.shippingAddress.phone || 'N/A'}</span>
                    </address>
                  ) : (
                    <p>No shipping address information available</p>
                  )}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Order Items
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {order.orderItems.map((item) => (
                        <li key={item._id || item.product} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-16 w-16 object-cover rounded-md mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                            <div>
                              <span className="font-medium truncate">{item.name}</span>
                              <div className="text-gray-500">
                                ${(item.price || 0).toFixed(2)} x {item.qty || item.quantity || 1} = ${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div>
                            {item.product && (
                              <Link
                                to={`/products/${item.product}`}
                                className="font-medium text-blue-600 hover:text-blue-500"
                              >
                                View Product
                              </Link>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items in this order</p>
                  )}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Order Summary
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex justify-between py-2">
                    <span>Items Total:</span>
                    <span>${Number(order?.itemsPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Shipping:</span>
                    <span>${Number(order?.shippingPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>${Number(order?.taxPrice || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold border-t border-gray-200 pt-4">
                    <span>Order Total:</span>
                    <span>${Number(order?.totalPrice || 0).toFixed(2)}</span>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
          
          {/* Order actions */}
          {!order.isPaid && order.orderStatus === 'Pending' && (
            <div className="px-4 py-5 bg-gray-50 text-right sm:px-6">
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={cancellationProcessing}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {cancellationProcessing ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;