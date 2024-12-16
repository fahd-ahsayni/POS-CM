import axios, { AxiosInstance } from 'axios';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;

// Function to create an Axios instance with dynamic headers
export const createApiInstance = (baseURL: string, useApiKey: boolean, token?: string): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (useApiKey) {
    headers['Authorization'] = `Api-Key ${VITE_API_KEY}`;
  } else if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL,
    headers,
  });
};


// Function to handle login
export const login = async (apiInstance: AxiosInstance, username: string, password: string) => {
  try {
    const response = await apiInstance.post(import.meta.env.VITE_LOGIN_URL, { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
