import { useEffect, useState } from "react";
import API from "../../services/api";
import usePermission from "../../hooks/usePermission";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";
export default function UsersPage() {
  const { hasPermission } = usePermission(); const [state, setState] = useState({ loading: true, error: false, rows: [] });
  async function load() { try { const res = await API.get("/admin/users"); setState({ loading: false, error: false, rows: res.data.data || [] }); } catch { setState({ loading: false, error: true, rows: [] }); } }
  async function freeze(id, frozen) { await API.post(`/admin/users/${id}/${frozen ? "unfreeze" : "freeze"}`, frozen ? undefined : { reason: "Administrative action" }); load(); }
  useEffect(() => { load(); }, []);
  return <><AdminPageHeader title="User Operations" subtitle="Review account status and administrative restrictions." /><AdminPanel title="Platform Users">{state.loading ? <LoadingState label="Loading users…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No users" /> : <AdminTable label="Platform users"><thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Restriction</th><th>Created</th><th>Action</th></tr></thead><tbody>{state.rows.map((user) => <tr key={user._id}><td>{user.email}</td><td>{user.role?.replaceAll("_", " ")}</td><td><StatusBadge value={user.status} /></td><td><StatusBadge value={user.frozen ? "frozen" : "active"} /></td><td>{new Date(user.createdAt).toLocaleDateString()}</td><td>{hasPermission("user:freeze") ? <button className="admin-logout" type="button" onClick={() => freeze(user._id, user.frozen)}>{user.frozen ? "Unfreeze" : "Freeze"}</button> : "Read only"}</td></tr>)}</tbody></AdminTable>}</AdminPanel></>;
}
