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

  const [user, setUser] = useState(() => {
    const saved =
      localStorage.getItem("user");

    return saved
      ? JSON.parse(saved)
      : null;
  });

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        "token",
        token
      );
    } else {
      localStorage.removeItem(
        "token"
      );
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(
        "user"
      );
    }
  }, [user]);

  async function refreshUser() {
    try {
      const res = await API.get(
        "/auth/me"
      );

      setUser(res.data);
    } catch (err) {
      console.log(
        "Failed to refresh user:",
        err.message
      );
    }
  }

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}