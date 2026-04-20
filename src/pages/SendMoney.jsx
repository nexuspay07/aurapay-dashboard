import { useState } from "react";
import API from "../services/api";
import AlertBanner from "../components/AlertBanner";
import RiskBadge from "../components/RiskBadge";
import TransferConfirmationCard from "../components/TransferConfirmationCard";
import { useAuth } from "../context/AuthContext";

export default function SendMoney({ onPaymentSuccess }) {
  const { user } = useAuth();

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [message, setMessage] = useState(null);
  const [fraud, setFraud] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastTransfer, setLastTransfer] = useState(null);

  async function handlePay(e) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setMessage({ type: "danger", text: "Enter a valid amount" });
      return;
    }

    // ✅ Verification rule
    if (user?.status !== "verified" && Number(amount) > 1000) {
      setMessage({
        type: "danger",
        text: "Verification required for transfers above $1,000",
      });
      return;
    }

    setLoading(true);
    setMessage(null);
    setFraud(null);

    try {
      const res = await API.post("/wallet/pay", {
        amount: Number(amount),
        currency,
      });

      setFraud(res.data.fraud || null);

      setMessage({
        type: "success",
        text: `✅ Transfer successful via ${res.data.provider}. Your balance has been updated. You can send another transfer or view your transactions below.`,
      });

      setLastTransfer({
        status: res.data.status || "completed",
        amount: res.data.amount ?? Number(amount),
        currency: res.data.currency ?? currency,
        provider: res.data.provider,
        latency: res.data.latency,
        transactionId: res.data.transactionId || "-",
        timestamp: new Date().toISOString(),
      });

      setAmount("");
      onPaymentSuccess?.();
    } catch (err) {
      const data = err?.response?.data;

      setFraud(data?.fraud || data?.details || null);

      setMessage({
        type: "danger",
        text:
          data?.message ||
          data?.error ||
          "❌ Transfer failed. Please try again or check your balance.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Send Transfer</h3>

      {message && (
        <AlertBanner message={message.text} type={message.type} />
      )}

      {fraud?.decision && (
        <div style={{ marginBottom: 12 }}>
          <RiskBadge decision={fraud.decision} />
        </div>
      )}

      <form onSubmit={handlePay}>
        <input
          style={input}
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          style={input}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>

        <button style={button} disabled={loading} type="submit">
          {loading ? "Processing transfer..." : "Send Transfer"}
        </button>
      </form>

      <TransferConfirmationCard transfer={lastTransfer} />
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};