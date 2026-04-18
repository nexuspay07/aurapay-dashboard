import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import BalanceCard from "../components/BalanceCard";
import SendMoney from "./SendMoney";
import TopUp from "./TopUp";
import Transactions from "./Transactions";
import FraudStatus from "./FraudStatus";
import DemoBanner from "../components/DemoBanner";

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState({ usd: 0, eur: 0 });
  const [reloadKey, setReloadKey] = useState(0);
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [intelligence, setIntelligence] = useState([]);

  async function loadBalance() {
    const res = await API.get("/user/balance");
    setBalance(res.data);
  }

  async function loadLatestTransaction() {
    try {
      const res = await API.get("/wallet/transactions");
      if (res.data && res.data.length > 0) {
        setLatestTransaction(res.data[0]);
      } else {
        setLatestTransaction(null);
      }
    } catch (err) {
      console.log("Failed to load latest transaction:", err.message);
    }
  }

  async function loadIntelligence() {
    try {
      const res = await API.get("/wallet/intelligence");
      setIntelligence(res.data || []);
    } catch (err) {
      console.log("Failed to load intelligence:", err.message);
    }
  }

  async function refreshAll() {
    await Promise.all([
      loadBalance(),
      refreshUser(),
      loadLatestTransaction(),
      loadIntelligence(),
    ]);
    setReloadKey((prev) => prev + 1);
  }

  function handleTopUpSuccess(newBalance) {
    if (newBalance) {
      setBalance(newBalance);
    }
    refreshAll();
  }

  useEffect(() => {
    loadBalance();
    loadLatestTransaction();
    loadIntelligence();
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <h1 style={{ margin: 0 }}>AuraPay</h1>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            Signed in as {user?.email}
          </p>
        </div>

        <button style={logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <DemoBanner />

      <div style={gridThree}>
        <BalanceCard balance={balance} />
        <TopUp onTopUpSuccess={handleTopUpSuccess} />
        <SendMoney onPaymentSuccess={refreshAll} />
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={infoCard}>
          <h3 style={{ marginTop: 0 }}>Last Transfer Result</h3>

          {!latestTransaction ? (
            <p style={{ color: "#666", margin: 0 }}>
              No transfers yet.
            </p>
          ) : (
            <>
              <p>
                <strong>Status:</strong>{" "}
                {latestTransaction.status ||
                  (latestTransaction.success ? "SUCCESS" : "FAILED")}
              </p>
              <p>
                <strong>Provider:</strong>{" "}
                {latestTransaction.provider || "-"}
              </p>
              <p>
                <strong>Latency:</strong>{" "}
                {typeof latestTransaction.latency === "number"
                  ? `${latestTransaction.latency} ms`
                  : "-"}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {latestTransaction.transactionId || "-"}
              </p>
              <p>
                <strong>Amount:</strong> {latestTransaction.amount}{" "}
                {String(latestTransaction.currency || "").toUpperCase()}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {latestTransaction.createdAt
                  ? new Date(latestTransaction.createdAt).toLocaleString()
                  : "-"}
              </p>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={infoCard}>
          <h3 style={{ marginTop: 0 }}>System Intelligence</h3>

          {intelligence.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>
              No routing intelligence data available yet.
            </p>
          ) : (
            intelligence.map((item, index) => (
              <div key={index} style={intelligenceRow}>
                <p>
                  <strong>Provider:</strong> {item.provider || "-"}
                </p>
                <p>
                  <strong>Success Rate:</strong>{" "}
                  {typeof item.successRate === "number"
                    ? `${(item.successRate * 100).toFixed(1)}%`
                    : "-"}
                </p>
                <p>
                  <strong>Avg Latency:</strong>{" "}
                  {typeof item.avgLatency === "number"
                    ? `${item.avgLatency.toFixed(0)} ms`
                    : "-"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <FraudStatus />
      </div>

      <div style={{ marginTop: 20 }}>
        <Transactions reloadKey={reloadKey} />
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: 24,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
};

const gridThree = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
};

const infoCard = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
};

const intelligenceRow = {
  borderTop: "1px solid #eee",
  padding: "10px 0",
};

const logoutBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};