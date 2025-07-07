import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get cart items array safely
  const cartItems = cart?.items || [];
  
  // Get calculated values directly from cart object
  const subtotal = cart?.totalPrice || 0;
  
  // Calculate shipping cost (free over $100, otherwise $10)
  const shippingCost = subtotal > 100 ? 0 : 10;
  
  // Calculate tax (10%)
  const taxAmount = subtotal * 0.1;
  
  // Calculate total
  const total = subtotal + shippingCost + taxAmount;

  const handleQuantityChange = (productId, newQuantity, fabricMeasurement = null) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity, fabricMeasurement);
  };

  const handleRemoveItem = (productId, fabricMeasurement = null) => {
    removeFromCart(productId, fabricMeasurement);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FiShoppingCart className="mr-2" />
            Shopping Cart
          </h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
            <FiArrowLeft className="mr-1" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <FiShoppingCart className="h-16 w-16 text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h2>
              <p className="mt-2 text-sm text-gray-500">
                Looks like you haven't added any products to your cart yet.
              </p>
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.product} className="p-4 flex sm:items-center flex-col sm:flex-row">
                      <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 relative">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                      <div className="sm:ml-6 flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-0">
                        <div>
                          <Link to={`/products/${item.product}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
                            {item.name}
                          </Link>
                          {item.category === 'fabric' && (
                            <p className="mt-1 text-sm text-gray-500">
                              Measurement: {item.fabricMeasurement} meters
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            ${item.price.toFixed(2)} {item.category === 'fabric' && 
                            `(${item.quantity} × ${item.fabricMeasurement} meters × $${item.price.toFixed(2)} = $${(item.price * item.quantity * item.fabricMeasurement).toFixed(2)})`}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center">
                          <div className="flex border border-gray-300 rounded">
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none"
                              onClick={() => handleQuantityChange(item.product, item.quantity - 1, item.fabricMeasurement)}
                            >
                              -
                            </button>
                            <input
                              type="text"
                              className="w-12 text-center border-l border-r border-gray-300"
                              value={item.quantity}
                              readOnly
                            />
                            <button
                              type="button"
                              className="p-2 text-gray-600 hover:text-gray-700 focus:outline-none"
                              onClick={() => handleQuantityChange(item.product, item.quantity + 1, item.fabricMeasurement)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="ml-4 text-red-600 hover:text-red-800 focus:outline-none"
                            onClick={() => handleRemoveItem(item.product, item.fabricMeasurement)}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="text-gray-900 font-medium">${subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="text-gray-900 font-medium">${shippingCost.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (10%)</p>
                    <p className="text-gray-900 font-medium">${taxAmount.toFixed(2)}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="text-lg font-bold text-gray-900">Total</p>
                    <p className="text-lg font-bold text-gray-900">${total.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || loading}
                    className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Free shipping on orders over $100</li>
                        <li>30-day easy returns</li>
                        <li>Satisfaction guaranteed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;