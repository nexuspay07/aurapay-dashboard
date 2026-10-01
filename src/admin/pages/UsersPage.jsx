import { useEffect, useState } from "react";
import API from "../../services/api";
import usePermission from "../../hooks/usePermission";
import { AdminPageHeader, AdminPanel, AdminTable, EmptyState, ErrorState, LoadingState, StatusBadge } from "../components/AdminUI";

export default function UsersPage() {
  const { hasPermission } = usePermission();
  const [state, setState] = useState({ loading: true, error: false, rows: [] });
  const [notice, setNotice] = useState(null);
  const [approving, setApproving] = useState(null);

  async function load() {
    try { const res = await API.get("/admin/users"); setState({ loading: false, error: false, rows: res.data.data || [] }); }
    catch { setState({ loading: false, error: true, rows: [] }); }
  }

  async function freeze(id, frozen) {
    await API.post(`/admin/users/${id}/${frozen ? "unfreeze" : "freeze"}`, frozen ? undefined : { reason: "Administrative action" });
    load();
  }

  async function verifyEmail(user) {
    const confirmed = window.confirm(`Verify ${user.email} for private access? This verifies only the owner's email and does not verify or activate the merchant.`);
    if (!confirmed) return;
    setApproving(user._id); setNotice(null);
    try {
      await API.patch(`/admin/users/${user._id}/verify-email`);
      await load();
      setNotice({ type: "success", message: `Email verified for ${user.email}.` });
    } catch (error) {
      setNotice({ type: "error", message: error.response?.data?.error?.message || "Unable to verify this email." });
    } finally { setApproving(null); }
  }

  useEffect(() => { load(); }, []);

  return <>
    <AdminPageHeader title="User Operations" subtitle="Review account status and administrative restrictions." />
    {notice && <div className={`admin-access-alert${notice.type === "success" ? " admin-access-alert--success" : ""}`} role={notice.type === "success" ? "status" : "alert"}>{notice.message}</div>}
    <AdminPanel title="Platform Users">
      {state.loading ? <LoadingState label="Loading users…" /> : state.error ? <ErrorState onRetry={load} /> : !state.rows.length ? <EmptyState title="No users" /> : <AdminTable label="Platform users">
        <thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Restriction</th><th>Created</th><th>Action</th></tr></thead>
        <tbody>{state.rows.map((user) => {
          const eligible = user.role === "merchant_owner" && user.emailVerified !== true && user.status !== "verified" && Boolean(user.merchantId);
          const canFreeze = hasPermission("user:freeze");
          const canVerify = hasPermission("merchant:verify") && eligible;
          return <tr key={user._id}>
            <td>{user.email}</td><td>{user.role?.replaceAll("_", " ")}</td><td><StatusBadge value={user.status} /></td><td><StatusBadge value={user.frozen ? "frozen" : "active"} /></td><td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td><div className="admin-actions">
              {canFreeze && <button className="admin-logout" type="button" onClick={() => freeze(user._id, user.frozen)}>{user.frozen ? "Unfreeze" : "Freeze"}</button>}
              {canVerify && <button className="admin-logout" type="button" disabled={approving === user._id} onClick={() => verifyEmail(user)}>{approving === user._id ? "Verifying…" : "Verify email for private access"}</button>}
              {!canFreeze && !canVerify && "Read only"}
            </div></td>
          </tr>;
        })}</tbody>
      </AdminTable>}
    </AdminPanel>
  </>;
}
