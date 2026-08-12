import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

API.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const finalToken = adminToken || token;

  if (finalToken) {
    config.headers.Authorization = `Bearer ${finalToken}`;
  }

  return config;
});

API.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && localStorage.getItem("adminToken")) window.dispatchEvent(new Event("admin-session-invalidated"));
  return Promise.reject(error);
});

export default API;
