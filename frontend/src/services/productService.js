import axios from 'axios';

// Create an axios instance with consistent configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // Set to true to include cookies with requests
});

// Add an interceptor to include Authorization header if token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Ensure content type is set for requests with body
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Add response interceptor to handle errors consistently
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Optional: Handle unauthorized error (e.g., redirect to login)
      console.error('Authentication error in product service:', error.response?.data?.message || 'Unauthorized');
    }
    return Promise.reject(error);
  }
);

const API_URL = '/api/products';

// Get all products with optional filtering and sorting
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get(API_URL, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch products' };
  }
};

// Get products filtered by category
export const getProductsByCategory = async (category, params = {}) => {
  try {
    const queryParams = { ...params, category };
    const response = await api.get(API_URL, { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: `Failed to fetch ${category} products` };
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch product' };
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await api.post(API_URL, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create product' };
  }
};

// Update an existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`${API_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update product' };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete product' };
  }
};

// Search products
export const searchProducts = async (searchQuery, params = {}) => {
  try {
    const queryParams = { ...params, search: searchQuery };
    const response = await api.get(API_URL, { params: queryParams });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Search failed' };
  }
};