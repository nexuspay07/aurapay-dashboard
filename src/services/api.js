import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("🔥 API URL =", API_URL);

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config) => {
  console.log("➡️ REQUEST:", API_URL + config.url);

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;