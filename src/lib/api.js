// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API utility functions
export const api = {
    // Base URL for all API calls
    baseURL: API_BASE_URL,
    
    // Generic request function
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // Chat API
    async chat(message, context = {}) {
        return this.request('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message, context }),
        });
    },

    // FAQ API
    async getFAQ() {
        return this.request('/api/faq');
    },

    // Fraud detection API
    async detectFraud(data) {
        return this.request('/api/fraud/detect', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Financial analysis API
    async analyzeFinancialHealth(data) {
        return this.request('/api/financial/analyze', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Insurance claim API
    async submitClaim(data) {
        return this.request('/api/claims/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Security analysis API
    async analyzeSecurity(data) {
        return this.request('/api/security/analyze', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Policy underwriting API
    async performUnderwriting(data) {
        return this.request('/api/policies/underwriting', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Add policy API
    async addPolicy(data) {
        return this.request('/api/policies', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Get recommendations API
    async getRecommendations(data) {
        return this.request('/api/recommendations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Investment security analysis API
    async analyzeInvestmentSecurity(data) {
        return this.request('/api/investment/security-analysis', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Health check API
    async healthCheck() {
        return this.request('/api/health');
    },
};

export default api; 