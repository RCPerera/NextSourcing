import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrderById } from '../../services/orderService';
import { FiSearch, FiChevronDown, FiChevronUp, FiUpload } from 'react-icons/fi';

const OrderReturns = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [returnItems, setReturnItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
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
        // Verify that the order can be returned (delivered within 14 days)
        const order = response.order;
        const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : null;
        const currentDate = new Date();
        const daysSinceDelivery = deliveredDate 
          ? Math.floor((currentDate - deliveredDate) / (1000 * 60 * 60 * 24))
          : null;
          
        if (!deliveredDate) {
          toast.error('This order has not been delivered yet and cannot be returned');
          setOrder(null);
        } else if (daysSinceDelivery > 14) {
          toast.error('Returns must be initiated within 14 days of delivery');
          setOrder(null);
        } else {
          setOrder(order);
          // Initialize return items with quantities set to 0
          setReturnItems(order.orderItems.map(item => ({
            ...item,
            returnQuantity: 0,
            selected: false
          })));
        }
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

  const handleReturnQuantityChange = (index, value) => {
    const newQuantity = parseInt(value);
    const updatedItems = [...returnItems];
    const maxQuantity = updatedItems[index].quantity;
    
    updatedItems[index].returnQuantity = Math.min(Math.max(0, newQuantity), maxQuantity);
    updatedItems[index].selected = updatedItems[index].returnQuantity > 0;
    
    setReturnItems(updatedItems);
  };

  const handleCheckboxChange = (index) => {
    const updatedItems = [...returnItems];
    updatedItems[index].selected = !updatedItems[index].selected;
    
    if (updatedItems[index].selected && updatedItems[index].returnQuantity === 0) {
      updatedItems[index].returnQuantity = updatedItems[index].quantity;
    } else if (!updatedItems[index].selected) {
      updatedItems[index].returnQuantity = 0;
    }
    
    setReturnItems(updatedItems);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.warning('You can upload a maximum of 5 images');
      return;
    }
    
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newFiles]);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedItems = returnItems.filter(item => item.selected && item.returnQuantity > 0);
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to return');
      return;
    }
    
    if (!returnReason) {
      toast.error('Please select a return reason');
      return;
    }
    
    setSubmitting(true);
    
    // Prepare formData
    const formData = new FormData();
    formData.append('orderId', order._id);
    formData.append('returnReason', returnReason);
    formData.append('returnDescription', returnDescription);
    formData.append('items', JSON.stringify(selectedItems));
    
    images.forEach(image => {
      formData.append('images', image.file);
    });
    
    try {
      // This would be implemented in your services
      // await createOrderReturn(formData);
      
      // Simulate successful return request
      setTimeout(() => {
        setSubmitting(false);
        toast.success('Return request submitted successfully');
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Error submitting return request:', error);
      toast.error('Failed to submit return request');
      setSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Return Items</h1>
          <p className="text-gray-600">Initiate a return for your order</p>
        </div>

        {/* Search Form */}
        {!order && (
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
                      <FiSearch className="mr-2" /> Find Order
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-sm text-gray-600">
              <p className="font-medium">Return Policy:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Returns must be initiated within 14 days of delivery</li>
                <li>Items must be in original condition, unworn, and with tags attached</li>
                <li>Certain items like customized products may not be eligible for return</li>
                <li>Refunds are processed within 5-7 business days after return is approved</li>
              </ul>
            </div>
          </div>
        )}

        {/* Return Form */}
        {order && (
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Order #{order._id}</h2>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm text-blue-600 font-medium cursor-pointer" onClick={() => setOrder(null)}>
                  Change Order
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Select Items to Return</h3>
              
              <div className="space-y-6">
                {returnItems.map((item, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-6">
                        <input
                          type="checkbox"
                          id={`item-${index}`}
                          checked={item.selected}
                          onChange={() => handleCheckboxChange(index)}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="w-16 h-16 bg-gray-100 rounded"></div>
                      <div className="flex-grow">
                        <div className="font-medium">{item.product?.name || 'Product'}</div>
                        <div className="text-gray-500 text-sm">${item.price.toFixed(2)} each</div>
                      </div>
                      <div className="w-32">
                        <label className="block text-sm text-gray-600 mb-1">Return Qty</label>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={item.returnQuantity}
                          onChange={(e) => handleReturnQuantityChange(index, e.target.value)}
                          disabled={!item.selected}
                          className="w-full border rounded-md px-3 py-1"
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Max: {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Return Reason */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Return Information</h3>
              
              <div className="mb-5">
                <label className="block text-gray-700 mb-2">
                  Return Reason *
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full border rounded-md px-4 py-2"
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="Wrong size">Wrong size</option>
                  <option value="Defective item">Defective item</option>
                  <option value="Not as described">Not as described</option>
                  <option value="Damaged in shipping">Damaged in shipping</option>
                  <option value="Changed mind">Changed mind</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="mb-5">
                <label className="block text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  className="w-full border rounded-md px-4 py-2 h-32"
                  placeholder="Please provide additional details about your return request"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">
                  Upload Images (optional, max 5)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={images.length >= 5}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      Upload photos of damaged or defective items
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {images.length}/5 images uploaded
                    </p>
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Select Images
                    </button>
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white py-3 px-6 rounded-md font-medium"
              >
                {submitting ? 'Submitting...' : 'Submit Return Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrderReturns;