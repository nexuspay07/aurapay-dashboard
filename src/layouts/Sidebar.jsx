import { NavLink } from "react-router-dom";
import theme from "../theme/theme";

export default function Sidebar({
  menu,
  collapsed = false,
}) {
  return (
    <aside
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
      }}
    >
      {/* ====================================== */}
      {/* LOGO */}
      {/* ====================================== */}

      <div
        style={{
          padding: 28,

          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
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
            style={{
              marginTop: 6,

              color:
                theme.colors.textSecondary,

              fontSize: 14,
            }}
          >
            Merchant Platform
          </div>
        )}
      </div>

      {/* ====================================== */}
      {/* MENU */}
      {/* ====================================== */}

      <div
        style={{
          flex: 1,

          padding: 20,

          display: "flex",

          flexDirection: "column",

          gap: 10,
        }}
      >
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",

              alignItems: "center",

              gap: 16,

              padding: "14px 18px",

              borderRadius: 14,

              textDecoration: "none",

              fontWeight: 600,

              transition:
                "all .25s ease",

              background: isActive
                ? "#EFF6FF"
                : "transparent",

              color: isActive
                ? theme.colors.primary
                : theme.colors.text,
            })}
          >
            <span
              style={{
                fontSize: 22,
              }}
            >
              {item.icon}
            </span>

            {!collapsed && (
              <span>{item.title}</span>
            )}
          </NavLink>
        ))}
      </div>

      {/* ====================================== */}
      {/* FOOTER */}
      {/* ====================================== */}

      <div
        style={{
          padding: 24,

          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        {!collapsed ? (
          <>
            <div
              style={{
                fontWeight: 700,
              }}
            >
              AuraPay
            </div>

            <div
              style={{
                fontSize: 13,

                marginTop: 6,

                color:
                  theme.colors.textSecondary,
              }}
            >
              Fintech Infrastructure
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",

              fontSize: 24,
            }}
          >
            🚀
          </div>
        )}
      </div>
    </aside>
  );
}