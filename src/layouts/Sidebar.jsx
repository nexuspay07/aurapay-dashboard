import { NavLink } from "react-router-dom";

const iconPaths = {
  dashboard: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Zm10 0h6v-5h-6v5Z",
  plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z",
  checkout: "M5 6h16l-2 9H8L5 6Zm3 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm9 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h3l1 3",
  transactions: "M7 7h13l-4-4m4 4-4 4M17 17H4l4 4m-4-4 4-4",
  settlements: "M4 7h16v10H4V7Zm3 3h4m6 0h.01M7 14h10",
  analytics: "M5 19V9m7 10V5m7 14v-7",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  settings: "M12 15a3 3 0 1 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8.2 8.2 0 0 0-2-1.2L15.2 3h-4.4l-.4 2.6a8.2 8.2 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A8 8 0 0 0 6 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a8.2 8.2 0 0 0 2 1.2l.4 2.6h4.4l.4-2.6a8.2 8.2 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z",
  key: "M15 7a4 4 0 1 0-3.5 4L4 18.5V21h2.5l1-1H10v-2.5l5-5A4 4 0 0 0 15 7Z",
  applications: "M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  webhooks: "M7 8a4 4 0 1 1 4 4H9m8 4a4 4 0 1 1-4-4h2M7 16h4m2-8h4",
  logs: "M6 4h12v16H6V4Zm3 5h6m-6 4h6m-6 4h3",
  docs: "M6 3h9l3 3v15H6V3Zm8 0v4h4M9 11h6m-6 4h6m-6 4h4",
};

export default function Sidebar({ menu, collapsed = false, isMobile = false, mobileOpen = false, onClose, onNavigate }) {
  return (
    <aside
      id="merchant-navigation"
      className="app-shell-sidebar"
      aria-label="Merchant navigation"
      aria-hidden={isMobile && !mobileOpen}
      inert={isMobile && !mobileOpen ? "" : undefined}
      role={isMobile ? "dialog" : undefined}
      aria-modal={isMobile && mobileOpen ? "true" : undefined}
    >
      <div className="app-shell-sidebar-brand-wrap">
        <div className="app-shell-sidebar-logo" aria-hidden="true">A</div>
        {!collapsed && (
          <div className="app-shell-sidebar-brand-copy">
            <strong>AuraPay</strong>
            <span>Merchant workspace</span>
          </div>
        )}
        {isMobile && (
          <button className="app-shell-sidebar-close" type="button" aria-label="Close navigation menu" onClick={onClose}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <nav className="app-shell-sidebar-nav">
        {menu.map((item) => {
          if (item.section) {
            return (
              <div className="app-shell-sidebar-section" key={item.section}>
                {!collapsed ? item.section : <span aria-hidden="true" />}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={collapsed ? item.title : undefined}
              aria-label={item.title}
              onClick={() => onNavigate?.()}
              className={({ isActive }) => `app-shell-sidebar-link${isActive ? " is-active" : ""}`}
            >
              <MenuIcon name={item.icon} />
              {!collapsed && <span className="app-shell-sidebar-label">{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="app-shell-sidebar-footer">
        <span className="app-shell-sidebar-status" aria-hidden="true" />
        {!collapsed && (
          <div>
            <strong>Sandbox Beta</strong>
            <span>No real funds processed</span>
          </div>
        )}
      </div>
    </aside>
  );
}
function MenuIcon({ name }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d={iconPaths[name] || iconPaths.dashboard} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
