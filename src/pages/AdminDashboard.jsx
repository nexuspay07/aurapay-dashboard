import usePermission from "../hooks/usePermission";

import AdminSection from "../components/admin/AdminSection";

export default function AdminDashboard() {
  const {
    role,
    hasPermission,
    adminUser,
  } = usePermission();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: 32,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          marginBottom: 32,
        }}
      >
        <h1
          style={{
            fontSize: 38,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          AuraPay Admin
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: 18,
          }}
        >
          Signed in as{" "}
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

      {/* USER MANAGEMENT */}

      {hasPermission("user:view") && (
        <AdminSection title="User Management">
          <p>
            View users, freeze accounts,
            manage onboarding, and
            investigate activity.
          </p>
        </AdminSection>
      )}

      {/* WALLET MANAGEMENT */}

      {hasPermission("wallet:view") && (
        <AdminSection title="Wallet Management">
          <p>
            Monitor balances, liquidity,
            and wallet operations.
          </p>
        </AdminSection>
      )}

      {/* TRANSACTIONS */}

      {hasPermission(
        "transaction:view"
      ) && (
        <AdminSection title="Transactions">
          <p>
            Monitor transfers, approvals,
            reversals, and routing data.
          </p>
        </AdminSection>
      )}

      {/* FRAUD */}

      {hasPermission("fraud:view") && (
        <AdminSection title="Fraud Monitoring">
          <p>
            Review suspicious activity,
            freeze users, and inspect
            fraud signals.
          </p>
        </AdminSection>
      )}

      {/* AUDIT */}

      {hasPermission("audit:view") && (
        <AdminSection title="Audit Logs">
          <p>
            Access admin actions,
            compliance logs, and
            system-level changes.
          </p>
        </AdminSection>
      )}

      {/* ANALYTICS */}

      {hasPermission(
        "analytics:view"
      ) && (
        <AdminSection title="Analytics">
          <p>
            Real-time operational metrics,
            provider performance, and
            system insights.
          </p>
        </AdminSection>
      )}
    </div>
  );
}