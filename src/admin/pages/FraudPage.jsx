import { useEffect, useState } from "react";
import API from "../../services/api";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, EnvironmentBadge, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";
export default function FraudPage() {
  const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { try { const res = await API.get("/admin/fraud-logs"); setState({ loading: false, error: false, rows: res.data.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="Fraud Center" subtitle="Review recorded risk decisions without overstating detection capabilities." actions={<EnvironmentBadge />} /><AdminPanel title="Recent Fraud Events" description="Showing the 25 newest events. Severity is derived from the existing risk score and decision.">{state.loading ? <LoadingState label="Loading fraud events…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No fraud events" description="No current records require display." /> : <AdminTable label="Fraud events"><thead><tr><th>User</th><th>Risk score</th><th>Decision</th><th>Reasons</th><th>Severity</th><th>Created</th></tr></thead><tbody>{state.rows.slice(0, 25).map((row) => <tr key={row.id}><td>{row.user?.email || "—"}</td><td>{row.riskScore ?? "—"}</td><td><StatusBadge value={row.decision} /></td><td>{row.reasons?.join(", ") || "—"}</td><td><StatusBadge value={row.severity} /></td><td>{new Date(row.createdAt).toLocaleString()}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
