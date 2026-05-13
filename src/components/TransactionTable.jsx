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

  function getRefundId(tx) {
    return (
      tx?.refund?.providerRefundId ||
      tx?.refundId ||
      tx?.providerRefundId ||
      tx?.metadata?.providerRefundId ||
      null
    );
  }

  function getRefundInfo(tx) {
    return tx?.refund || null;
  }

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Transactions</h3>

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
              <th style={th}>Refund Info</th>
              <th style={th}>Processing Time</th>
              <th style={th}>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => {
              const isRefunded = tx.status === "refunded";
              const refundId = getRefundId(tx);
              const refundInfo = getRefundInfo(tx);

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
                        background: isRefunded
                          ? "#e0f2fe"
                          : tx.success === true
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: isRefunded
                          ? "#075985"
                          : tx.success === true
                          ? "#166534"
                          : "#991b1b",
                      }}
                    >
                      {isRefunded ? "refunded" : tx.status || "-"}
                    </span>
                  </td>

                  <td style={td}>
                    {refundId ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <code style={codeText}>{refundId}</code>

                        {refundInfo?.providerRefundStatus && (
                          <span style={refundStatus}>
                            {refundInfo.providerRefundStatus}
                          </span>
                        )}

                        {refundInfo?.refundAmount > 0 && (
                          <span style={refundMeta}>
                            Amount:{" "}
                            {formatAmount(
                              refundInfo.refundAmount,
                              refundInfo.refundCurrency
                            )}
                          </span>
                        )}

                        {refundInfo?.refundReason && (
                          <span style={refundMeta}>
                            Reason: {refundInfo.refundReason}
                          </span>
                        )}

                        {refundInfo?.refundCompletedAt && (
                          <span style={refundMeta}>
                            Refunded:{" "}
                            {new Date(refundInfo.refundCompletedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: "#999" }}>-</span>
                    )}
                  </td>

                  <td style={td}>
                    {typeof tx.latency === "number" ? `${tx.latency} ms` : "-"}
                  </td>

                  <td style={td}>
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleString()
                      : "-"}
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

const codeText = {
  fontSize: 12,
  background: "#f3f4f6",
  padding: "3px 6px",
  borderRadius: 6,
};

const refundStatus = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: 999,
  background: "#dcfce7",
  color: "#166534",
  fontSize: 11,
  fontWeight: 700,
  width: "fit-content",
};

const refundMeta = {
  fontSize: 11,
  color: "#555",
  lineHeight: 1.4,
};