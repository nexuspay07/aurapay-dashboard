import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import MerchantDashboard
from "./merchant/pages/MerchantDashboard";
import MerchantSettings
from "./merchant/pages/MerchantSettings";
import MerchantAnalytics
from "./merchant/pages/MerchantAnalytics";
import DeveloperApiKeys from "./merchant/pages/DeveloperApiKeys";
import DeveloperApplications from "./merchant/pages/DeveloperApplications";
import DeveloperApplicationDetail from "./merchant/pages/DeveloperApplicationDetail";
import DeveloperWebhooks from "./merchant/pages/DeveloperWebhooks";
import DeveloperApiLogs from "./merchant/pages/DeveloperApiLogs";
import DeveloperDocumentation from "./merchant/pages/DeveloperDocumentation";

import MerchantProfile
from "./merchant/pages/MerchantProfile";

import MerchantTransactions
from "./merchant/pages/MerchantTransactions";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import MerchantLogin from "./merchant/pages/MerchantLogin";
import MerchantRegister from "./merchant/pages/MerchantRegister";
import MerchantProtectedRoute
from "./components/MerchantProtectedRoute";
import CreateCheckoutPage
from "./pages/CreateCheckoutPage";
import HostedCheckout from "./pages/HostedCheckout";
import MerchantCheckouts
from "./pages/MerchantCheckouts";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ResendVerification from "./pages/ResendVerification";

import MerchantSettlements
from "./pages/MerchantSettlements";

import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import AdminInvitation from "./pages/AdminInvitation";
import { AdminForgotPassword, AdminResetPassword } from "./pages/AdminPasswordAccess";

// NEW ENTERPRISE ADMIN ROUTES
import AdminRoutes from "./admin/routes/AdminRoutes";

function ProtectedRoute({ children }) {
  const { token, loading } =
    useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        Loading...
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}



export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <Routes>
        {/* ====================================== */}
        {/* PUBLIC ROUTES */}
        {/* ====================================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
  path="/merchant/transactions"
  element={
    <MerchantProtectedRoute>
      <MerchantTransactions />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/settings"
  element={
    <MerchantProtectedRoute>
      <MerchantSettings />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/analytics"
  element={
    <MerchantProtectedRoute>
      <MerchantAnalytics />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/pay/:sessionId"
  element={<HostedCheckout />}
/>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
  path="/merchant/settlements"
  element={
    <MerchantProtectedRoute>
      <MerchantSettlements />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

<Route
  path="/verify-email/:token"
  element={<VerifyEmail />}
/>

<Route
  path="/resend-verification-email"
  element={<ResendVerification />}
/>

        <Route
  path="/merchant/checkouts"
  element={
    <MerchantProtectedRoute>
      <MerchantCheckouts />
    </MerchantProtectedRoute>
  }
/>

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />
        <Route path="/admin-invitation/:token" element={<AdminInvitation />} />
        <Route path="/admin-forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin-reset-password/:token" element={<AdminResetPassword />} />

        <Route
  path="/merchant/login"
  element={<MerchantLogin />}
/>

<Route
  path="/merchant/register"
  element={<MerchantRegister />}
/>

        {/* ====================================== */}
        {/* USER ROUTES */}
        {/* ====================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/merchant/create-checkout"
  element={
    <MerchantProtectedRoute>
      <CreateCheckoutPage />
    </MerchantProtectedRoute>
  }
/>

        <Route
          path="/onboarding"
          element={<Onboarding />}
        />

        {/* ====================================== */}
{/* MERCHANT ROUTES */}
{/* ====================================== */}

<Route
  path="/merchant/dashboard"
  element={
    <MerchantProtectedRoute>
      <MerchantDashboard />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/analytics"
  element={
    <MerchantProtectedRoute>
      <MerchantAnalytics />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/profile"
  element={
    <MerchantProtectedRoute>
      <MerchantProfile />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/api-keys"
  element={
    <MerchantProtectedRoute>
      <DeveloperApiKeys />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/applications"
  element={
    <MerchantProtectedRoute>
      <DeveloperApplications />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/applications/:id"
  element={
    <MerchantProtectedRoute>
      <DeveloperApplicationDetail />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/webhooks"
  element={
    <MerchantProtectedRoute>
      <DeveloperWebhooks />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/api-logs"
  element={
    <MerchantProtectedRoute>
      <DeveloperApiLogs />
    </MerchantProtectedRoute>
  }
/>

<Route
  path="/merchant/developer/documentation"
  element={
    <MerchantProtectedRoute>
      <DeveloperDocumentation />
    </MerchantProtectedRoute>
  }
/>

        {/* ====================================== */}
        {/* ENTERPRISE ADMIN ROUTES */}
        {/* ====================================== */}

        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminRoutes />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
