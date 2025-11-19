import axios from 'axios';

export const setupAxiosInterceptors = () => {
  // Request interceptor - Add auth token to all requests except login/signup
  axios.interceptors.request.use(
    (config) => {
      // Don't add token to login/signup requests
      const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/auth/signup');
      
      if (!isAuthRequest) {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle auth errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        console.log('Authentication failed - clearing local storage');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userType');
        localStorage.removeItem('profileCompleted');
        
        // Clear session storage as well
        sessionStorage.removeItem('profileStep1');
        
        // Only redirect to login if not already on login/signup pages
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};