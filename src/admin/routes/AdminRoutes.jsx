import { Route, Routes } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../../pages/AdminDashboard";
import FraudPage from "../pages/FraudPage";
import AdminsPage from "../pages/AdminsPage";
import MerchantsPage from "../pages/MerchantsPage";
import MerchantKYBPage from "../MerchantKYBPage";
import SettlementOperationsPage from "../pages/SettlementOperationsPage";
import TransactionOperationsPage from "../pages/TransactionOperationsPage";
import AuditPage from "../pages/AuditPage";
import UsersPage from "../pages/UsersPage";
import { DeferredAdminPage } from "../components/AdminUI";

export default function AdminRoutes() {
  return <Routes><Route element={<AdminLayout />}><Route index element={<AdminDashboard />} /><Route path="merchants" element={<MerchantsPage />} /><Route path="merchant-kyb" element={<MerchantKYBPage />} /><Route path="settlements" element={<SettlementOperationsPage />} /><Route path="transactions" element={<TransactionOperationsPage />} /><Route path="users" element={<UsersPage />} /><Route path="fraud" element={<FraudPage />} /><Route path="audit" element={<AuditPage />} /><Route path="admins" element={<AdminsPage />} /><Route path="analytics" element={<DeferredAdminPage title="Analytics" phase="Phase 4" description="Advanced reporting and cross-environment analytics are intentionally deferred." />} /><Route path="providers" element={<DeferredAdminPage title="Providers" phase="Phase 5" description="Provider health and credential management are not available in Sandbox Beta." />} /><Route path="settings" element={<DeferredAdminPage title="Settings" phase="Phase 5" description="Production platform controls remain locked during Sandbox Beta." />} /></Route></Routes>;
}
