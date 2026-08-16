import axios from "axios";
import { handleMerchantUnauthorized } from "../auth/merchantSession";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

API.interceptors.request.use((config) => {
  const merchantToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  const explicitAuthorization = config.headers.Authorization;
  const requestPath = String(config.url || "").replace(/^https?:\/\/[^/]+\//, "");
  const adminRequest =
    /^\/?(?:api\/)?admin(?:-|\/)/.test(requestPath) ||
    /^\/?merchants(?:$|\/(?!register(?:\/|$)))/.test(requestPath);
  let finalToken;

  if (explicitAuthorization) {
    config.authSession = explicitAuthorization === `Bearer ${adminToken}`
      ? "admin"
      : "merchant";
    return config;
  }

  if (adminRequest && adminToken) {
    finalToken = adminToken;
    config.authSession = "admin";
  } else if (merchantToken) {
    finalToken = merchantToken;
    config.authSession = "merchant";
  }

  if (finalToken) {
    config.headers.Authorization = `Bearer ${finalToken}`;
  }

  return config;
});

API.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && error.config?.authSession === "admin") {
    window.dispatchEvent(new Event("admin-session-invalidated"));
  }
  if (error.response?.status === 401 && error.config?.authSession === "merchant") {
    window.dispatchEvent(new Event("merchant-session-invalidated"));
    handleMerchantUnauthorized({
      local: localStorage,
      session: sessionStorage,
      location: window.location,
    });
  }
  return Promise.reject(error);
});

export default API;
