import axios from "axios";

const API = axios.create({
  baseURL: "https://aurapay-backend-qfg0.onrender.com",
});

API.interceptors.request.use((config) => {
  console.log("➡️ REQUEST:", config.baseURL + config.url);

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;