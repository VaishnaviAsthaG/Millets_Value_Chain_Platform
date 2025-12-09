const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  getCurrentUser: () => apiRequest('/auth/me'),
};

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/users/${id}`),
  
  update: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getFarmers: () => apiRequest('/users/role/farmers'),
  
  getBuyers: () => apiRequest('/users/role/buyers'),
};

// Listings API
export const listingsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/listings${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/listings/${id}`),
  
  getByQRCode: (qrCode) => apiRequest(`/listings/qr/${qrCode}`),
  
  create: (data) => apiRequest('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiRequest(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiRequest(`/listings/${id}`, {
    method: 'DELETE',
  }),
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/orders/${id}`),
  
  create: (data) => apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateStatus: (id, status) => apiRequest(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Payments API
export const paymentsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiRequest(`/payments/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => apiRequest('/analytics/overview'),
  
  getStateWise: () => apiRequest('/analytics/state-wise'),
  
  getCategoryWise: () => apiRequest('/analytics/category-wise'),
  
  getMonthlyTrends: () => apiRequest('/analytics/monthly-trends'),
};

// Assistant & external data
export const assistantAPI = {
  getFAQs: () => apiRequest('/assistant/faqs'),
  ask: (question) => apiRequest('/assistant/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  }),
  getWeather: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/assistant/weather${queryString ? `?${queryString}` : ''}`);
  },
  getMarketPrice: (millet) => apiRequest(`/assistant/market-price?millet=${encodeURIComponent(millet || '')}`),
};

// Feedback API
export const feedbackAPI = {
  create: (payload) => apiRequest('/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMine: () => apiRequest('/feedback/my'),
};

// Weather API - Using WeatherAPI.com
const WEATHER_API_KEY = '3b0d9c702cdc44cb89a43030250912';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

export const weatherAPI = {
  getCurrentWeather: async (location) => {
    try {
      const response = await fetch(
        `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&aqi=yes`
      );
      if (!response.ok) throw new Error('Weather API request failed');
      return response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  getForecast: async (location, days = 3) => {
    try {
      const response = await fetch(
        `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=${days}&alerts=yes`
      );
      if (!response.ok) throw new Error('Weather API request failed');
      return response.json();
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      throw error;
    }
  },

  getAlerts: async (location) => {
    try {
      const response = await fetch(
        `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&days=3&alerts=yes`
      );
      if (!response.ok) throw new Error('Weather API request failed');
      const data = await response.json();
      return data.alerts?.alert || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  },
};

export default {
  auth: authAPI,
  users: usersAPI,
  listings: listingsAPI,
  orders: ordersAPI,
  payments: paymentsAPI,
  analytics: analyticsAPI,
  weather: weatherAPI,
};

