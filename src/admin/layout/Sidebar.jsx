import { NavLink } from "react-router-dom";
import usePermission from "../../hooks/usePermission";

const groups = [
  { label: "OVERVIEW", items: [{ label: "Overview", path: "/admin", icon: "▦", permission: "analytics:view", end: true }] },
  { label: "OPERATIONS", items: [{ label: "Merchants", path: "/admin/merchants", icon: "◫", permission: "merchant:view" }, { label: "Merchant KYB", path: "/admin/merchant-kyb", icon: "✓", permission: "merchant:verify" }, { label: "Transactions", path: "/admin/transactions", icon: "↔", permission: "transaction:view" }, { label: "Settlements", path: "/admin/settlements", icon: "◇", permission: "settlement:view" }, { label: "Users", path: "/admin/users", icon: "♙", permission: "user:view" }] },
  { label: "RISK & COMPLIANCE", items: [{ label: "Fraud Center", path: "/admin/fraud", icon: "△", permission: "fraud:view" }, { label: "Audit Logs", path: "/admin/audit", icon: "≡", permission: "audit:view" }] },
  { label: "PLATFORM", items: [{ label: "Analytics", path: "/admin/analytics", icon: "⌁", permission: "analytics:view" }, { label: "Providers", path: "/admin/providers", icon: "⬡", permission: "analytics:view" }] },
  { label: "ADMINISTRATION", items: [{ label: "Admins", path: "/admin/admins", icon: "♙", permission: "admin:view" }, { label: "Settings", path: "/admin/settings", icon: "⚙", permission: "admin:update" }] },
];

export default function Sidebar() {
  const { hasPermission } = usePermission();
  return <aside className="admin-sidebar"><a className="admin-brand" href="/admin" aria-label="AuraPay Admin home"><span className="admin-brand__mark">A</span><span>AuraPay Admin</span></a><nav aria-label="Admin navigation">{groups.map((group) => { const visible = group.items.filter((item) => hasPermission(item.permission)); if (!visible.length) return null; return <section className="admin-nav-group" key={group.label}><h2>{group.label}</h2><div>{visible.map((item) => <NavLink end={item.end} key={item.path} to={item.path} className={({ isActive }) => `admin-nav-link${isActive ? " active" : ""}`}><span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>{item.label}</NavLink>)}</div></section>; })}</nav></aside>;
}
