import theme from "../theme/theme";

export default function Topbar({
  title = "Dashboard",
  user = "Blaise",
  onToggleSidebar,
}) {
  return (
    <header
      style={{
        height: 80,
        background: "#FFFFFF",
        borderBottom: `1px solid ${theme.colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <button
          onClick={onToggleSidebar}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: `1px solid ${theme.colors.border}`,
            background: "#fff",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ☰
        </button>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 28,
            }}
          >
            {title}
          </h2>

          <div
            style={{
              color: theme.colors.textSecondary,
              marginTop: 4,
            }}
          >
            Welcome back 👋
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <input
          placeholder="Search..."
          style={{
            width: 280,
            height: 46,
            borderRadius: 12,
            border: `1px solid ${theme.colors.border}`,
            padding: "0 16px",
            fontSize: 15,
            outline: "none",
          }}
        />

        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            border: `1px solid ${theme.colors.border}`,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          🔔
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 14px",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 14,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: theme.colors.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {user.charAt(0)}
          </div>

          <div>
            <div
              style={{
                fontWeight: 600,
              }}
            >
              {user}
            </div>

            <div
              style={{
                fontSize: 13,
                color: theme.colors.textSecondary,
              }}
            >
              Merchant
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}