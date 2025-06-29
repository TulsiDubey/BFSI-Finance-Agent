import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
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
    if (error.response) {
      // Server responded with error status
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error setting up request:', error.message);
    }
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
  detectFraud: (userProfile) => api.post('/fraud/detect', { userProfile }),
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
  analyzeDocuments: (formData) => {
    return api.post('/claims/analyze-documents', formData, {
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

// Chat APIs - Fixed to match backend endpoint
export const chatAPI = {
  sendMessage: (message, context = {}) => {
    // Prepare the request payload
    const payload = {
      message: message,
      history: context.conversationHistory || [],
      user_profile: context.userProfile || {}
    };
    
    return api.post('/chat', payload);
  },
  getChatHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

// Policy APIs - New endpoints for AddPolicy component
export const policyAPI = {
  // Get all policies for a user
  getPolicies: () => api.get('/policies'),
  
  // Get a specific policy
  getPolicy: (id) => api.get(`/policies/${id}`),
  
  // Add a new policy
  addPolicy: (policyData) => api.post('/policies', policyData),
  
  // Update an existing policy
  updatePolicy: (id, policyData) => api.put(`/policies/${id}`, policyData),
  
  // Delete a policy
  deletePolicy: (id) => api.delete(`/policies/${id}`),
  
  // Upload documents for policy
  uploadDocument: (formData) => {
    return api.post('/policies/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Perform dynamic underwriting and risk assessment
  performUnderwriting: (data) => api.post('/policies/underwriting', data),
  
  // Get underwriting history
  getUnderwritingHistory: () => api.get('/policies/underwriting/history'),
  
  // Get policy recommendations based on user profile
  getPolicyRecommendations: (userProfile) => api.post('/policies/recommendations', { userProfile }),
  
  // Calculate premium based on risk factors
  calculatePremium: (policyData) => api.post('/policies/calculate-premium', policyData),
  
  // Validate policy data
  validatePolicy: (policyData) => api.post('/policies/validate', policyData),
};

// Investment Security Analysis APIs
export const investmentSecurityAPI = {
  // Analyze investment security based on investment details and user profile
  analyzeInvestmentSecurity: (investmentDetails, userProfile) => 
    api.post('/investment/security-analysis', {
      investment_details: investmentDetails,
      user_profile: userProfile
    }),
  
  // Get investment analysis history
  getAnalysisHistory: () => api.get('/investment/security-analysis/history'),
  
  // Compare multiple investments
  compareInvestments: (investments, userProfile) => 
    api.post('/investment/compare', {
      investments: investments,
      user_profile: userProfile
    }),
  
  // Get investment recommendations based on security analysis
  getSecureRecommendations: (userProfile) => 
    api.post('/investment/secure-recommendations', { userProfile }),
};

export default api; 