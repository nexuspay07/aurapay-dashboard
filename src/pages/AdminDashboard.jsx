import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("transactions");
  const [message, setMessage] = useState("");

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
    loadAdminData();
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

  return (
    <div style={page}>
      <h1>Admin Operations Dashboard</h1>
      <p style={{ color: "#666" }}>
        Monitor users, transactions, ledger entries, and fraud logs.
      </p>

      {message && <div style={alert}>{message}</div>}

      <div style={tabs}>
        <button style={tab(activeTab === "transactions")} onClick={() => setActiveTab("transactions")}>
          Transactions
        </button>
        <button style={tab(activeTab === "users")} onClick={() => setActiveTab("users")}>
          Users
        </button>
        <button style={tab(activeTab === "ledger")} onClick={() => setActiveTab("ledger")}>
          Ledger
        </button>
        <button style={tab(activeTab === "fraud")} onClick={() => setActiveTab("fraud")}>
          Fraud Logs
        </button>
      </div>

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
                <th style={th}>Profit</th>
                <th style={th}>Date</th>
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
                  <td style={td}>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}</td>
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
                      <button style={goodButton} onClick={() => unfreezeUser(user._id)}>
                        Unfreeze
                      </button>
                    ) : (
                      <button style={dangerButton} onClick={() => freezeUser(user._id)}>
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
                  <td style={td}>{String(entry.currency || "").toUpperCase()}</td>
                  <td style={td}>{entry.provider || "-"}</td>
                  <td style={td}>{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "-"}</td>
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
                  <td style={td}>{Array.isArray(log.reasons) ? log.reasons.join(", ") : "-"}</td>
                  <td style={td}>{log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
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