import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ title = "Dashboard", menuButtonRef, menuOpen, onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const identity = user?.businessName || user?.name || user?.email || "Merchant account";
  const initials = identity.trim().charAt(0).toUpperCase() || "M";

  function signOut() {
    logout();
    navigate("/merchant/login", { replace: true });
  }

  return (
    <header className="app-shell-topbar">
      <div className="app-shell-topbar-heading">
        <button
          ref={menuButtonRef}
          className="app-shell-icon-button"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Toggle navigation menu"}
          aria-controls="merchant-navigation"
          aria-expanded={menuOpen}
          onClick={onToggleSidebar}
        >
          <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <span className="app-shell-topbar-kicker">Merchant workspace</span>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="app-shell-topbar-actions">
        <div className="app-shell-sandbox-badge">
          <span className="app-shell-sandbox-dot" aria-hidden="true" />
          <div><strong>Sandbox</strong><span>Test data only</span></div>
        </div>
        <Link className="app-shell-account" to="/merchant/profile" aria-label={`Open profile for ${identity}`}>
          <span className="app-shell-avatar" aria-hidden="true">{initials}</span>
          <span className="app-shell-user-meta"><strong>{identity}</strong><small>Merchant account</small></span>
        </Link>
        <button className="app-shell-signout" type="button" onClick={signOut}>Sign out</button>
      </div>
    </header>
  );
}
