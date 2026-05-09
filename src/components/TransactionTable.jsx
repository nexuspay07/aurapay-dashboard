import { useState } from "react";
import API from "../services/api";

export default function TransactionTable({
  transactions = [],
  onRefundSuccess,
}) {
  const [message, setMessage] = useState("");
  const [refundingId, setRefundingId] = useState(null);

  function formatAmount(amount, currency) {
    const formatted = Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return String(currency || "").toLowerCase() === "eur"
      ? `€${formatted}`
      : `$${formatted}`;
  }

  async function handleRefund(tx) {
    const confirmRefund = window.confirm(
      `Refund ${formatAmount(tx.amount, tx.currency)} for transaction ${tx._id}?`
    );

    if (!confirmRefund) return;

    try {
      setMessage("");
      setRefundingId(tx._id);

      await API.post(`/payments/refund/${tx._id}`);

      setMessage("✅ Refund completed successfully.");
      onRefundSuccess?.();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "❌ Refund failed. Please try again."
      );
    } finally {
      setRefundingId(null);
    }
  }

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Transactions</h3>

      {message && (
        <div
          style={{
            ...alert,
            borderColor: message.startsWith("✅") ? "#86efac" : "#fecaca",
            background: message.startsWith("✅") ? "#f0fdf4" : "#fef2f2",
            color: message.startsWith("✅") ? "#166534" : "#991b1b",
          }}
        >
          {message}
        </div>
      )}

      {transactions.length === 0 ? (
        <p style={{ color: "#666", margin: 0 }}>
          No transfer activity yet. Start by topping up your wallet and sending a
          transfer.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Amount</th>
              <th style={th}>Currency</th>
              <th style={th}>Payment Network</th>
              <th style={th}>Status</th>
              <th style={th}>Processing Time</th>
              <th style={th}>Date</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => {
              const canRefund =
                tx.status === "completed" || tx.status === "provider_confirmed";

              return (
                <tr key={tx._id}>
                  <td style={td}>{formatAmount(tx.amount, tx.currency)}</td>
                  <td style={td}>{String(tx.currency || "").toUpperCase()}</td>
                  <td style={td}>{tx.provider || "-"}</td>

                  <td style={td}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background:
                          tx.status === "refunded"
                            ? "#e0f2fe"
                            : tx.success === true
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          tx.status === "refunded"
                            ? "#075985"
                            : tx.success === true
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {tx.status || (tx.success ? "SUCCESS" : "FAILED")}
                    </span>
                  </td>

                  <td style={td}>
                    {typeof tx.latency === "number" ? `${tx.latency} ms` : "-"}
                  </td>

                  <td style={td}>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString()
                      : "-"}
                  </td>

                  <td style={td}>
                    {canRefund ? (
                      <button
                        style={refundButton}
                        disabled={refundingId === tx._id}
                        onClick={() => handleRefund(tx)}
                      >
                        {refundingId === tx._id ? "Refunding..." : "Refund"}
                      </button>
                    ) : (
                      <span style={{ color: "#999" }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
  overflowX: "auto",
};

const alert = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid",
  marginBottom: 12,
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

const refundButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: 8,
  background: "#991b1b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};