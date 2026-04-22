import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await API.get("/user/me");
      setUser(res.data);
    } catch (err) {
      console.log("Load user failed:", err?.response?.data || err.message);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);

    await loadUser();
    return res.data;
  }

  async function register(email, password) {
    await API.post("/auth/register", { email, password });
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  async function refreshUser() {
    await loadUser();
  }

  useEffect(() => {
    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}