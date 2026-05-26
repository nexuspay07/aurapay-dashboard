export default function StatCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 24,
        border: "1px solid #e5e7eb",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: 38,
          fontWeight: 800,
          color: "#111827",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          marginTop: 10,
          color: "#9ca3af",
          fontSize: 13,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}