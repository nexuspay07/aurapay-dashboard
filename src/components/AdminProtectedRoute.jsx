import { Navigate } from "react-router-dom";

import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProtectedRoute({
  children,
}) {
  const {
    adminToken,
    adminLoading,
  } = useAdminAuth();

  if (adminLoading) {
    return (
      <div style={{ padding: 24 }}>
        Loading admin...
      </div>
    );
  }

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