import { useState } from "react";
import API from "../services/api";
import AlertBanner from "../components/AlertBanner";

export default function TopUp({ onTopUpSuccess }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTopUp(e) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setMessage({ type: "danger", text: "Enter a valid top-up amount" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/wallet/topup", {
        amount: Number(amount),
        currency,
      });

      setMessage({
        type: "success",
        text: `✅ Wallet topped up successfully. New ${currency.toUpperCase()} balance updated.`,
      });

      setAmount("");

      onTopUpSuccess?.(res.data.balance);
    } catch (err) {
      const data = err?.response?.data;

      setMessage({
        type: "danger",
        text:
          data?.message ||
          data?.error ||
          "❌ Top-up failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Top Up Wallet</h3>

      {message && (
        <AlertBanner message={message.text} type={message.type} />
      )}

      <form onSubmit={handleTopUp}>
        <input
          style={input}
          type="number"
          min="1"
          placeholder="Top-up amount"
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
          {loading ? "Adding funds..." : "Top Up"}
        </button>
      </form>
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