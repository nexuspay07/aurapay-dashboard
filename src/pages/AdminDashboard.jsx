import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [message, setMessage] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [adminAllowed, setAdminAllowed] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  function getRiskSeverity(score) {
    const risk = Number(score || 0);

    if (risk >= 80) {
      return {
        label: "CRITICAL",
        background: "#7f1d1d",
        color: "#fff",
      };
    }

    if (risk >= 60) {
      return {
        label: "HIGH",
        background: "#dc2626",
        color: "#fff",
      };
    }

    if (risk >= 40) {
      return {
        label: "MEDIUM",
        background: "#f59e0b",
        color: "#111",
      };
    }

    return {
      label: "LOW",
      background: "#dcfce7",
      color: "#166534",
    };
  }

  async function loadAdminData() {
    try {
      const [usersRes, txRes, ledgerRes, fraudRes, auditRes] =
  await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/transactions"),
        API.get("/admin/ledger"),
        API.get("/admin/fraud-logs"),
        API.get("/admin/audit-logs"),
      ]);

      setUsers(usersRes.data);
      setTransactions(txRes.data);
      setLedger(ledgerRes.data);
      setFraudLogs(fraudRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Failed to load admin data");
    }
  }

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        await API.get("/admin/test");

        setAdminAllowed(true);

        await loadAdminData();
      } catch (err) {
        setAdminAllowed(false);

        setMessage(
          err?.response?.data?.error || "Admin access required"
        );
      } finally {
        setCheckingAdmin(false);
      }
    }

    checkAdminAccess();
  }, []);

  async function freezeUser(userId) {
    const reason = prompt("Reason for freezing this user?");

    if (!reason) return;

    try {
      await API.post(`/admin/users/${userId}/freeze`, {
        reason,
        hours: 24,
      });

      setMessage("✅ User frozen");

      loadAdminData();
    } catch (err) {
      setMessage(err?.response?.data?.error || "Freeze failed");
    }
  }

  async function unfreezeUser(userId) {
    try {
      await API.post(`/admin/users/${userId}/unfreeze`);

      setMessage("✅ User unfrozen");

      loadAdminData();
    } catch (err) {
      setMessage(err?.response?.data?.error || "Unfreeze failed");
    }
  }

  async function refundTransaction(tx) {
    const confirmRefund = window.confirm(
      `Refund ${tx.amount} ${String(tx.currency || "").toUpperCase()}?`
    );

    if (!confirmRefund) return;

    try {
      const reason = prompt("Refund reason?") || "admin_refund";

      const res = await API.post(`/payments/refund/${tx._id}`, {
        reason,
      });

      const refundId =
        res?.data?.providerRefund?.refundId || null;

      setMessage(
        refundId
          ? `✅ Refund completed. Refund ID: ${refundId}`
          : "✅ Refund completed"
      );

      await loadAdminData();

      setSelectedTx(null);
    } catch (err) {
      setMessage(err?.response?.data?.error || "Refund failed");
    }
  }

  if (checkingAdmin) {
    return (
      <div style={page}>
        <h2>Checking admin access...</h2>
      </div>
    );
  }

  if (!adminAllowed) {
    return (
      <div style={page}>
        <div style={card}>
          <h2>Access Denied</h2>

          <p>
            You do not have permission to access the admin
            dashboard.
          </p>

          {message && <div style={alert}>{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <h1>Admin Operations Dashboard</h1>

      {message && <div style={alert}>{message}</div>}

      <div style={tabs}>
        <button
          style={tab(activeTab === "transactions")}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </button>

        <button
          style={tab(activeTab === "users")}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>

        <button
          style={tab(activeTab === "ledger")}
          onClick={() => setActiveTab("ledger")}
        >
          Ledger
        </button>

        <button
          style={tab(activeTab === "fraud")}
          onClick={() => setActiveTab("fraud")}
        >
          Fraud Logs
        </button>
      </div>

      <button
  style={tab(activeTab === "audit")}
  onClick={() => setActiveTab("audit")}
>
  Audit Logs
</button>

      {activeTab === "transactions" && (
        <section style={card}>
          <h2>All Transactions</h2>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Amount</th>
                <th style={th}>Currency</th>
                <th style={th}>Provider</th>
                <th style={th}>Status</th>
                <th style={th}>Date</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td style={td}>
                    {tx.user?.email || "-"}
                  </td>

                  <td style={td}>{tx.amount}</td>

                  <td style={td}>
                    {String(tx.currency || "").toUpperCase()}
                  </td>

                  <td style={td}>
                    {tx.provider || "-"}
                  </td>

                  <td style={td}>
                    {tx.status || "-"}
                  </td>

                  <td style={td}>
                    {tx.createdAt
                      ? new Date(
                          tx.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  <td style={td}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <button
                        style={neutralButton}
                        onClick={() => setSelectedTx(tx)}
                      >
                        View Audit
                      </button>

                      {tx.status === "completed" && (
                        <button
                          style={dangerButton}
                          onClick={() =>
                            refundTransaction(tx)
                          }
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeTab === "audit" && (
  <section style={card}>
    <h2>Admin Audit Logs</h2>

    <table style={table}>
      <thead>
        <tr>
          <th style={th}>Admin</th>
          <th style={th}>Action</th>
          <th style={th}>Target User</th>
          <th style={th}>Transaction</th>
          <th style={th}>Metadata</th>
          <th style={th}>IP</th>
          <th style={th}>Date</th>
        </tr>
      </thead>

      <tbody>
        {auditLogs.map((log) => (
          <tr key={log._id}>
            <td style={td}>
              {log.admin?.email || "-"}
            </td>

            <td style={td}>
              {log.action}
            </td>

            <td style={td}>
              {log.targetUser?.email || "-"}
            </td>

            <td style={td}>
              {log.transaction?._id || "-"}
            </td>

            <td style={td}>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </td>

            <td style={td}>
              {log.ipAddress || "-"}
            </td>

            <td style={td}>
              {log.createdAt
                ? new Date(log.createdAt).toLocaleString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)}

          {selectedTx && (
            <div style={auditBox}>
              <h3>Transaction Audit</h3>

              <Info
                label="Transaction ID"
                value={selectedTx._id}
              />

              <Info
                label="User"
                value={selectedTx.user?.email || "-"}
              />

              <Info
                label="Provider"
                value={selectedTx.provider}
              />

              <Info
                label="Status"
                value={selectedTx.status}
              />

              <button
                style={neutralButton}
                onClick={() => setSelectedTx(null)}
              >
                Close
              </button>
            </div>
          )}
        </section>
      )}

      {activeTab === "users" && (
        <section style={card}>
          <h2>Users</h2>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Frozen</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={td}>{user.email}</td>

                  <td style={td}>
                    {user.role || "user"}
                  </td>

                  <td style={td}>
                    {user.status || "-"}
                  </td>

                  <td style={td}>
                    {user.frozen ? "Yes" : "No"}
                  </td>

                  <td style={td}>
                    {user.frozen ? (
                      <button
                        style={goodButton}
                        onClick={() =>
                          unfreezeUser(user._id)
                        }
                      >
                        Unfreeze
                      </button>
                    ) : (
                      <button
                        style={dangerButton}
                        onClick={() =>
                          freezeUser(user._id)
                        }
                      >
                        Freeze
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "ledger" && (
        <section style={card}>
          <h2>Ledger Entries</h2>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Type</th>
                <th style={th}>Account</th>
                <th style={th}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {ledger.map((entry) => (
                <tr key={entry._id}>
                  <td style={td}>
                    {entry.user?.email || "-"}
                  </td>

                  <td style={td}>{entry.type}</td>

                  <td style={td}>{entry.account}</td>

                  <td style={td}>{entry.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === "fraud" && (
        <section style={card}>
          <h2>Fraud Logs</h2>

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Risk</th>
                <th style={th}>Decision</th>
                <th style={th}>Severity</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {fraudLogs.map((log) => {
                const severity = getRiskSeverity(
                  log.riskScore
                );

                return (
                  <tr key={log._id}>
                    <td style={td}>
                      {log.user?.email || "-"}
                    </td>

                    <td style={td}>
                      {log.riskScore}
                    </td>

                    <td style={td}>
                      {log.decision}
                    </td>

                    <td style={td}>
                      <span
                        style={{
                          padding: "5px 10px",
                          borderRadius: 999,
                          background:
                            severity.background,
                          color: severity.color,
                          fontWeight: 700,
                        }}
                      >
                        {severity.label}
                      </span>
                    </td>

                    <td style={td}>
                      {log.riskScore >= 60 ? (
                        <button
                          style={dangerButton}
                          onClick={() =>
                            freezeUser(log.user?._id)
                          }
                        >
                          Freeze User
                        </button>
                      ) : (
                        <span
                          style={{
                            color: "#666",
                          }}
                        >
                          Monitoring
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>

      <strong>{String(value)}</strong>
    </div>
  );
}

const page = {
  padding: 24,
  background: "#f5f7fb",
  minHeight: "100vh",
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  border: "1px solid #ddd",
  overflowX: "auto",
};

const tabs = {
  display: "flex",
  gap: 10,
  marginBottom: 20,
};

const tab = (active) => ({
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: active ? "#111827" : "#fff",
  color: active ? "#fff" : "#111827",
  cursor: "pointer",
});

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: 10,
  borderBottom: "1px solid #ddd",
};

const td = {
  padding: 10,
  borderBottom: "1px solid #eee",
};

const alert = {
  padding: 12,
  borderRadius: 8,
  background: "#fef3c7",
  marginBottom: 12,
};

const dangerButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#991b1b",
  color: "#fff",
  cursor: "pointer",
};

const goodButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#166534",
  color: "#fff",
  cursor: "pointer",
};

const neutralButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const auditBox = {
  marginTop: 20,
  padding: 16,
  borderRadius: 12,
  background: "#f9fafb",
  border: "1px solid #ddd",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
};

const infoLabel = {
  color: "#666",
};