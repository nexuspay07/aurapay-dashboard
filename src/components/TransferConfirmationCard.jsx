export default function TransferConfirmationCard({ transfer }) {
  if (!transfer) return null;

  return (
    <div style={card}>
      <p style={eyebrow}>TRANSFER RECEIPT</p>
      <h3 style={title}>Transfer Confirmed</h3>

      <div style={row}>
        <span style={label}>Status</span>
        <span style={value}>
          {transfer.status || "completed"}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Amount</span>
        <span style={value}>
          {transfer.amount} {String(transfer.currency || "").toUpperCase()}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Provider</span>
        <span style={value}>{transfer.provider || "-"}</span>
      </div>

      <div style={row}>
        <span style={label}>Latency</span>
        <span style={value}>
          {typeof transfer.latency === "number"
            ? `${transfer.latency} ms`
            : "-"}
        </span>
      </div>

      <div style={row}>
        <span style={label}>Transaction ID</span>
        <span style={transactionId}>{transfer.transactionId || "-"}</span>
      </div>

      <div style={row}>
        <span style={label}>Time</span>
        <span style={value}>
          {transfer.timestamp
            ? new Date(transfer.timestamp).toLocaleString()
            : new Date().toLocaleString()}
        </span>
      </div>
    </div>
  );
}

const card = {
  marginTop: 16,
  border: "1px solid #dbeafe",
  background: "#f8fbff",
  borderRadius: 12,
  padding: 18,
};

const eyebrow = {
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  color: "#1d4ed8",
  letterSpacing: "0.08em",
};

const title = {
  marginTop: 8,
  marginBottom: 16,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  padding: "8px 0",
  borderTop: "1px solid #e5e7eb",
};

const label = {
  color: "#6b7280",
  fontWeight: 600,
  minWidth: 120,
};

const value = {
  color: "#111827",
  textAlign: "right",
  wordBreak: "break-word",
};

const transactionId = {
  color: "#111827",
  textAlign: "right",
  wordBreak: "break-all",
  fontFamily: "monospace",
  fontSize: 12,
};