export default function StatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div style={card}>
      <div style={titleStyle}>
        {title}
      </div>

      <div style={valueStyle}>
        {value}
      </div>

      <div style={subtitleStyle}>
        {subtitle}
      </div>
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 24,
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 1px 2px rgba(0,0,0,0.04)",
};

const titleStyle = {
  fontSize: 14,
  color: "#6b7280",
  marginBottom: 12,
  fontWeight: 600,
};

const valueStyle = {
  fontSize: 34,
  fontWeight: 800,
  color: "#111827",
  marginBottom: 8,
};

const subtitleStyle = {
  fontSize: 14,
  color: "#9ca3af",
};