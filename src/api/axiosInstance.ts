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

/* Wart HALIM */
const currentUrl =
  window.location.protocol + "//" + window.location.hostname + ":8000"; // Replace <NEW_PORT> with the desired port number

const cm_req = axios.create({
  baseURL:
    // window.location.hostname !== "localhost"
    //   ? currentUrl
    //   :
    import.meta.env.VITE_API_URL,
});

cm_req.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const api_key = process.env.REACT_APP_API_KEY;
      config.headers.Authorization = `Api-Key ${api_key}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

cm_req.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Handle unauthorized access - navigate to login page
      localStorage.clear();
      window.location.href = "/session-expired"; // This line will navigate to the login page
    }
    return Promise.reject(error);
  }
);

export { cm_req };

