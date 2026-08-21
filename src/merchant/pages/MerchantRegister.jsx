import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const initial = { businessName: "", legalName: "", businessType: "corporation", contactEmail: "", country: "Canada", ownerEmail: "", password: "" };

export default function MerchantRegister() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const passwordReady = useMemo(() => form.password.length >= 10 && /[A-Z]/.test(form.password) && /[a-z]/.test(form.password) && /\d/.test(form.password), [form.password]);

  function field(name, value) { setForm((current) => ({ ...current, [name]: value })); setError(""); }
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    try { const response = await API.post("/merchants/register", form); setResult(response.data); }
    catch (requestError) { const payload = requestError.response?.data; setError(payload?.error?.message || payload?.error || "We could not create your Sandbox account. Please check the form and try again."); }
    finally { setLoading(false); }
  }

  if (result) return <main style={page}><section style={successCard} aria-live="polite"><p style={eyebrow}>AuraPay Sandbox Beta</p><h1>Check your email to verify your account.</h1><p>{result.message}</p>{result.data?.emailDelivery === "pending" && <Link style={linkButton} to="/resend-verification-email" state={{ email: form.ownerEmail }}>Resend verification email</Link>}<Link style={secondaryLink} to="/merchant/login">Go to Sign In</Link><p style={sandboxNote}>Sandbox only. No real funds or live payment processing are enabled.</p></section></main>;

  return <main style={page}><form style={card} onSubmit={submit} noValidate>
    <p style={eyebrow}>AuraPay Sandbox Beta</p><h1 style={title}>Create a merchant account</h1><p style={copy}>Set up a Sandbox workspace for testing. Verification is required before sign in.</p>
    {error && <div role="alert" style={errorBox}>{error}</div>}
    <Field label="Business name"><input required maxLength="120" value={form.businessName} onChange={(e) => field("businessName", e.target.value)} /></Field>
    <Field label="Legal name"><input required maxLength="160" value={form.legalName} onChange={(e) => field("legalName", e.target.value)} /></Field>
    <Field label="Business type"><select value={form.businessType} onChange={(e) => field("businessType", e.target.value)}><option value="corporation">Corporation</option><option value="sole_proprietorship">Sole proprietorship</option><option value="partnership">Partnership</option><option value="non_profit">Non-profit</option><option value="other">Other</option></select></Field>
    <Field label="Business email"><input required type="email" maxLength="254" autoComplete="email" value={form.contactEmail} onChange={(e) => field("contactEmail", e.target.value)} /></Field>
    <Field label="Owner email"><input required type="email" maxLength="254" autoComplete="username" value={form.ownerEmail} onChange={(e) => field("ownerEmail", e.target.value)} /></Field>
    <Field label="Country"><input required maxLength="80" autoComplete="country-name" value={form.country} onChange={(e) => field("country", e.target.value)} /></Field>
    <Field label="Password"><input required type="password" minLength="10" maxLength="128" autoComplete="new-password" value={form.password} onChange={(e) => field("password", e.target.value)} /><small>10–128 characters with uppercase, lowercase, and a number.</small></Field>
    <button style={button} disabled={loading || !passwordReady} type="submit">{loading ? "Creating Sandbox account…" : "Create Sandbox account"}</button>
    <p style={footer}>Already registered? <Link to="/merchant/login">Sign in</Link></p>
  </form></main>;
}

function Field({ label, children }) { return <label style={fieldStyle}><span>{label}</span>{children}</label>; }
const page={minHeight:"100vh",display:"grid",placeItems:"center",background:"linear-gradient(135deg,#eef7f4,#fff7ed)",padding:20,boxSizing:"border-box",overflowX:"hidden"};
const card={width:"min(560px,100%)",background:"#fff",padding:"clamp(24px,5vw,42px)",borderRadius:12,boxSizing:"border-box",boxShadow:"0 24px 70px rgba(15,47,44,.12)"};
const successCard={...card,textAlign:"center"}; const eyebrow={color:"#0f766e",fontWeight:800,textTransform:"uppercase",fontSize:13}; const title={marginBottom:8}; const copy={color:"#5f706b",lineHeight:1.6};
const fieldStyle={display:"grid",gap:7,marginTop:15,fontWeight:700,color:"#20322e"}; const button={width:"100%",marginTop:22,padding:14,border:0,borderRadius:8,background:"#0f766e",color:"white",fontWeight:800};
const errorBox={background:"#fef2f2",color:"#991b1b",padding:12,borderRadius:8}; const footer={textAlign:"center",marginTop:20}; const linkButton={display:"inline-block",padding:"12px 16px",background:"#0f766e",color:"white",textDecoration:"none",borderRadius:8}; const secondaryLink={display:"block",marginTop:18}; const sandboxNote={color:"#5f706b",fontSize:13};
