import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
};

// Profile APIs
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  createProfile: (profileData) => api.post('/profile', profileData),
};

// Learning APIs
export const learningAPI = {
  getModules: () => api.get('/learning/modules'),
  getModule: (id) => api.get(`/learning/modules/${id}`),
  completeModule: (id) => api.post(`/learning/modules/${id}/complete`),
  getProgress: () => api.get('/learning/progress'),
};

// Fraud Detection APIs
export const fraudAPI = {
  detectFraud: (transactionData) => api.post('/fraud/detect', transactionData),
  getFraudHistory: () => api.get('/fraud/history'),
};

// Security Analysis APIs
export const securityAPI = {
  analyzeFile: (formData) => {
    return api.post('/security/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAnalysisHistory: () => api.get('/security/history'),
};

// Insurance Claim APIs
export const claimAPI = {
  submitClaim: (formData) => {
    return api.post('/claims/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getClaims: () => api.get('/claims'),
  getClaim: (id) => api.get(`/claims/${id}`),
  updateClaim: (id, data) => api.put(`/claims/${id}`, data),
};

// Recommendation APIs
export const recommendationAPI = {
  getRecommendations: (userProfile) => api.post('/recommendations', { userProfile }),
  getPersonalizedRecommendations: () => api.get('/recommendations/personalized'),
};

// Chat APIs
export const chatAPI = {
  sendMessage: (message) => api.post('/chat/message', { message }),
  getChatHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

export default api; 