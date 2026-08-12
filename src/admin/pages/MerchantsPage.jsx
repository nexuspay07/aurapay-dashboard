import { useEffect, useState } from "react";
import API from "../../services/api";
import usePermission from "../../hooks/usePermission";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, EnvironmentBadge, ErrorState, LoadingState, RiskBadge, StatusBadge } from "../components/AdminUI";
export default function MerchantsPage() {
  const { hasPermission } = usePermission(); const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { try { const res = await API.get("/merchants"); setState({ loading: false, error: false, rows: res.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  async function action(id, next) { await API.patch(`/merchants/${id}/${next}`); load(); }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="Merchant Operations" subtitle="Review merchant verification and risk status." actions={<EnvironmentBadge />} /><AdminPanel title="Merchants" description="Canonical merchant accounts; full KYB case management is deferred.">{state.loading ? <LoadingState label="Loading merchants…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No merchants" /> : <AdminTable label="Merchant operations"><thead><tr><th>Business</th><th>Country</th><th>Verification</th><th>Risk</th><th>Created</th><th>Actions</th></tr></thead><tbody>{state.rows.map((merchant) => <tr key={merchant._id}><td><strong>{merchant.businessName}</strong><br /><small>{merchant.contactEmail}</small></td><td>{merchant.country}</td><td><StatusBadge value={merchant.verificationStatus} /></td><td><RiskBadge value={merchant.riskLevel} /></td><td>{new Date(merchant.createdAt).toLocaleDateString()}</td><td>{hasPermission("merchant:verify") ? <>{merchant.verificationStatus !== "verified" && <button className="admin-logout" type="button" onClick={() => action(merchant._id, "verify")}>Verify</button>} {merchant.verificationStatus !== "rejected" && <button className="admin-logout" type="button" onClick={() => action(merchant._id, "reject")}>Reject</button>}</> : "Read only"}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
