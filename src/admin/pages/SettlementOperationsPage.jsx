import { useEffect, useState } from "react";
import API from "../../services/api";
import usePermission from "../../hooks/usePermission";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, EnvironmentBadge, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";
const money = (amount, currency) => new Intl.NumberFormat("en-CA", { style: "currency", currency: String(currency || "USD").toUpperCase() }).format(amount || 0);
export default function SettlementOperationsPage() {
  const { hasPermission } = usePermission(); const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { try { const res = await API.get("/admin/settlements?environment=sandbox&limit=50"); setState({ loading: false, error: false, rows: res.data.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  async function complete(id) { await API.patch(`/admin/settlements/${id}/complete`); load(); }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="Settlement Operations" subtitle="Simulation-only settlement administration for Sandbox Beta." actions={<EnvironmentBadge />} /><AdminPanel title="Sandbox Settlements" description="Completing a settlement updates sandbox state only; no payout is initiated.">{state.loading ? <LoadingState label="Loading settlements…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No sandbox settlements" /> : <AdminTable label="Sandbox settlements"><thead><tr><th>Merchant</th><th>Gross</th><th>Fees</th><th>Net</th><th>Status</th><th>Created</th><th>Action</th></tr></thead><tbody>{state.rows.map((row) => <tr key={row.id}><td>{row.merchant?.businessName || "—"}</td><td>{money(row.grossAmount, row.currency)}</td><td>{money(row.fees, row.currency)}</td><td>{money(row.netAmount, row.currency)}</td><td><StatusBadge value={row.status} /></td><td>{new Date(row.createdAt).toLocaleString()}</td><td>{row.status !== "completed" && hasPermission("settlement:complete") ? <button type="button" className="admin-logout" onClick={() => complete(row.id)}>Complete simulation</button> : "—"}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
