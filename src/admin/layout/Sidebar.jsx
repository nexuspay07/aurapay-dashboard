import { Link } from "react-router-dom";

const navItems = [
  {
    label: "Overview",
    path: "/admin",
  },

  {
    label: "Users",
    path: "/admin/users",
  },

  {
    label: "Transactions",
    path: "/admin/transactions",
  },

  {
    label: "Fraud Center",
    path: "/admin/fraud",
  },

  {
    label: "Audit Logs",
    path: "/admin/audit",
  },

  {
    label: "Analytics",
    path: "/admin/analytics",
  },

  {
    label: "Providers",
    path: "/admin/providers",
  },

  {
    label: "Admins",
    path: "/admin/admins",
  },

  {
    label: "Settings",
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  return (
    <aside style={sidebar}>
      <div style={logo}>
        AuraPay Admin
      </div>

      <nav style={nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={navLink}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

const sidebar = {
  width: 260,
  background: "#111827",
  color: "#fff",
  padding: 24,
  display: "flex",
  flexDirection: "column",
};

const logo = {
  fontSize: 24,
  fontWeight: 800,
  marginBottom: 40,
};

const nav = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const navLink = {
  color: "#fff",
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: 10,
  background: "rgba(255,255,255,0.05)",
  fontWeight: 600,
};