import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productService';
import { toast } from 'react-toastify';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'product',
    quantity: 0,
    color: '',
    fabricType: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Placeholder SVG as a base64-encoded data URL
  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189e737a323%20text%20%7B%20fill%3A%23bfbfbf%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189e737a323%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2295.5%22%20y%3D%22107.1%22%3EInvalid%20Image%20URL%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.success) {
          const product = response.data;
          setFormData({
            name: product.name || '',
            price: product.price || '',
            image: product.image || '',
            category: product.category || 'product',
            quantity: product.quantity || 0,
            color: product.color || '',
            fabricType: product.fabricType || '',
            description: product.description || ''
          });
          // Set preview image if image URL exists
          if (product.image) {
            setPreviewImage(product.image);
          }
        } else {
          setError(response.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    if (formData.quantity === '' || isNaN(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a number';
    }
    
    // Fabric-specific validations
    if (formData.category === 'fabric') {
      if (!formData.color.trim()) newErrors.color = 'Color is required for fabrics';
      if (!formData.fabricType.trim()) newErrors.fabricType = 'Fabric type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Update image preview when image URL changes
    if (name === 'image' && value.trim()) {
      setPreviewImage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Convert price and quantity to numbers for the API
      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };
      
      const response = await updateProduct(id, productData);
      
      if (response.success) {
        toast.success('Product updated successfully');
        navigate('/inventory');
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while updating the product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-lg mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/inventory')}
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <button 
            onClick={() => navigate('/products')}
            className="text-gray-600 hover:text-gray-900"
          >
            Back to Products
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Product Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Product Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="product">Product</option>
              <option value="fabric">Fabric</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
          
          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price * {formData.category === 'fabric' && <span className="text-sm text-gray-500">(per meter)</span>}
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          
          {/* Quantity */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Products with less than 10 items will be marked as low stock.
            </p>
          </div>
          
          {/* Fabric-specific fields */}
          {formData.category === 'fabric' && (
            <>
              <div className="mb-4">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.color ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="e.g., Red, Blue, Green"
                />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-500">{errors.color}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="fabricType" className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric Type *
                </label>
                <input
                  type="text"
                  id="fabricType"
                  name="fabricType"
                  value={formData.fabricType}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.fabricType ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="e.g., Cotton, Silk, Polyester"
                />
                {errors.fabricType && (
                  <p className="mt-1 text-sm text-red-500">{errors.fabricType}</p>
                )}
              </div>
            </>
          )}
          
          {/* Description (optional) */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-xs text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter product description..."
            ></textarea>
          </div>
          
          {/* Image URL */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>
          
          {/* Image Preview */}
          {previewImage && (
            <div className="mb-4">
              <p className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </p>
              <div className="border border-gray-300 rounded-md p-2 mt-1 bg-gray-50">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-h-48 mx-auto object-contain"
                  onError={(e) => {
                    // Replace with inline SVG placeholder instead of external service
                    e.target.onerror = null; // Prevent infinite callbacks
                    e.target.src = placeholderImage;
                    
                    // Show error message when image fails to load
                    toast.error('Invalid image URL or image not accessible');
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;