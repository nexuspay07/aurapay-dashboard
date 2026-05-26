import usePermission from "../../hooks/usePermission";

export default function Topbar() {
  const { adminUser, role } =
    usePermission();

  return (
    <header style={topbar}>
      <div>
        <h2 style={title}>
          Enterprise Operations
        </h2>

        <p style={subtitle}>
          Real-time fintech control
          center
        </p>
      </div>

      <div style={right}>
        <div style={userBox}>
          <div style={avatar}>
            {adminUser?.email?.[0]?.toUpperCase()}
          </div>

          <div>
            <div style={email}>
              {adminUser?.email}
            </div>

            <div style={roleBadge}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const topbar = {
  height: 80,
  background: "#fff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
};

const title = {
  margin: 0,
  fontSize: 24,
  fontWeight: 800,
};

const subtitle = {
  margin: "4px 0 0",
  color: "#6b7280",
};

const right = {
  display: "flex",
  alignItems: "center",
};

const userBox = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const avatar = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#111827",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
};

const email = {
  fontWeight: 700,
};

const roleBadge = {
  marginTop: 4,
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  background: "#111827",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
};