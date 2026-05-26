export default function UserDetailsModal({
  user,
  onClose,
}) {
  if (!user) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* HEADER */}

        <div style={header}>
          <div>
            <h2 style={title}>
              User Profile
            </h2>

            <p style={subtitle}>
              Operational user
              overview and controls
            </p>
          </div>

          <button
            onClick={onClose}
            style={closeButton}
          >
            ✕
          </button>
        </div>

        {/* USER INFO */}

        <div style={section}>
          <h3 style={sectionTitle}>
            Identity
          </h3>

          <InfoRow
            label="Email"
            value={user.email}
          />

          <InfoRow
            label="Role"
            value={user.role}
          />

          <InfoRow
            label="Status"
            value={user.status}
          />

          <InfoRow
            label="Frozen"
            value={
              user.frozen
                ? "YES"
                : "NO"
            }
          />

          <InfoRow
            label="Onboarding"
            value={
              user.onboardingCompleted
                ? "Completed"
                : "Pending"
            }
          />
        </div>

        {/* BALANCES */}

        <div style={section}>
          <h3 style={sectionTitle}>
            Wallet Balances
          </h3>

          <InfoRow
            label="USD"
            value={`$${
              user.balance?.usd || 0
            }`}
          />

          <InfoRow
            label="EUR"
            value={`€${
              user.balance?.eur || 0
            }`}
          />
        </div>

        {/* ACCOUNT TIMELINE */}

        <div style={section}>
          <h3 style={sectionTitle}>
            Account Timeline
          </h3>

          <InfoRow
            label="Created"
            value={new Date(
              user.createdAt
            ).toLocaleString()}
          />

          <InfoRow
            label="Updated"
            value={new Date(
              user.updatedAt
            ).toLocaleString()}
          />
        </div>

        {/* FREEZE INFO */}

        {user.frozen && (
          <div style={dangerBox}>
            <strong>
              Account Frozen
            </strong>

            <p
              style={{
                marginTop: 8,
              }}
            >
              Reason:{" "}
              {user.freezeReason ||
                "N/A"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}) {
  return (
    <div style={row}>
      <div style={labelStyle}>
        {label}
      </div>

      <div style={valueStyle}>
        {value}
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background:
    "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  width: 700,
  maxWidth: "95%",
  background: "#fff",
  borderRadius: 20,
  padding: 30,
  maxHeight: "90vh",
  overflowY: "auto",
};

const header = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: 30,
};

const title = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 6,
};

const subtitle = {
  color: "#6b7280",
};

const closeButton = {
  border: "none",
  background: "#111827",
  color: "#fff",
  width: 42,
  height: 42,
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};

const section = {
  marginBottom: 28,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 800,
  marginBottom: 16,
  color: "#111827",
};

const row = {
  display: "flex",
  justifyContent:
    "space-between",
  padding: "12px 0",
  borderBottom:
    "1px solid #f3f4f6",
};

const labelStyle = {
  color: "#6b7280",
  fontWeight: 600,
};

const valueStyle = {
  color: "#111827",
  fontWeight: 700,
};

const dangerBox = {
  background: "#fee2e2",
  border: "1px solid #fecaca",
  padding: 20,
  borderRadius: 14,
  color: "#991b1b",
};