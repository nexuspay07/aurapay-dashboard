import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import usePermission from "../hooks/usePermission";

import AdminSection from "../components/admin/AdminSection";
import StatCard from "../components/admin/StatCard";

import Transactions from "./Transactions";

export default function AdminDashboard() {
  const {
    role,
    hasPermission,
    adminUser,
  } = usePermission();

  const [metrics, setMetrics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // LOAD LIVE METRICS
  // ======================================

  async function loadMetrics() {
    try {
      const res = await API.get(
        "/admin/metrics"
      );

      setMetrics(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();

    // AUTO REFRESH EVERY 15s

    const interval =
      setInterval(() => {
        loadMetrics();
      }, 15000);

    return () =>
      clearInterval(interval);
  }, []);

  if (loading || !metrics) {
    return (
      <div
        style={{
          padding: 40,
        }}
      >
        Loading operations...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 32,
      }}
    >
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div
        style={{
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            marginBottom: 10,
            color: "#111827",
          }}
        >
          Operations Command Center
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: 18,
          }}
        >
          Welcome back{" "}
          <strong>
            {adminUser?.email}
          </strong>
        </p>

        <div
          style={{
            marginTop: 12,
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 999,
            background: "#111827",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {role}
        </div>
      </div>

      {/* ====================================== */}
      {/* LIVE METRICS */}
      {/* ====================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <StatCard
          title="Total Users"
          value={
            metrics.totalUsers
          }
          subtitle="Platform accounts"
        />

        <StatCard
          title="Frozen Users"
          value={
            metrics.frozenUsers
          }
          subtitle="Restricted accounts"
        />

        <StatCard
          title="Transactions"
          value={
            metrics.totalTransactions
          }
          subtitle="Processed payments"
        />

        <StatCard
          title="Fraud Alerts"
          value={
            metrics.fraudAlerts
          }
          subtitle="Suspicious events"
        />

        <StatCard
          title="Success Rate"
          value={`${metrics.successRate}%`}
          subtitle="Routing performance"
        />

        <StatCard
          title="Volume"
          value={`$${metrics.totalVolume}`}
          subtitle="Total payment volume"
        />

        <StatCard
          title="Refunds"
          value={
            metrics.refundedTransactions
          }
          subtitle="Charge reversals"
        />

        <StatCard
          title="Completed"
          value={
            metrics.completedTransactions
          }
          subtitle="Successful payments"
        />
      </div>

      {/* ====================================== */}
      {/* USER MANAGEMENT */}
      {/* ====================================== */}

      {hasPermission("user:view") && (
        <AdminSection title="User Management">
          <p>
            View platform users,
            freeze accounts,
            manage onboarding,
            and monitor customer
            activity.
          </p>
        </AdminSection>
      )}

      {/* ====================================== */}
      {/* LIVE TRANSACTIONS */}
      {/* ====================================== */}

      {hasPermission(
        "transaction:view"
      ) && (
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <Transactions />
        </div>
      )}

      {/* ====================================== */}
      {/* FRAUD */}
      {/* ====================================== */}

      {hasPermission("fraud:view") && (
        <AdminSection title="Fraud Command Center">
          <p>
            Review suspicious
            activity, risk alerts,
            account abuse, and
            system anomalies.
          </p>
        </AdminSection>
      )}

      {/* ====================================== */}
      {/* AUDIT */}
      {/* ====================================== */}

      {hasPermission("audit:view") && (
        <AdminSection title="Audit & Compliance">
          <p>
            Access immutable admin
            logs, compliance
            history, operational
            records, and
            system-level actions.
          </p>
        </AdminSection>
      )}

      {/* ====================================== */}
      {/* ANALYTICS */}
      {/* ====================================== */}

      {hasPermission(
        "analytics:view"
      ) && (
        <AdminSection title="Enterprise Analytics">
          <p>
            View operational
            metrics, provider
            uptime, transaction
            intelligence, and
            ecosystem performance.
          </p>
        </AdminSection>
      )}
    </div>
  );
}