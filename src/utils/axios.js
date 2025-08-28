import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://battlegroundbackend-project.onrender.com/api", // Your backend URL
});

// Add cache-busting to prevent 304 responses
axiosInstance.interceptors.request.use((config) => {
  // Add timestamp to prevent caching for GET requests
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _t: Date.now(), // This will prevent caching
    };
  }
  
  // Add auth token
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;