export default function RiskBadge({ decision }) {
  let bg = "#e5e7eb";
  let color = "#111827";
  let label = decision || "UNKNOWN";

  if (decision === "APPROVE") {
    bg = "#dcfce7";
    color = "#166534";
    label = "Approved";
  } else if (decision === "FLAG") {
    bg = "#fef3c7";
    color = "#92400e";
    label = "Flagged";
  } else if (decision === "BLOCK") {
    bg = "#fee2e2";
    color = "#991b1b";
    label = "Blocked";
  }

  label = "Approved (Safe)";
label = "Flagged (Review)";
label = "Blocked (High Risk)";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}