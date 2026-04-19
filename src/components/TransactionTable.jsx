export default function TransactionTable({ transactions = [] }) {
  function formatAmount(amount, currency) {
    const formatted = Number(amount || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return String(currency || "").toLowerCase() === "eur"
      ? `€${formatted}`
      : `$${formatted}`;
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 20,
        background: "#fff",
        overflowX: "auto",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Transactions</h3>

      {transactions.length === 0 ? (
        <p style={{ color: "#666", margin: 0 }}>
          No transfer activity yet. Start by topping up your wallet and sending a transfer.
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
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
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
                      background: tx.success === true ? "#dcfce7" : "#fee2e2",
                      color: tx.success === true ? "#166534" : "#991b1b",
                    }}
                  >
                    {tx.status || (tx.success ? "SUCCESS" : "FAILED")}
                  </span>
                </td>
                <td style={td}>
                  {typeof tx.latency === "number" ? `${tx.latency} ms` : "-"}
                </td>
                <td style={td}>
                  {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

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