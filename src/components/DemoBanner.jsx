export default function DemoBanner() {
  return (
    <div
      style={{
        background: "#fffbeb",
        border: "1px solid #fde68a",
        color: "#92400e",
        borderRadius: 12,
        padding: "14px 16px",
        marginBottom: 20,
      }}
    >
      <strong>Demo Mode:</strong> You are using test funds and simulated transfers.
      No real money is being moved.
    </div>
  );
}