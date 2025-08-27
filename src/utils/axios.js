import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-landingpage-zs9q.onrender.com/api", // make sure this matches backend
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
