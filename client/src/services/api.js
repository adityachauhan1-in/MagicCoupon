
 
import axios from "axios";

const API_ROOT = (process.env.REACT_APP_API_BASE_URL || "https://magiccoupon-backend.onrender.com").replace(/^["']|["']$/g, '');

export const api = axios.create({ baseURL: API_ROOT });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

console.log("API Root in frontend is:", API_ROOT);

// Auth
export const getMe = () => api.get(`/auth/me`).then(r => r.data);
export const login = (payload) => api.post(`/auth/login`, payload).then(r => r.data);
export const signup = (payload) => api.post(`/auth/signup`, payload).then(r => r.data);

// Coupons public
export const getAllCoupons = () => api.get(`/api/coupons?limit=100`).then(r => r.data);
export const searchCoupons = (q) => api.get(`/api/coupons/search`, { params: { q } }).then(r => r.data);
export const getCouponById = (id) => api.get(`/api/coupons/${id}`).then(r => r.data);
export const getCouponsByCategory = (category) => api.get(`/api/coupons/category/${encodeURIComponent(category)}`).then(r => r.data);
export const getCategoriesList = () => api.get(`/api/coupons/categories/list`).then(r => r.data);

// Coupons (auth)  for creating , updating and deleting coupon 
export const createCoupon = (payload) => api.post(`/api/coupons`, payload).then(r => r.data);
export const updateCoupon = (id, payload) => api.put(`/api/coupons/${id}`, payload).then(r => r.data);
export const deleteCoupon = (id) => api.delete(`/api/coupons/${id}`).then(r => r.data);

// Fix getMyCreatedCoupons to handle errors properly
export const getMyCreatedCoupons = async () => {
  try {
    console.log(" Making API call to /api/coupons/my-create");
    const response = await api.get(`/api/coupons/my-create`);
    console.log(" API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" API Error details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const redeemCoupon = (id) => api.post(`/api/coupons/redeem/${id}`).then(r => r.data);
    
// Saved coupons
export const saveCoupon = (couponId) => api.post(`/api/coupons/save`, { couponId }).then(r => r.data);
export const getSavedCoupons = () => api.get(`/api/coupons/saved/list`).then(r => r.data);
export const removeSavedCoupon = (couponOrSavedId) => api.delete(`/api/coupons/saved/${couponOrSavedId}`).then(r => r.data);
export const markSavedCouponUsed = (couponOrSavedId) => api.put(`/api/coupons/saved/${couponOrSavedId}/use`).then(r => r.data);