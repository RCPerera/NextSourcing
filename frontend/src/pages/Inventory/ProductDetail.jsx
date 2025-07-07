import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [fabricMeasurement, setFabricMeasurement] = useState(1); // Add fabric measurement state
  
  // Get cart context for adding products
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getProductById(id);
        
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.message || 'Failed to fetch product details');
        }
      } catch (err) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };

  // Handle fabric measurement change
  const handleMeasurementChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value > 0) {
      setFabricMeasurement(value);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      if (product.category === 'fabric') {
        // For fabric products, pass the fabric measurement
        addToCart(product, quantity, fabricMeasurement);
        toast.success(`${product.name} (${fabricMeasurement} meters) added to cart`);
      } else {
        // For regular products
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart`);
      }
    }
  };

  // Placeholder SVG for image errors
  const placeholderImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_189e737a323%20text%20%7B%20fill%3A%23bfbfbf%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A15pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_189e737a323%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23eeeeee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22112.5%22%20y%3D%22107.1%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Product not found</p>
          <Link to="/products" className="text-blue-600 hover:underline">Return to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="p-6 bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-96 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    product.category === 'fabric' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {product.category === 'fabric' ? 'Fabric' : 'Product'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                  {product.category === 'fabric' && <span className="text-sm text-gray-600">/meter</span>}
                </div>
              </div>
              
              {/* Stock status */}
              <div className="mt-4">
                <p className="text-sm font-medium">
                  Availability: 
                  {product.quantity > 0 ? (
                    <span className={`ml-2 ${product.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                      {product.quantity < 10 ? `Low Stock (${product.quantity} left)` : 'In Stock'}
                    </span>
                  ) : (
                    <span className="ml-2 text-red-600">Out of Stock</span>
                  )}
                </p>
              </div>
              
              {/* Product details */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Product Details</h3>
                
                {/* Fabric specific details */}
                {product.category === 'fabric' && (
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="font-medium">Color:</span> {product.color}
                    </div>
                    <div>
                      <span className="font-medium">Fabric Type:</span> {product.fabricType}
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div className="mb-6">
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-gray-600">{product.description || 'No description available.'}</p>
                </div>
                
                {/* Add to cart section */}
                {product.quantity > 0 && (
                  <div className="mt-8">
                    <div className="mb-4">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity:
                      </label>
                      <div className="flex items-center">
                        <button 
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l"
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          value={quantity}
                          onChange={handleQuantityChange}
                          min="1"
                          max={product.quantity}
                          className="border-t border-b border-gray-300 text-center w-16 py-1"
                        />
                        <button 
                          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r"
                          onClick={() => quantity < product.quantity && setQuantity(quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Fabric Measurement Input */}
                    {product.category === 'fabric' && (
                      <div className="mb-4">
                        <label htmlFor="measurement" className="block text-sm font-medium text-gray-700 mb-1">
                          Fabric Length (meters):
                        </label>
                        <div className="flex items-center">
                          <button 
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-l"
                            onClick={() => fabricMeasurement > 0.5 && setFabricMeasurement(prev => Math.round((prev - 0.5) * 10) / 10)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            id="measurement"
                            value={fabricMeasurement}
                            onChange={handleMeasurementChange}
                            min="0.5"
                            step="0.5"
                            className="border-t border-b border-gray-300 text-center w-16 py-1"
                          />
                          <button 
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-r"
                            onClick={() => setFabricMeasurement(prev => Math.round((prev + 0.5) * 10) / 10)}
                          >
                            +
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          Total: ${(product.price * fabricMeasurement).toFixed(2)}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={handleAddToCart}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center"
                      >
                        <FiShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                      <Link 
                        to="/cart" 
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;