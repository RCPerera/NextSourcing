import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { CartContext } from '../../context/CartContext';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get cart context for adding products
  const { addToCart } = useContext(CartContext);
  
  // Filtering and sorting states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [colorFilter, setColorFilter] = useState('');
  const [fabricTypeFilter, setFabricTypeFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // UI state for displaying a mobile filter panel
  const [showFilters, setShowFilters] = useState(false);
  
  // State for fabric measurement modal
  const [showFabricModal, setShowFabricModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fabricMeasurement, setFabricMeasurement] = useState(1);

  const fetchProducts = async (applyFilters = true) => {
    setIsLoading(true);
    try {
      // Build query params based on filters
      const params = {};
      
      if (applyFilters) {
        if (activeCategory !== 'all') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        if (sort) params.sort = sort;
        if (activeCategory === 'fabric') {
          if (colorFilter) params.color = colorFilter;
          if (fabricTypeFilter) params.fabricType = fabricTypeFilter;
        }
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
      }
      
      const response = await getProducts(params);
      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sort]); // Refetch when category or sort changes
  
  // Handle form submission for search and filters
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSort('newest');
    setColorFilter('');
    setFabricTypeFilter('');
    setMinPrice('');
    setMaxPrice('');
    fetchProducts(false);
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
            onClick={() => fetchProducts()}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Products Catalog</h1>
        </div>

        {/* Category Navigation */}
        <div className="mb-6 border-b pb-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveCategory('all')}
            >
              All Products
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'fabric' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveCategory('fabric')}
            >
              Fabrics
            </button>
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${activeCategory === 'product' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => setActiveCategory('product')}
            >
              Products
            </button>
          </div>
        </div>

        {/* Filters and Search Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded mb-2 md:mb-0 md:hidden"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {/* Search Form */}
            <form onSubmit={handleFilterSubmit} className="flex flex-1 max-w-lg">
              <input
                type="text"
                placeholder="Search products"
                className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r"
              >
                Search
              </button>
            </form>
            
            {/* Sort Dropdown */}
            <div className="mt-2 md:mt-0 md:ml-4">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Filters - Visible on larger screens or when toggled */}
          <div className={`bg-white p-4 rounded-lg border ${(showFilters || window.innerWidth >= 768) ? 'block' : 'hidden'}`}>
            <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-gray-300 rounded-l w-1/2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <span className="px-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-gray-300 rounded-r w-1/2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              
              {/* Fabric-specific filters - only show when fabric category is active */}
              {activeCategory === 'fabric' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by color"
                      className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={colorFilter}
                      onChange={(e) => setColorFilter(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabric Type
                    </label>
                    <input
                      type="text"
                      placeholder="Filter by fabric type"
                      className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={fabricTypeFilter}
                      onChange={(e) => setFabricTypeFilter(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              {/* Filter Buttons */}
              <div className={`flex items-end ${activeCategory === 'fabric' ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${product._id}`}>
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderImage;
                      }}
                    />
                    <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded ${
                      product.category === 'fabric' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {product.category === 'fabric' ? 'Fabric' : 'Product'}
                    </span>
                    
                    {/* Out of stock badge */}
                    {product.quantity < 10 && (
                      <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {product.quantity === 0 ? 'Out of stock' : 'Low stock'}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 text-gray-800 truncate">
                    <Link to={`/products/${product._id}`} className="hover:text-purple-600">
                      {product.name}
                    </Link>
                  </h2>
                  
                  {/* Display price differently based on category */}
                  <p className="text-gray-700 font-bold mb-2">
                    ${product.price.toFixed(2)}
                    {product.category === 'fabric' && <span className="text-sm font-normal">/meter</span>}
                  </p>
                  
                  {/* Fabric-specific details */}
                  {product.category === 'fabric' && (
                    <div className="mb-3 text-sm text-gray-500">
                      <p>Color: {product.color}</p>
                      <p>Type: {product.fabricType}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded text-sm"
                    >
                      <FiEye className="inline-block mr-1" /> View Details
                    </Link>
                    <button
                      onClick={() => {
                        if (product.category === 'fabric') {
                          // For fabric products, show modal to get measurement
                          setSelectedProduct(product);
                          setFabricMeasurement(1); // Reset to 1 meter default
                          setShowFabricModal(true);
                        } else {
                          // For regular products, add directly
                          addToCart(product);
                          toast.success(`${product.name} added to cart`);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
                    >
                      <FiShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Fabric Measurement Modal */}
        {showFabricModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
              <h3 className="text-lg font-semibold mb-4">Select Fabric Length</h3>
              <p className="mb-4">How many meters of {selectedProduct.name} do you want?</p>
              
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > 0) {
                        setFabricMeasurement(value);
                      }
                    }}
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
                  Total: ${(selectedProduct.price * fabricMeasurement).toFixed(2)}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowFabricModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct, 1, fabricMeasurement);
                    toast.success(`${selectedProduct.name} (${fabricMeasurement} meters) added to cart`);
                    setShowFabricModal(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;