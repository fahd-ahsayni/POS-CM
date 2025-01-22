import axios from "axios";

const baseURL = window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);

// Export a function to create the API instance
export const createApiInstance = () => api;
