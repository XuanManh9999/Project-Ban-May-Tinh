import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Product API
export const productAPI = {
  getAll: (page = 0, size = 10) => api.get(`/products?page=${page}&size=${size}`),
  search: (params) => api.get('/products/search', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getRelated: (id, page = 0, size = 8) => api.get(`/products/${id}/related?page=${page}&size=${size}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/add', data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (page = 0, size = 10) => api.get(`/orders/my-orders?page=${page}&size=${size}`),
  getAllOrders: (page = 0, size = 10) => api.get(`/orders/admin/all?page=${page}&size=${size}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status?status=${status}`),
};

// Promotion API
export const promotionAPI = {
  getAll: () => api.get('/promotions'),
  getActive: () => api.get('/promotions/active'),
  getById: (id) => api.get(`/promotions/${id}`),
  getByCode: (code) => api.get(`/promotions/code/${code}`),
  create: (data) => api.post('/promotions', data),
  update: (id, data) => api.put(`/promotions/${id}`, data),
  delete: (id) => api.delete(`/promotions/${id}`),
};

// Payment API
export const paymentAPI = {
  createVNPay: (orderId) => api.post(`/payment/vnpay/create?orderId=${orderId}`),
  verifyVNPay: (params) => api.get('/payment/vnpay-return', { params }),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
};

export default api;

