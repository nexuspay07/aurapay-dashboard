export default function TransferConfirmationCard({ transfer }) {
  if (!transfer) return null;

  return (
    <div style={card}>
      <p style={eyebrow}>TRANSFER RECEIPT</p>
      <h3 style={{ marginTop: 0 }}>Transfer Confirmed</h3>

      <div style={row}>
        <span>Status</span>
        <strong>{transfer.status || "-"}</strong>
      </div>

      <div style={row}>
        <span>Amount</span>
        <strong>
          {Number(transfer.amount || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </strong>
      </div>

      <div style={row}>
        <span>Payment Network</span>
        <strong>{transfer.provider || "-"}</strong>
      </div>

      <div style={row}>
        <span>Processing Time</span>
        <strong>
          {typeof transfer.latency === "number" ? `${transfer.latency} ms` : "-"}
        </strong>
      </div>

      <div style={row}>
        <span>Transfer Reference</span>
        <strong>{transfer.transactionId || "-"}</strong>
      </div>

      <div style={row}>
        <span>Time</span>
        <strong>
          {transfer.timestamp
            ? new Date(transfer.timestamp).toLocaleString()
            : "-"}
        </strong>
      </div>

      {transfer.routing && (
        <div style={routingBox}>
          <h4 style={{ marginTop: 0, marginBottom: 10 }}>Routing Explanation</h4>

          <div style={row}>
            <span>Recommended Provider</span>
            <strong>{transfer.routing.recommendedProvider || "-"}</strong>
          </div>

          <div style={row}>
            <span>Selected Provider</span>
            <strong>{transfer.routing.selectedProvider || transfer.provider || "-"}</strong>
          </div>

          <div style={row}>
            <span>Attempt Order</span>
            <strong>
              {Array.isArray(transfer.routing.attemptOrder)
                ? transfer.routing.attemptOrder.join(" → ")
                : "-"}
            </strong>
          </div>

          <div style={{ marginTop: 10 }}>
            <span style={{ display: "block", marginBottom: 6 }}>Reason</span>
            <strong>{transfer.routing.reasonSummary || "-"}</strong>
          </div>
        </div>
      )}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
  marginTop: 16,
};

const eyebrow = {
  color: "#1d4ed8",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  marginBottom: 8,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  padding: "10px 0",
  borderTop: "1px solid #eee",
};

const routingBox = {
  marginTop: 18,
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fafafa",
};