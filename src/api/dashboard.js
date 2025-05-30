import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler with toast
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Something went wrong. Please try again.";

    toast.error(msg); // Remove if you want silent errors
    return Promise.reject(error);
  }
);

// ========== API Endpoints ==========

// Admin Dashboard
export const fetchAdminDashboard = async () => {
  const res = await API.get("/users/dashboard/admin");
  return res.data;
};

// Export your API instance if needed for custom requests
export default API;
