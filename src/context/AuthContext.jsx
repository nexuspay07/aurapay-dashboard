import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [loading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // LOGIN
  async function login(email, password) {
    const res = await API.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const newToken = res.data.token;

    setToken(newToken);

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    return res.data;
  }

  // REGISTER
  async function register(form) {
    const res = await API.post(
      "/auth/register",
      form
    );

    const newToken = res.data.token;

    setToken(newToken);

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    return res.data;
  }

  // LOGOUT
  function logout() {
    setToken(null);

    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}