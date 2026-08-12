import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const PASSWORD_RULES = [
  ["At least 10 characters", (value) => value.length >= 10],
  ["One uppercase letter", (value) => /[A-Z]/.test(value)],
  ["One lowercase letter", (value) => /[a-z]/.test(value)],
  ["One number", (value) => /\d/.test(value)],
];
const humanRole = (role) => role?.split("_").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

export default function AdminInvitation() {
  const { token } = useParams(); const navigate = useNavigate();
  const [invite, setInvite] = useState(null); const [status, setStatus] = useState("loading");
  const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");
  const checks = useMemo(() => PASSWORD_RULES.map(([label, test]) => ({ label, met: test(password) })), [password]);
  const validPassword = checks.every((item) => item.met); const matches = password.length > 0 && password === confirmPassword;
  useEffect(() => { let active = true; API.get(`/admin-auth/invitations/${token}`).then(({ data }) => { if (active) { setInvite(data.data); setStatus("ready"); } }).catch(() => { if (active) setStatus("invalid"); }); return () => { active = false; }; }, [token]);
  async function accept(event) { event.preventDefault(); if (!validPassword) return setError("Your password does not yet meet all requirements."); if (!matches) return setError("Passwords must match."); setSubmitting(true); setError(""); try { await API.post(`/admin-auth/invitations/${token}/accept`, { password }); navigate("/admin-login", { replace: true, state: { message: "Admin access activated. You can now sign in." } }); } catch { setError("This invitation is invalid, expired, revoked, already used, or could not be activated."); } finally { setSubmitting(false); } }
  return <main className="admin-access-page"><section className="admin-access-brand"><Link className="admin-access-logo" to="/"><span>A</span>AuraPay Admin</Link><div className="admin-access-copy"><h1>Activate staff access.</h1><p>Choose your own password for the invitation issued by an authorized AuraPay administrator.</p></div><div className="admin-access-note">Invitation tokens are single-use and expire automatically.</div></section><section className="admin-access-form-panel"><div className="admin-access-card">{status === "loading" ? <div className="admin-access-state" role="status"><strong>Validating invitation…</strong></div> : status === "invalid" ? <div className="admin-access-state" role="alert"><strong>Invitation unavailable</strong><p>This invitation is invalid, expired, revoked, or already used.</p><div className="admin-access-links"><Link to="/admin-login">Return to staff sign in</Link></div></div> : <form onSubmit={accept}><h2>Accept invitation</h2><p>Create your secure AuraPay Admin credentials.</p><div className="admin-access-meta"><strong>{invite.email}</strong><br />Role: {humanRole(invite.role)}</div>{error && <div className="admin-access-alert" role="alert">{error}</div>}<label className="admin-access-field">New password<div className="admin-access-password"><input type={show ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength="10" autoComplete="new-password" disabled={submitting} required /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"}>{show ? "Hide" : "Show"}</button></div></label><label className="admin-access-field">Confirm password<input type={show ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength="10" autoComplete="new-password" disabled={submitting} required /></label><ul className="admin-password-rules" aria-label="Password requirements">{checks.map((item) => <li key={item.label} className={item.met ? "is-met" : ""}><span aria-hidden="true">{item.met ? "✓" : "○"}</span>{item.label}</li>)}<li className={matches ? "is-met" : ""}><span aria-hidden="true">{matches ? "✓" : "○"}</span>Passwords match</li></ul><button className="admin-access-submit" type="submit" disabled={submitting || !validPassword || !matches}>{submitting ? "Activating…" : "Activate admin access"}</button></form>}</div></section></main>;
}
