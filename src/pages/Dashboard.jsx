import { useEffect, useMemo, useState } from "react";
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [metrics, setMetrics] = useState({
    totalTransfers: 0,
    successRate: 0,
    avgLatency: 0,
  });

  async function loadBalance() {
    try {
      const res = await API.get("/user/balance");
      setBalance(res.data || { usd: 0, eur: 0 });
    } catch (err) {
      console.log("Failed to load balance:", err.message);
    }
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

  async function loadMetrics() {
    try {
      const res = await API.get("/wallet/transactions");
      const txs = Array.isArray(res.data) ? res.data : [];

      const totalTransfers = txs.length;
      const successfulTransfers = txs.filter((tx) => tx.success === true).length;

      const successRate =
        totalTransfers > 0 ? (successfulTransfers / totalTransfers) * 100 : 0;

      const latencies = txs
        .map((tx) => tx.latency)
        .filter((latency) => typeof latency === "number");

      const avgLatency =
        latencies.length > 0
          ? latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length
          : 0;

      setMetrics({
        totalTransfers,
        successRate,
        avgLatency,
      });
    } catch (err) {
      console.log("Failed to load metrics:", err.message);
      setMetrics({
        totalTransfers: 0,
        successRate: 0,
        avgLatency: 0,
      });
    }
  }

  async function refreshAll() {
    await Promise.all([
      loadBalance(),
      refreshUser(),
      loadLatestTransaction(),
      loadIntelligence(),
      loadMetrics(),
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
    loadMetrics();
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1100;

  const responsiveGrid = useMemo(
    () => ({
      display: "grid",
      gap: 20,
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "repeat(2, 1fr)"
        : "repeat(3, 1fr)",
    }),
    [isMobile, isTablet]
  );

  return (
    <div
      style={{
        ...page,
        padding: isMobile ? 16 : 24,
      }}
    >
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

      <div style={responsiveGrid}>
        <BalanceCard balance={balance} />
        <TopUp onTopUpSuccess={handleTopUpSuccess} />
        <SendMoney onPaymentSuccess={refreshAll} />
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={infoCard}>
          <h3 style={{ marginTop: 0 }}>Last Transfer Result</h3>

          {!latestTransaction ? (
            <p style={{ color: "#666", margin: 0 }}>No transfers yet.</p>
          ) : (
            <>
              <p>
                <strong>Status:</strong>{" "}
                {latestTransaction.status ||
                  (latestTransaction.success ? "SUCCESS" : "FAILED")}
              </p>
              <p>
                <strong>Payment Network:</strong>{" "}
                {latestTransaction.provider || "-"}
              </p>
              <p>
                <strong>Processing Time:</strong>{" "}
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
          <h3 style={{ marginTop: 0 }}>System Insights</h3>

          {intelligence.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>
              No routing intelligence data available yet.
            </p>
          ) : (
            intelligence.map((item, index) => (
              <div key={index} style={intelligenceRow}>
                <p>
                  <strong>Payment Network:</strong> {item.provider || "-"}
                </p>
                <p>
                  <strong>Success Rate:</strong>{" "}
                  {typeof item.successRate === "number"
                    ? `${(item.successRate * 100).toFixed(1)}%`
                    : "-"}
                </p>
                <p>
                  <strong>Avg Processing Time:</strong>{" "}
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
        <div style={infoCard}>
          <h3 style={{ marginTop: 0 }}>System Metrics</h3>
          <p>
            <strong>Total Transfers:</strong> {metrics.totalTransfers}
          </p>
          <p>
            <strong>Success Rate:</strong> {metrics.successRate.toFixed(1)}%
          </p>
          <p>
            <strong>Avg Processing Time:</strong> {metrics.avgLatency.toFixed(0)} ms
          </p>
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
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
  flexWrap: "wrap",
  gap: 10,
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