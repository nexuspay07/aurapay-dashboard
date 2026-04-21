import { createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  function login(token) {
    localStorage.setItem("token", token);
  }

  function logout() {
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}