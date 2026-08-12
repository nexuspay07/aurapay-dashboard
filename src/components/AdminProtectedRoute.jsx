import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({ children }) {
  const { adminToken, loading } = useAdminAuth();

  if (loading) return <div style={{ padding: 24 }}>Validating admin session...</div>;

  if (!adminToken) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    );
  }

  return children;
}
