export default function AdminSection({
  title,
  children,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        border: "1px solid #e5e7eb",
        marginBottom: 24,
      }}
    >
      <h2
        style={{
          marginBottom: 18,
          fontSize: 22,
          fontWeight: 700,
        }}
      >
        {title}
      </h2>

      {children}
    </div>
  );
}