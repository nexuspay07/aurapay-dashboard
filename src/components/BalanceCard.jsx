export default function BalanceCard({ balance = { usd: 0, eur: 0 } }) {
  const usd = Number(balance?.usd || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const eur = Number(balance?.eur || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div style={card}>
      <h3 style={{ marginTop: 0 }}>Wallet Balance</h3>

      <div style={amountRow}>
        <span style={label}>USD</span>
        <span style={value}>${usd}</span>
      </div>

      <div style={amountRow}>
        <span style={label}>EUR</span>
        <span style={value}>€{eur}</span>
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 20,
  background: "#fff",
};

const amountRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderTop: "1px solid #eee",
};

const label = {
  color: "#6b7280",
  fontWeight: 600,
};

const value = {
  fontSize: 24,
  fontWeight: 800,
  color: "#111827",
};