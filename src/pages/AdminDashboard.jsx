

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
      const [usersRes, txRes, ledgerRes, fraudRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/transactions"),
        API.get("/admin/ledger"),
        API.get("/admin/fraud-logs"),
      ]);

      setUsers(usersRes.data);
      setTransactions(txRes.data);
      setLedger(ledgerRes.data);
      setFraudLogs(fraudRes.data);
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

      const res = await API.post(`/payments/refund/${tx._id}`, { reason });

      const refundId = res?.data?.providerRefund?.refundId || null;

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

  function getLedgerForTransaction(txId) {
    return ledger.filter((entry) => {
      const entryTxId =
        typeof entry.transaction === "string"
          ? entry.transaction
          : entry.transaction?._id;

      return String(entryTxId) === String(txId);
    });
  }

  function getAccountingSummary(txId) {
    const entries = getLedgerForTransaction(txId);

    const debitTotal = entries
      .filter((entry) =>
        ["debit", "refund", "reversal"].includes(entry.type)
      )
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    const creditTotal = entries
      .filter((entry) => entry.type === "credit")
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

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

    return {
      balanced: debitTotal === creditTotal,
      debitTotal,
      creditTotal,
      difference: debitTotal - creditTotal,
      entriesCount: entries.length,
    };
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
        <p>You do not have permission to access the admin dashboard.</p>
        {message && <div style={alert}>{message}</div>}
      </div>
    </div>
  );
}

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

  return (
    <div style={page}>
      <h1>Admin Operations Dashboard</h1>
      <p style={{ color: "#666" }}>
        Monitor users, transactions, ledger entries, and fraud logs.
      </p>

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

      {activeTab === "transactions" && (
        <section style={card}>
          <h2>All Transactions</h2>

          {selectedTx && (
            <AuditPanel
              tx={selectedTx}
              ledgerEntries={getLedgerForTransaction(selectedTx._id)}
              accounting={getAccountingSummary(selectedTx._id)}
              onClose={() => setSelectedTx(null)}
            />
          )}

          <table style={table}>
            <thead>
              <tr>
                <th style={th}>User</th>
                <th style={th}>Amount</th>
                <th style={th}>Currency</th>
                <th style={th}>Provider</th>
                <th style={th}>Status</th>
                <th style={th}>Profit</th>
                <th style={th}>Date</th>
                <th style={th}>Severity</th>
<th style={th}>Action</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id}>
                  <td style={td}>{tx.user?.email || "-"}</td>
                  <td style={td}>{tx.amount}</td>
                  <td style={td}>{String(tx.currency || "").toUpperCase()}</td>
                  <td style={td}>{tx.provider || "-"}</td>
                  <td style={td}>{tx.status || "-"}</td>
                  <td style={td}>{tx.estimatedProfit ?? "-"}</td>
                  <td style={td}>
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                  </td>

                  <td style={td}>
  <span
    style={{
      padding: "5px 10px",
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 12,
      background: getRiskSeverity(log.riskScore).background,
      color: getRiskSeverity(log.riskScore).color,
    }}
  >
    {getRiskSeverity(log.riskScore).label}
  </span>
</td>

<td style={td}>
  {log.riskScore >= 60 ? (
    <button
      style={dangerButton}
      onClick={() => freezeUser(log.user?._id)}
    >
      Freeze User
    </button>
  ) : (
    <span style={{ color: "#999" }}>
      Monitoring
    </span>
  )}
</td>


                  <td style={td}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button style={neutralButton} onClick={() => setSelectedTx(tx)}>
                        View Audit
                      </button>

                      {tx.status === "completed" ? (
                        <button
                          style={dangerButton}
                          onClick={() => refundTransaction(tx)}
                        >
                          Refund
                        </button>
                      ) : tx.status === "refunded" ? (
                        <span style={refundedBadge}>Refunded</span>
                      ) : (
                        <span style={{ color: "#999" }}>-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <th style={th}>USD</th>
                <th style={th}>EUR</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={td}>{user.email}</td>
                  <td style={td}>{user.role}</td>
                  <td style={td}>{user.status}</td>
                  <td style={td}>{user.frozen ? "Yes" : "No"}</td>
                  <td style={td}>{user.balance?.usd ?? 0}</td>
                  <td style={td}>{user.balance?.eur ?? 0}</td>
                  <td style={td}>
                    {user.frozen ? (
                      <button
                        style={goodButton}
                        onClick={() => unfreezeUser(user._id)}
                      >
                        Unfreeze
                      </button>
                    ) : (
                      <button
                        style={dangerButton}
                        onClick={() => freezeUser(user._id)}
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
                <th style={th}>Currency</th>
                <th style={th}>Provider</th>
                <th style={th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {ledger.map((entry) => (
                <tr key={entry._id}>
                  <td style={td}>{entry.user?.email || "-"}</td>
                  <td style={td}>{entry.type}</td>
                  <td style={td}>{entry.account}</td>
                  <td style={td}>{entry.amount}</td>
                  <td style={td}>
                    {String(entry.currency || "").toUpperCase()}
                  </td>
                  <td style={td}>{entry.provider || "-"}</td>
                  <td style={td}>
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleString()
                      : "-"}
                  </td>
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
                <th style={th}>Amount</th>
                <th style={th}>Currency</th>
                <th style={th}>Risk Score</th>
                <th style={th}>Decision</th>
                <th style={th}>Reasons</th>
                <th style={th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {fraudLogs.map((log) => (
                <tr key={log._id}>
                  <td style={td}>{log.user?.email || "-"}</td>
                  <td style={td}>{log.amount}</td>
                  <td style={td}>{String(log.currency || "").toUpperCase()}</td>
                  <td style={td}>{log.riskScore}</td>
                  <td style={td}>{log.decision}</td>
                  <td style={td}>
                    {Array.isArray(log.reasons) ? log.reasons.join(", ") : "-"}
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
    </div>
  );
}

function AuditPanel({ tx, ledgerEntries, accounting, onClose }) {
  return (
    <div style={auditBox}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ marginTop: 0 }}>Transaction Audit Detail</h3>
        <button style={neutralButton} onClick={onClose}>
          Close
        </button>
      </div>

      <div style={auditGrid}>
        <Info label="Transaction ID" value={tx._id} />
        <Info label="User" value={tx.user?.email || "-"} />
        <Info label="Provider" value={tx.provider || "-"} />
        <Info label="Provider Payment ID" value={tx.providerPaymentId || tx.transactionId || "-"} />
        <Info label="Status" value={tx.status || "-"} />
        <Info label="Amount" value={`${tx.amount} ${String(tx.currency || "").toUpperCase()}`} />
        <Info label="Estimated Fee" value={tx.estimatedFee ?? "-"} />
        <Info label="Estimated Profit" value={tx.estimatedProfit ?? "-"} />
        <Info label="Created" value={tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"} />
        <Info label="Confirmed" value={tx.confirmedAt ? new Date(tx.confirmedAt).toLocaleString() : "-"} />
      </div>

      {tx.refund && (
        <div style={miniCard}>
          <h4 style={{ marginTop: 0 }}>Refund Audit</h4>
          <Info label="Refund ID" value={tx.refund.providerRefundId || "-"} />
          <Info label="Refund Status" value={tx.refund.providerRefundStatus || "-"} />
          <Info label="Refund Amount" value={tx.refund.refundAmount || "-"} />
          <Info label="Refund Currency" value={tx.refund.refundCurrency || "-"} />
          <Info label="Refund Reason" value={tx.refund.refundReason || "-"} />
          <Info
            label="Refund Completed"
            value={
              tx.refund.refundCompletedAt
                ? new Date(tx.refund.refundCompletedAt).toLocaleString()
                : "-"
            }
          />
        </div>
      )}

      <div style={miniCard}>
        <h4 style={{ marginTop: 0 }}>Accounting Validation</h4>
        <Info label="Balanced" value={accounting.balanced ? "Yes ✅" : "No 🚨"} />
        <Info label="Debit Total" value={accounting.debitTotal} />
        <Info label="Credit Total" value={accounting.creditTotal} />
        <Info label="Difference" value={accounting.difference} />
        <Info label="Ledger Entries" value={accounting.entriesCount} />
      </div>

      <div style={miniCard}>
        <h4 style={{ marginTop: 0 }}>Linked Ledger Entries</h4>
        {ledgerEntries.length === 0 ? (
          <p style={{ color: "#666" }}>No ledger entries found.</p>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Type</th>
                <th style={th}>Account</th>
                <th style={th}>Amount</th>
                <th style={th}>Currency</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry) => (
                <tr key={entry._id}>
                  <td style={td}>{entry.type}</td>
                  <td style={td}>{entry.account}</td>
                  <td style={td}>{entry.amount}</td>
                  <td style={td}>{String(entry.currency || "").toUpperCase()}</td>
                  <td style={td}>
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <strong style={infoValue}>{String(value)}</strong>
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
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  overflowX: "auto",
};

const tabs = {
  display: "flex",
  gap: 10,
  margin: "20px 0",
  flexWrap: "wrap",
};

const tab = (active) => ({
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: active ? "#111827" : "#fff",
  color: active ? "#fff" : "#111827",
  cursor: "pointer",
  fontWeight: 700,
});

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: 10,
  fontSize: 14,
};

const td = {
  borderBottom: "1px solid #eee",
  padding: 10,
  fontSize: 14,
  verticalAlign: "top",
};

const alert = {
  padding: 12,
  borderRadius: 8,
  background: "#fef3c7",
  border: "1px solid #fde68a",
  marginTop: 12,
};

const dangerButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#991b1b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const goodButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#166534",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const neutralButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const refundedBadge = {
  padding: "6px 10px",
  borderRadius: 8,
  background: "#e0f2fe",
  color: "#075985",
  fontWeight: 700,
  display: "inline-block",
};

const auditBox = {
  marginBottom: 20,
  padding: 16,
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
};

const auditGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 10,
  marginBottom: 14,
};

const miniCard = {
  marginTop: 14,
  padding: 14,
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  background: "#fff",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: "8px 0",
  borderBottom: "1px solid #eee",
};

const infoLabel = {
  color: "#666",
  fontSize: 13,
};

const infoValue = {
  fontSize: 13,
  wordBreak: "break-word",
};