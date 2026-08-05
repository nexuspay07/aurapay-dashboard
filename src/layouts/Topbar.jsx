import theme from "../theme/theme";

export default function Topbar({
  title = "Dashboard",
  user = "Blaise",
  onToggleSidebar,
}) {
  return (
    <header
      className="app-shell-topbar"
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
          style={iconButton}
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
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
            Welcome back
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <input
          className="app-shell-search"
          name="globalSearch"
          autoComplete="off"
          placeholder="Search..."
          aria-label="Search dashboard"
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
          type="button"
          aria-label="View notifications"
          style={iconButton}
        >
          <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none">
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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

          <div className="app-shell-user-meta">
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

const iconButton = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: `1px solid ${theme.colors.border}`,
  background: "#fff",
  color: theme.colors.text,
  cursor: "pointer",
  display: "inline-grid",
  placeItems: "center",
};
