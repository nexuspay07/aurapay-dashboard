import { useEffect, useState } from "react";
import API from "../../services/api";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, EnvironmentBadge, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";
const money = (amount, currency) => new Intl.NumberFormat("en-CA", { style: "currency", currency: String(currency || "USD").toUpperCase() }).format(amount || 0);
export default function TransactionOperationsPage() {
  const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { setState((s) => ({ ...s, loading: true, error: false })); try { const res = await API.get("/admin/transactions?environment=sandbox&livemode=false&limit=50"); setState({ loading: false, error: false, rows: res.data.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="Transaction Operations" subtitle="Review canonical Sandbox payments and outcomes." actions={<EnvironmentBadge />} /><AdminPanel title="Sandbox Transactions" description="Provider credentials and raw responses are never displayed.">{state.loading ? <LoadingState label="Loading transactions…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No sandbox transactions" /> : <AdminTable label="Sandbox transactions"><thead><tr><th>Transaction</th><th>Merchant</th><th>Customer</th><th>Amount</th><th>Provider</th><th>Status</th><th>Created</th></tr></thead><tbody>{state.rows.map((tx) => <tr key={tx.id}><td>{tx.paymentId}</td><td>{tx.merchant?.businessName || "—"}</td><td>{tx.customer?.email || "—"}</td><td>{money(tx.amount, tx.currency)}</td><td>{tx.provider}</td><td><StatusBadge value={tx.status} /></td><td>{new Date(tx.createdAt).toLocaleString()}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
