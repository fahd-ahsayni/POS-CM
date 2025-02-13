import axios from "axios";

const baseURL = window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

const user = JSON.parse(localStorage.getItem("user") || "{}");

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && user.position !== "waiter") {
      window.location.href = "/session-expired";
    }
    return Promise.reject(error);
  }
);

export const createApiInstance = () => api;
