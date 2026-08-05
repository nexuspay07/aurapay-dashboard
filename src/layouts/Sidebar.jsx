import { NavLink } from "react-router-dom";
import theme from "../theme/theme";

const iconPaths = {
  dashboard: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Zm10 0h6v-5h-6v5Z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
  checkout: "M5 6h16l-2 9H8L5 6Zm3 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h3l1 3",
  transactions: "M7 7h13l-4-4m4 4-4 4M17 17H4l4 4m-4-4 4-4",
  settlements: "M4 7h16v10H4V7Zm3 3h4m6 0h.01M7 14h10",
  analytics: "M5 19V9m7 10V5m7 14v-7",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8.2 8.2 0 0 0-2-1.2L15.2 3h-4.4l-.4 2.6a8.2 8.2 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A8 8 0 0 0 6 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a8.2 8.2 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z",
  key: "M15 7a4 4 0 1 0-3.5 4L4 18.5V21h2.5l1-1H10v-2.5l5-5A4 4 0 0 0 15 7Z",
  applications: "M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  webhooks: "M7 8a4 4 0 1 1 4 4H9m8 4a4 4 0 1 1-4-4h2M7 16h4m2-8h4",
  logs: "M6 4h12v16H6V4Zm3 5h6m-6 4h6m-6 4h3",
  docs: "M6 3h9l3 3v15H6V3Zm8 0v4h4M9 11h6m-6 4h6m-6 4h4",
};

export default function Sidebar({ menu, collapsed = false }) {
  return (
    <aside
      className="app-shell-sidebar"
      style={{
        width: collapsed ? 90 : 270,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "#FFFFFF",
        borderRight: `1px solid ${theme.colors.border}`,
        transition: "all .25s ease",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          padding: 28,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
          className="app-shell-sidebar-brand"
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: theme.colors.primary,
          }}
        >
          AuraPay
        </div>

        {!collapsed && (
          <div
            className="app-shell-sidebar-tagline"
            style={{
              marginTop: 6,
              color: theme.colors.textSecondary,
              fontSize: 14,
            }}
          >
            Merchant Platform
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {menu.map((item) => {
          if (item.section) {
            return !collapsed ? (
              <div
                key={item.section}
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0,
                  margin: "14px 8px 4px",
                  textTransform: "uppercase",
                }}
              >
                {item.section}
              </div>
            ) : (
              <div
                key={item.section}
                style={{
                  height: 1,
                  background: theme.colors.border,
                  margin: "12px 8px",
                }}
              />
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.title}
              aria-label={item.title}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: collapsed ? "14px 16px" : "14px 18px",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                transition: "all .25s ease",
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? theme.colors.primary : theme.colors.text,
              })}
            >
              <MenuIcon name={item.icon} />

              {!collapsed && (
                <span className="app-shell-sidebar-label">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div
        style={{
          padding: 24,
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        {!collapsed ? (
          <>
            <div
              className="app-shell-sidebar-footer"
              style={{
                fontWeight: 700,
              }}
            >
              AuraPay
            </div>

            <div
              className="app-shell-sidebar-footer"
              style={{
                fontSize: 13,
                marginTop: 6,
                color: theme.colors.textSecondary,
              }}
            >
              Fintech Infrastructure
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              color: theme.colors.primary,
            }}
          >
            <MenuIcon name="dashboard" />
          </div>
        )}
      </div>
    </aside>
  );
}

function MenuIcon({ name }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      style={{
        flex: "0 0 auto",
      }}
    >
      <path
        d={iconPaths[name] || iconPaths.dashboard}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
