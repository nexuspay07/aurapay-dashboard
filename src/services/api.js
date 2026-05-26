import axios from "axios";

const API = axios.create({
  baseURL:
    "https://aurapay-backend-qfg0.onrender.com",
});

// ======================================
// AUTO ATTACH TOKENS
// ======================================

API.interceptors.request.use(
  (config) => {
    // USER TOKEN

    const token =
      localStorage.getItem(
        "token"
      );

    // ADMIN TOKEN

    const adminToken =
      localStorage.getItem(
        "adminToken"
      );

    // PRIORITIZE ADMIN TOKEN

    const finalToken =
      adminToken || token;

    if (finalToken) {
      config.headers.Authorization = `Bearer ${finalToken}`;
    }

    return config;
  }
);

export default API;