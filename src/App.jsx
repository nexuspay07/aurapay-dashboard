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
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

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
        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
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

        {/* ADMIN ROUTES */}

        <Route
  path="/admin"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}