import axios from "axios";
import toast from "react-hot-toast";

// 👇 Get base URL from Vite environment variable
const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
});

// ✅ Add token to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚫 Global 401 handler: logout and redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
