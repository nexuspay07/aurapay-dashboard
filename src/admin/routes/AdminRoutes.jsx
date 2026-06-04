import {
  Routes,
  Route,
} from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";
import FraudPage from "../pages/FraudPage";
import AdminsPage from "../pages/AdminsPage";
import MerchantsPage from "../pages/MerchantsPage";
import MerchantKYBPage from "../MerchantKYBPage";
import CheckoutOperationsPage
from "../pages/CheckoutOperationsPage";
import SettlementOperationsPage
from "../pages/SettlementOperationsPage";
import TransactionOperationsPage
from "../pages/TransactionOperationsPage";


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
  path="/settlements"
  element={
    <AdminLayout>
      <SettlementOperationsPage />
    </AdminLayout>
  }
/>

<Route
  path="/transactions"
  element={
    <AdminLayout>
      <TransactionOperationsPage />
    </AdminLayout>
  }
/>

      <Route
  path="/checkouts"
  element={
    <CheckoutOperationsPage />
  }
/>

      <Route
  path="/merchants"
  element={
    <AdminLayout>
      <MerchantsPage />
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
  path="/merchant-kyb"
  element={
    <AdminLayout>
      <MerchantKYBPage />
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