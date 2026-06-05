import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import StripePayment from "./pages/StripePayment";
import StripeCheckout from "./pages/StripeCheckout";
import MerchantLogin from "./merchant/pages/MerchantLogin";
import MerchantRegister from "./merchant/pages/MerchantRegister";
import MerchantDashboard from "./merchant/pages/MerchantDashboard";
import MerchantProtectedRoute
from "./components/MerchantProtectedRoute";
import CreateCheckoutPage
from "./pages/CreateCheckoutPage";
import HostedCheckout from "./pages/HostedCheckout";
import MerchantCheckouts
from "./merchant/pages/MerchantCheckouts";
import MerchantSettlements
from "./merchant/pages/MerchantSettlements";
import MerchantTransactions
from "./merchant/pages/MerchantTransactions";

import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminLogin from "./pages/AdminLogin";

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
    <BrowserRouter>
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

        <Route
          path="/stripe-test"
          element={<StripePayment />}
        />

        <Route
          path="/checkout"
          element={<StripeCheckout />}
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