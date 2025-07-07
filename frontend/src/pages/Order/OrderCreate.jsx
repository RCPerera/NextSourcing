import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../../services/orderService';
import { FiPlus, FiMinus, FiTrash2, FiSave } from 'react-icons/fi';

const OrderCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([
    { product: '', quantity: 1, price: 0 }
  ]);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka'
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This would normally come from your product service
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...orderItems];
    
    if (name === 'product') {
      const selectedProduct = products.find(p => p._id === value);
      updatedItems[index] = {
        ...updatedItems[index],
        product: value,
        price: selectedProduct ? selectedProduct.price : 0
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [name]: name === 'quantity' ? parseInt(value) : value
      };
    }
    
    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { product: '', quantity: 1, price: 0 }]);
  };

  const removeOrderItem = (index) => {
    if (orderItems.length > 1) {
      const updatedItems = orderItems.filter((_, i) => i !== index);
      setOrderItems(updatedItems);
    } else {
      toast.warning('Order must have at least one item');
    }
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      toast.error('Please fill all required customer fields');
      return;
    }
    
    // Validate order items
    const invalidItems = orderItems.filter(item => !item.product || item.quantity < 1);
    if (invalidItems.length > 0) {
      toast.error('Please select products and quantities for all order items');
      return;
    }
    
    setLoading(true);
    
    const orderData = {
      customer,
      orderItems: orderItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country
      },
      totalPrice: calculateTotal()
    };
    
    try {
      const response = await createOrder(orderData);
      if (response.success) {
        toast.success('Order created successfully');
        navigate(`/order-success/${response.order._id}`);
      } else {
        toast.error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('An error occurred while creating the order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Order</h1>
        <p className="text-gray-600">Enter order details below</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={customer.city}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={customer.postalCode}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={customer.country}
                onChange={handleCustomerChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order Items</h2>
            <button
              type="button"
              onClick={addOrderItem}
              className="bg-blue-600 text-white py-2 px-4 rounded-md flex items-center"
            >
              <FiPlus className="mr-1" /> Add Item
            </button>
          </div>

          {orderItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 mb-4 items-center border-b pb-4">
              <div className="col-span-5">
                <label className="block text-gray-700 mb-1">Product *</label>
                <select
                  name="product"
                  value={item.product}
                  onChange={(e) => handleProductChange(index, e)}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="">-- Select Product --</option>
                  {products.map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleProductChange(index, e)}
                  min="1"
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="col-span-3">
                <label className="block text-gray-700 mb-1">Price</label>
                <div className="font-medium">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="col-span-2 flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => removeOrderItem(index)}
                  className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end border-t pt-4">
            <div className="text-xl font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-3 px-6 rounded-md flex items-center font-medium"
          >
            {loading ? 'Processing...' : (
              <>
                <FiSave className="mr-2" /> Create Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderCreate;