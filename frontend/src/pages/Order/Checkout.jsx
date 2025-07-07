import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder } from '../../services/orderService';
import { AppContent } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { userData } = useContext(AppContent);
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  
  // Form values
  const [shippingAddress, setShippingAddress] = useState({
    fullName: userData?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phoneNumber: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart.items.length, navigate]);
  
  // Price calculations
  const itemsPrice = cart.totalPrice;
  const shippingPrice = 5.00;
  const taxPrice = Number((0.08 * cart.totalPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  
  // Handle shipping form changes
  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };
  
  // Move to next step
  const nextStep = () => {
    if (step === 1) {
      // Validate shipping form
      const { fullName, address, city, postalCode, country, phoneNumber } = shippingAddress;
      if (!fullName || !address || !city || !postalCode || !country || !phoneNumber) {
        toast.error('Please fill all shipping fields');
        return;
      }
    }
    
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  // Move to previous step
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  // Place order
  const placeOrder = async () => {
    setIsLoading(true);
    
    // Create order data object
    const orderData = {
      orderItems: cart.items.map(item => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        category: item.category,
        fabricMeasurement: item.fabricMeasurement
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    };
    
    try {
      const response = await createOrder(orderData);
      
      if (response.success) {
        clearCart();
        navigate(`/order-success/${response.order._id}`);
      } else {
        toast.error(response.message || 'Failed to place order');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Checkout Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex-1 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  <span className="font-semibold">1</span>
                </div>
                <span className="ml-2 font-medium">Shipping</span>
              </div>
            </div>
            <div className={`flex-1 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  <span className="font-semibold">2</span>
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
            <div className={`flex-1 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= 3 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}>
                  <span className="font-semibold">3</span>
                </div>
                <span className="ml-2 font-medium">Review</span>
              </div>
            </div>
          </div>
          <div className="mt-2 mx-10">
            <div className="flex justify-between">
              <div className="w-1/3 bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className={`bg-blue-600 h-full ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="w-1/3 bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className={`bg-blue-600 h-full ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={shippingAddress.phoneNumber}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="postalCode">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="country">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleShippingChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
            
            <div className="space-y-4">
              {['Credit Card', 'Cash on Delivery', 'Bank Transfer'].map((method) => (
                <div key={method} className="flex items-center">
                  <input
                    type="radio"
                    id={method}
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <label htmlFor={method} className="ml-3 text-gray-700">
                    {method}
                  </label>
                </div>
              ))}
            </div>
            
            {paymentMethod === 'Credit Card' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800">
                  Note: Credit card payment will be processed at delivery time.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-medium"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
              
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Summary */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            {/* Shipping Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><span className="font-medium">Name:</span> {shippingAddress.fullName}</p>
                <p><span className="font-medium">Phone:</span> {shippingAddress.phoneNumber}</p>
                <p>
                  <span className="font-medium">Address:</span> {shippingAddress.address}, {shippingAddress.city},
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment Method</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p>{paymentMethod}</p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.product + item.fabricMeasurement} className="py-3 flex justify-between">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
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
                      <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Order Total */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Price Details</h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <p>Items Total:</p>
                  <p>${itemsPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping:</p>
                  <p>${shippingPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax:</p>
                  <p>${taxPrice.toFixed(2)}</p>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <p>Order Total:</p>
                  <p>${totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-medium"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
              
              <button
                type="button"
                onClick={placeOrder}
                disabled={isLoading}
                className={`flex items-center ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 px-6 rounded-md font-medium`}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" /> Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;