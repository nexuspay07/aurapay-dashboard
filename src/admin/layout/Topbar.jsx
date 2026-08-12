import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { EnvironmentBadge } from "../components/AdminUI";

const titles = { merchants: "Merchant Operations", "merchant-kyb": "Merchant KYB", settlements: "Settlement Operations", users: "User Operations", transactions: "Transaction Operations", fraud: "Fraud Center", audit: "Audit Logs", analytics: "Analytics", providers: "Providers", admins: "Admin Management", settings: "Settings" };
export default function Topbar() {
  const location = useLocation(); const navigate = useNavigate(); const { adminUser, logoutAdmin } = useAdminAuth();
  const segment = location.pathname.split("/")[2]; const context = titles[segment] || "Operations Overview";
  function logout() { logoutAdmin(); navigate("/admin-login", { replace: true }); }
  const identity = adminUser?.displayName || adminUser?.email || "Administrator";
  return <header className="admin-topbar"><div className="admin-topbar__context"><strong>{context}</strong><span>AuraPay Sandbox operations</span></div><div className="admin-topbar__right"><EnvironmentBadge /><div className="admin-identity" title={identity}><span className="admin-avatar" aria-hidden="true">{identity[0]?.toUpperCase() || "A"}</span><div className="admin-identity__text"><strong>{identity}</strong><span>{adminUser?.role?.replaceAll("_", " ")}</span></div></div><button type="button" className="admin-logout" onClick={logout}>Logout</button></div></header>;
}
