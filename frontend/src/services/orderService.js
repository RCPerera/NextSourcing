import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Add a request interceptor to include token in all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Always include credentials
    config.withCredentials = true;
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If needed, you could add token refresh logic here
      
      // For now, we'll just redirect to login if auth fails
      console.error('Authentication error detected');
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Get all orders (admin)
export const getAllOrders = async (params = {}) => {
  try {
    const { 
      startDate, 
      endDate, 
      limit, 
      page,
      sort, 
      direction,
      status, 
      isPaid, 
      isDelivered, 
      search 
    } = params;
    
    let queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (limit) queryParams.append('limit', limit);
    if (page) queryParams.append('page', page);
    if (sort) queryParams.append('sort', sort);
    if (direction) queryParams.append('direction', direction);
    if (status) queryParams.append('status', status);
    if (isPaid !== undefined) queryParams.append('isPaid', isPaid);
    if (isDelivered !== undefined) queryParams.append('isDelivered', isDelivered);
    if (search) queryParams.append('search', search);
    
    const response = await axios.get(`${API_URL}/orders?${queryParams.toString()}`);
    
    return { 
      success: true, 
      orders: response.data.orders,
      totalCount: response.data.count || response.data.orders.length,
      currentPage: response.data.currentPage || 1,
      totalPages: response.data.totalPages || 1
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch orders',
      orders: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 1
    };
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${id}`);
    
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch order details' 
    };
  }
};

// Update order status (admin)
export const updateOrderStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${id}/status`,
      { status }
    );
    
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update order status' 
    };
  }
};

// Mark order as delivered (admin)
export const markOrderAsDelivered = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${id}/deliver`,
      {}
    );
    
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to mark order as delivered' 
    };
  }
};

// Get order statistics (admin)
export const getOrderStatistics = async (params = {}) => {
  try {
    const { startDate, endDate } = params;
    
    let queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const response = await axios.get(`${API_URL}/orders/statistics?${queryParams.toString()}`);
    
    return { success: true, stats: response.data };
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch order statistics' 
    };
  }
};

// Get order stats for income reporting
export const getOrderStats = async (params = {}) => {
  try {
    const { startDate, endDate, period } = params;
    
    let queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (period) queryParams.append('period', period);
    
    const response = await axios.get(`${API_URL}/orders/income?${queryParams.toString()}`);
    
    return { success: true, stats: response.data };
  } catch (error) {
    console.error('Error fetching order income stats:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch order income statistics' 
    };
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    // Token check is no longer needed here since it's handled by the interceptor
    console.log('Creating order...');
    console.log('Order data:', JSON.stringify(orderData, null, 2));
    
    const response = await axios.post(
      `${API_URL}/orders`, 
      orderData,
      {
        headers: { 
          'Content-Type': 'application/json'
        },
        // Ensure credentials are included with this request
        withCredentials: true
      }
    );
    
    console.log('Order creation successful:', response.data);
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.response) {
      console.error('Server response error data:', error.response.data);
      console.error('Server response status:', error.response.status);
      
      if (error.response.status === 401) {
        // Redirect to login page with return URL
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
        return {
          success: false,
          message: 'Authentication required. Please log in.'
        };
      }
      
      if (error.response.status === 400) {
        return { 
          success: false, 
          message: error.response.data.message || 'Invalid order data',
          errors: error.response.data.errors 
        };
      }
      
      return { 
        success: false, 
        message: error.response.data.message || error.response.data.error || 'Failed to create order'
      };
    } else if (error.request) {
      console.error('No response received from server. Network issue?');
      return { 
        success: false, 
        message: 'Unable to connect to server. Please check your internet connection.'
      };
    } else {
      console.error('Error setting up request:', error.message);
      return { 
        success: false, 
        message: 'Error setting up request: ' + error.message
      };
    }
  }
};

// Get user's orders (for regular users)
export const getUserOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/myorders`);
    
    return { success: true, orders: response.data.orders };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch your orders' 
    };
  }
};

// Cancel order
export const cancelOrder = async (id, cancelReason) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${id}/cancel`,
      { cancelReason }
    );
    
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to cancel order' 
    };
  }
};

// Pay for an order
export const payOrder = async (orderId, paymentDetails) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/pay`,
      paymentDetails
    );
    
    return { success: true, order: response.data.order };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to process payment' 
    };
  }
};

// Get total price summation of all orders (admin)
export const getTotalPriceSummation = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/total-price-summation`);
    
    return { 
      success: true, 
      totalAmount: response.data.totalAmount,
      orderCount: response.data.orderCount
    };
  } catch (error) {
    console.error('Error fetching total price summation:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch total price summation',
      totalAmount: 0,
      orderCount: 0
    };
  }
};