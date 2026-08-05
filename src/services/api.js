import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
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

export default API;
