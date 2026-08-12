import { Link } from "react-router-dom";

export function AdminPageHeader({ title, subtitle, actions }) {
  return <header className="admin-page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{actions && <div className="admin-page-actions">{actions}</div>}</header>;
}
export function AdminStatCard({ label, value, hint, tone = "default" }) {
  return <article className={`admin-stat admin-stat--${tone}`}><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</article>;
}
export function AdminPanel({ title, description, action, children, className = "" }) {
  return <section className={`admin-panel ${className}`}><div className="admin-panel__header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>{children}</section>;
}
export function AdminTable({ children, label }) { return <div className="admin-table-wrap"><table aria-label={label}>{children}</table></div>; }
export function StatusBadge({ value = "unknown" }) { const key = String(value).toLowerCase().replace(/[^a-z]+/g, "-"); return <span className={`admin-badge admin-badge--${key}`}>{String(value).replaceAll("_", " ")}</span>; }
export function EnvironmentBadge() { return <span className="environment-badge"><span aria-hidden="true" />SANDBOX</span>; }
export function RiskBadge({ value }) { return <StatusBadge value={value ? `${value} risk` : "unknown"} />; }
export function LoadingState({ label = "Loading data…" }) { return <div className="admin-state" role="status"><span className="admin-spinner" aria-hidden="true" />{label}</div>; }
export function ErrorState({ message = "This section could not be loaded.", onRetry }) { return <div className="admin-state admin-state--error" role="alert"><strong>Unable to load</strong><span>{message}</span>{onRetry && <button type="button" onClick={onRetry}>Retry</button>}</div>; }
export function EmptyState({ title = "Nothing to show", description }) { return <div className="admin-state"><strong>{title}</strong>{description && <span>{description}</span>}</div>; }
export function AdminPagination({ page, pages, onChange }) { if (pages <= 1) return null; return <nav className="admin-pagination" aria-label="Pagination"><button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button type="button" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></nav>; }
export function AdminFilterBar({ children }) { return <div className="admin-filter-bar">{children}</div>; }
export function PanelLink({ to, children }) { return <Link className="admin-text-link" to={to}>{children} <span aria-hidden="true">→</span></Link>; }
export function DeferredAdminPage({ title, phase, description }) { return <><AdminPageHeader title={title} subtitle={description} actions={<EnvironmentBadge />} /><AdminPanel title={`Coming in Admin V2 ${phase}`} description="This workspace is intentionally unavailable during Sandbox Beta."><EmptyState title="No placeholder data has been generated" description="The authenticated Admin shell is ready; operational functionality will be connected in its scheduled phase." /></AdminPanel></>; }
