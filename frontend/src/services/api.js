// API Service Layer — axios instance, interceptors JWT, tất cả API calls
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: tự động đính kèm JWT token ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: xử lý lỗi chung ──
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject({ message, status: error.response?.status, data: error.response?.data });
  }
);

// ══════════════════════════════════════
//  AUTH
// ══════════════════════════════════════
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.put('/auth/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  changePassword: (data) => api.put('/auth/change-password', data),
};

// ══════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getCategories: () => api.get('/categories'),
  getBrands: () => api.get('/brands'),
};

// ══════════════════════════════════════
//  CART
// ══════════════════════════════════════
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart', data),
  updateItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// ══════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders', { params }),
  getDetail: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// ══════════════════════════════════════
//  REVIEWS
// ══════════════════════════════════════
export const reviewAPI = {
  getByProduct: (productId, params) => api.get(`/reviews/${productId}`, { params }),
  create: (data) => api.post('/reviews', data),
};

// ══════════════════════════════════════
//  BLOG
// ══════════════════════════════════════
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
};

// ══════════════════════════════════════
//  WISHLIST
// ══════════════════════════════════════
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  toggle: (product_id) => api.post('/wishlist', { product_id }),
};

// ══════════════════════════════════════
//  VOUCHER & BANNER
// ══════════════════════════════════════
export const voucherAPI = {
  check: (data) => api.post('/vouchers/check', data),
};

export const bannerAPI = {
  getActive: () => api.get('/banners'),
};

// ══════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════
export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getRevenue: (period) => api.get('/admin/dashboard/revenue', { params: { period } }),
  getTopProducts: (limit) => api.get('/admin/dashboard/top-products', { params: { limit } }),
  getRecentOrders: (limit) => api.get('/admin/dashboard/recent-orders', { params: { limit } }),
  getOrderStats: (period) => api.get('/admin/stats/orders-by-status', { params: { period } }),

  // Products
  getProducts: (params) => api.get('/admin/products', { params }),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) {
        if (k === 'images') v.forEach(f => form.append('images', f));
        else if (k === 'variants') form.append(k, JSON.stringify(v));
        else form.append(k, v);
      }
    });
    return api.post('/admin/products', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateProduct: (id, data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined) {
        if (k === 'images') v.forEach(f => form.append('images', f));
        else form.append(k, v);
      }
    });
    return api.put(`/admin/products/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  updateVariant: (productId, variantId, data) => api.put(`/admin/products/${productId}/variants/${variantId}`, data),
  addVariant: (productId, data) => api.post(`/admin/products/${productId}/variants`, data),
  deleteImage: (productId, imgId) => api.delete(`/admin/products/${productId}/images/${imgId}`),
  setMainImage: (productId, imgId) => api.put(`/admin/products/${productId}/images/${imgId}/main`),

  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Brands
  getBrands: () => api.get('/admin/brands'),
  createBrand: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.post('/admin/brands', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateBrand: (id, data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.put(`/admin/brands/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),

  // Inventory
  getInventory: (params) => api.get('/admin/inventory', { params }),
  updateStock: (variantId, data) => api.put(`/admin/inventory/${variantId}`, data),

  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getOrderStats: (period) => api.get('/admin/stats/orders-by-status', { params: { period } }),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id, role_id) => api.put(`/admin/users/${id}/role`, { role_id }),
  getRoles: () => api.get('/admin/roles'),

  // Reviews
  getReviews: (params) => api.get('/admin/reviews', { params }),
  updateReviewStatus: (id, status) => api.put(`/admin/reviews/${id}/status`, { status }),
    createUser: (data) => api.post('/admin/users', data),
  getUserOrders: (id) => api.get(`/admin/users/${id}/orders`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),

  // Blog
  getBlogs: (params) => api.get('/admin/blogs', { params }),
  getBlog: (id) => api.get(`/admin/blogs/${id}`),
  createBlog: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.post('/admin/blogs', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateBlog: (id, data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.put(`/admin/blogs/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),

  // Chatbox
  getConversations: (params) => api.get('/admin/chatbox/conversations', { params }),
  getMessages: (conversationId) => api.get(`/admin/chatbox/${conversationId}/messages`),
  sendMessage: (conversationId, message) => api.post(`/admin/chatbox/${conversationId}/messages`, { message }),

  // Banners
  getBanners: () => api.get('/admin/banners'),
  createBanner: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.post('/admin/banners', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  updateBanner: (id, data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined) form.append(k, v); });
    return api.put(`/admin/banners/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
};

export default api;

export const addressAPI = {
  getAll: () => api.get('/addresses'),
  create: (data) => api.post('/addresses', data),
  update: (id, data) => api.put(`/addresses/${id}`, data),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
};



export const adminVoucherAPI = {
  getAll:  (params) => api.get('/admin/vouchers', { params }),
  create:  (data)   => api.post('/admin/vouchers', data),
  update:  (id, data) => api.put(`/admin/vouchers/${id}`, data),
  delete:  (id)     => api.delete(`/admin/vouchers/${id}`),
  toggle:  (id)     => api.patch(`/admin/vouchers/${id}/toggle`),
};

// Extra admin API helpers (patch)
if (typeof window !== 'undefined') {
  // Patch adminAPI with missing methods at runtime if needed
}
