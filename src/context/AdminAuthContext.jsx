import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      setAdminToken(token);
    }

    setAdminLoading(false);
  }, []);

  function adminLogin(token) {
    localStorage.setItem("adminToken", token);
    setAdminToken(token);
  }

  function adminLogout() {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  }

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        adminLoading,
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