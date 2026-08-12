import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import API from "../services/api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken") || null
  );
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function validateSession() {
      if (!adminToken) { if (active) { setAdminUser(null); setLoading(false); } return; }
      setLoading(true);
      try {
        const response = await API.get("/admin-auth/me", { headers: { Authorization: `Bearer ${adminToken}` } });
        const admin = response.data?.data?.admin;
        if (!admin) throw new Error("Invalid admin session");
        if (active) { setAdminUser(admin); localStorage.setItem("adminUser", JSON.stringify(admin)); }
      } catch {
        if (active) { setAdminToken(null); setAdminUser(null); localStorage.removeItem("adminToken"); localStorage.removeItem("adminUser"); }
      } finally { if (active) setLoading(false); }
    }
    validateSession();
    return () => { active = false; };
  }, [adminToken]);

  useEffect(() => {
    function invalidateSession() { setAdminToken(null); setAdminUser(null); localStorage.removeItem("adminToken"); localStorage.removeItem("adminUser"); }
    window.addEventListener("admin-session-invalidated", invalidateSession);
    return () => window.removeEventListener("admin-session-invalidated", invalidateSession);
  }, []);

  useEffect(() => {
    if (adminToken) {
      localStorage.setItem("adminToken", adminToken);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  const loginAdmin = (token, admin = null) => {
    setAdminToken(token);
    setAdminUser(admin);
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem("adminUser");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminToken,
        loginAdmin,
        logoutAdmin,
        adminUser,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      "useAdminAuth must be used inside AdminAuthProvider"
    );
  }

  return context;
}
