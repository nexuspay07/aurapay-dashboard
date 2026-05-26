import {
  Routes,
  Route,
} from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import FraudPage from "../pages/FraudPage";
import AdminsPage from "../pages/AdminsPage";

// DASHBOARD
import AdminDashboard from "../../pages/AdminDashboard";

import AuditPage from "../pages/AuditPage";

// ENTERPRISE PAGES
import UsersPage from "../pages/UsersPage";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* ====================================== */}
      {/* OVERVIEW */}
      {/* ====================================== */}

      <Route
        path="/"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />

      {/* ====================================== */}
      {/* USERS */}
      {/* ====================================== */}

      <Route
        path="/users"
        element={
          <AdminLayout>
            <UsersPage />
          </AdminLayout>
        }
      />

      <Route
  path="/fraud"
  element={
    <AdminLayout>
      <FraudPage />
    </AdminLayout>
  }
/>

<Route
  path="/admins"
  element={
    <AdminLayout>
      <AdminsPage />
    </AdminLayout>
  }
/>

<Route
  path="/audit"
  element={
    <AdminLayout>
      <AuditPage />
    </AdminLayout>
  }
/>
    </Routes>
  );
}