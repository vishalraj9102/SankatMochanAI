import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Accept all status codes less than 500
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure CORS headers are set
    config.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh');
        const { access_token } = response.data;

        // Update the token in cookies
        Cookies.set('token', access_token, { expires: 7 });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear the token and redirect to login
        Cookies.remove('token');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

async function get<T>(url: string, config?: any): Promise<T> {
  const response = await api.get<T>(url, config);
  return response.data;
}

async function post<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.post<T>(url, data, config);
  return response.data;
}

async function put<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.put<T>(url, data, config);
  return response.data;
}

async function del<T>(url: string, config?: any): Promise<T> {
  const response = await api.delete<T>(url, config);
  return response.data;
}

async function patch<T>(url: string, data?: any, config?: any): Promise<T> {
  const response = await api.patch<T>(url, data, config);
  return response.data;
}

export const apiService = {
  get,
  post,
  put,
  del,
  patch,
}; 