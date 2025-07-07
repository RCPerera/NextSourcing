import React, { useState, useEffect, useContext } from 'react';
import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';

const ProductManagement = () => {
    const { backendUrl } = useContext(AppContent);
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        category: 'product',
        image: '',
        color: '',
        fabricType: '',
        status: 'available'
    });

    // Fetch products
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/products`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.products || data.data);
            } else {
                toast.error(data.message || 'Failed to fetch products');
            }
        } catch (error) {
            toast.error('Failed to fetch products');
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'quantity' ? parseFloat(value) || '' : value
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Product added successfully');
                setShowAddModal(false);
                fetchProducts();
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    category: 'product',
                    image: '',
                    color: '',
                    fabricType: '',
                    status: 'available'
                });
            } else {
                toast.error(data.message || 'Failed to add product');
            }
        } catch (error) {
            toast.error('Failed to add product');
            console.error('Add error:', error);
        }
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/products/${selectedProduct._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Product updated successfully');
                setShowEditModal(false);
                fetchProducts();
            } else {
                toast.error(data.message || 'Failed to update product');
            }
        } catch (error) {
            toast.error('Failed to update product');
            console.error('Update error:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${backendUrl}/api/products/${productId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    toast.success('Product deleted successfully');
                    fetchProducts();
                } else {
                    toast.error(data.message || 'Failed to delete product');
                }
            } catch (error) {
                toast.error('Failed to delete product');
                console.error('Delete error:', error);
            }
        }
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            quantity: product.quantity,
            category: product.category || 'product',
            image: product.image || '',
            color: product.color || '',
            fabricType: product.fabricType || '',
            status: product.status || 'available'
        });
        setShowEditModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Product Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                    <FiPackage className="mr-2" />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                className="h-full w-full object-cover" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                }}
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-200">
                                                <FiPackage className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${product.quantity > 0 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {product.quantity > 0 ? 'Available' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
                            <form onSubmit={handleAddProduct} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        step="1"
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="product">Product</option>
                                        <option value="fabric">Fabric</option>
                                    </select>
                                </div>

                                {formData.category === 'fabric' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
                                            <input
                                                type="text"
                                                name="color"
                                                value={formData.color}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Fabric Type</label>
                                            <input
                                                type="text"
                                                name="fabricType"
                                                value={formData.fabricType}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Add Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900">Edit Product</h3>
                            <form onSubmit={handleEditProduct} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                        step="1"
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    >
                                        <option value="product">Product</option>
                                        <option value="fabric">Fabric</option>
                                    </select>
                                </div>

                                {formData.category === 'fabric' && (
                                    <>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Color</label>
                                            <input
                                                type="text"
                                                name="color"
                                                value={formData.color}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">Fabric Type</label>
                                            <input
                                                type="text"
                                                name="fabricType"
                                                value={formData.fabricType}
                                                onChange={handleInputChange}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Update Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;