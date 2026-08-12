import { useEffect, useState } from "react";
import API from "../../services/api";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";
export default function AuditPage() {
  const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { try { const res = await API.get("/admin/audit-logs"); setState({ loading: false, error: false, rows: res.data.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="Audit & Compliance" subtitle="Administrative actions and operational accountability." /><AdminPanel title="Audit Logs" description="Sensitive tokens, passwords, and secrets are excluded.">{state.loading ? <LoadingState label="Loading audit logs…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No audit records" /> : <AdminTable label="Audit logs"><thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>Severity</th><th>Created</th></tr></thead><tbody>{state.rows.map((log) => <tr key={log._id}><td>{log.actorEmail || log.admin?.email || "System"}</td><td>{log.action}</td><td>{log.targetLabel || log.targetType || "—"}</td><td><StatusBadge value={log.severity} /></td><td>{new Date(log.createdAt).toLocaleString()}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
