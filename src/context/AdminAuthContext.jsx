import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  function adminLogin(token) {
    setAdminToken(token);
  }

  function adminLogout() {
    setAdminToken(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}