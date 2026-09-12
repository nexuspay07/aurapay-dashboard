import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";

const symbols = { completed: "✓", failed: "✕", pending: "◉", skipped: "○", not_reached: "○" };

export default function PaymentInspector() {
  const { paymentId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get(`/merchant/payment-inspector/${encodeURIComponent(paymentId)}`)
      .then((response) => active && setData(response.data.data))
      .catch((err) => active && setError(err.response?.data?.error || "Unable to load payment inspector."));
    return () => { active = false; };
  }, [paymentId]);

  return (
    <AppShell menu={merchantMenu} title="Payment Inspector">
      <Link to="/merchant/transactions" style={backLink}>← Back to transactions</Link>
      {error && <div role="alert" style={errorBox}>{error}</div>}
      {!data && !error && <p>Loading payment inspector…</p>}
      {data && <Inspector data={data} />}
    </AppShell>
  );
}

function Inspector({ data }) {
  const { payment, summary, financialImpact, timeline, settlement, events, webhooks, developer } = data;
  return <main style={page}>
    <header style={header}>
      <div><div style={eyebrow}>Payment Inspector</div><h1 style={amount}>{money(payment.amount, payment.currency)}</h1>
        <div style={statusLine}>{payment.status.toUpperCase()} — {summary.title.toUpperCase()}</div></div>
      <span style={sandbox}>SANDBOX · NO REAL FUNDS</span>
      <div style={facts}><Fact label="Customer" value={payment.customerEmail || "Not provided"}/><Fact label="Provider" value={payment.provider}/><Fact label="Environment" value={payment.environment}/></div>
    </header>

    <Section title="Transaction timeline">
      <ol style={timelineList}>{timeline.map((step) => <li key={step.key} style={timelineItem}>
        <span aria-hidden="true" style={icon(step.state)}>{symbols[step.state]}</span>
        <div><strong>{step.label}</strong> <span style={stateLabel}>{step.state.replace("_", " ")}</span>
          <p style={description}>{step.description}</p>{step.timestamp && <time style={timestamp}>{date(step.timestamp)}</time>}</div>
      </li>)}</ol>
    </Section>

    <Section title={payment.status === "failed" ? "Why did this payment fail?" : "Payment status"}>
      <div style={grid}><Fact label="Reason" value={summary.title}/><Fact label="Lifecycle stage" value={summary.failureStage || "Sandbox processing"}/>
        <Fact label="What happened" value={summary.explanation}/><Fact label="Suggested action" value={summary.suggestedAction}/></div>
    </Section>

    <Section title="Financial impact"><div style={financialGrid}>
      <MoneyFact label="Requested" value={financialImpact.requestedAmount} currency={payment.currency}/><MoneyFact label="Charged" value={financialImpact.chargedAmount} currency={payment.currency}/>
      <MoneyFact label="Fees" value={financialImpact.fees} currency={payment.currency}/><MoneyFact label="Net" value={financialImpact.netAmount} currency={payment.currency}/>
      <Fact label="Settlement" value={settlement ? `${settlement.status} · ${settlement.id}` : financialImpact.settlementState.replaceAll("_", " ")}/>
    </div></Section>

    <div style={columns}><Section title="Events"><p>{events.count ? `${events.count} correlated event(s)` : "No correlated events were recorded."}</p>
      {events.items.map((event) => <Record key={event.id} title={event.type} detail={`${event.resourceType} · ${date(event.createdAt)}`}/>)}</Section>
      <Section title="Webhooks"><p>{!webhooks.configured ? "No merchant webhook destination was configured." : webhooks.attemptCount ? `${webhooks.attemptCount} delivery attempt(s) recorded.` : "No correlated webhook delivery was recorded."}</p>
      {webhooks.deliveries.map((delivery) => <Record key={delivery.id} title={`${delivery.eventType} · ${delivery.status}`} detail={`Attempts ${delivery.attempts}${delivery.httpStatus ? ` · HTTP ${delivery.httpStatus}` : ""}`}/>)}</Section></div>

    <Section title="Developer details"><div style={grid}>
      <CopyFact label="Payment ID" value={developer.paymentId}/><CopyFact label="Transaction ID" value={developer.transactionId}/><CopyFact label="Request ID" value={developer.requestId}/>
      <Fact label="Scenario" value={payment.sandboxScenario}/><Fact label="Outcome" value={payment.outcome}/><Fact label="Created" value={date(payment.createdAt)}/><Fact label="Updated" value={date(payment.updatedAt)}/>
    </div></Section>
  </main>;
}

function Section({ title, children }) { return <section aria-label={title} style={card}><h2 style={sectionTitle}>{title}</h2>{children}</section>; }
function Fact({ label, value }) { return <div><div style={labelStyle}>{label}</div><div style={valueStyle}>{value ?? "Not available"}</div></div>; }
function MoneyFact({ label, value, currency }) { return <Fact label={label} value={money(value, currency)}/>; }
function CopyFact({ label, value }) { return <div><Fact label={label} value={value}/>{value && <button style={copyButton} type="button" onClick={() => navigator.clipboard?.writeText(value)} aria-label={`Copy ${label}`}>Copy</button>}</div>; }
function Record({ title, detail }) { return <div style={record}><strong>{title}</strong><div style={description}>{detail}</div></div>; }
function money(value, currency) { try { return new Intl.NumberFormat("en-CA", { style: "currency", currency: String(currency || "CAD").toUpperCase() }).format(Number(value || 0)); } catch { return `${Number(value || 0).toFixed(2)} ${currency}`; } }
function date(value) { return value ? new Date(value).toLocaleString() : "Not available"; }
function icon(state) { return { ...iconBase, color: state === "failed" ? "#B91C1C" : state === "completed" ? "#15803D" : state === "pending" ? "#A16207" : "#64748B" }; }

const page={display:"grid",gap:18,maxWidth:1120}; const backLink={display:"inline-block",marginBottom:16,color:"#2563EB",fontWeight:700,textDecoration:"none"};
const header={background:"#0F172A",color:"white",padding:24,borderRadius:12,display:"grid",gap:18}; const eyebrow={fontSize:12,fontWeight:800,textTransform:"uppercase",letterSpacing:1.2,color:"#93C5FD"};
const amount={margin:"6px 0",fontSize:36}; const statusLine={fontWeight:800}; const sandbox={justifySelf:"start",background:"#FEF3C7",color:"#78350F",padding:"7px 10px",borderRadius:999,fontSize:12,fontWeight:900};
const facts={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}; const card={background:"white",border:"1px solid #E2E8F0",borderRadius:12,padding:22,minWidth:0};
const sectionTitle={margin:"0 0 18px",fontSize:19,color:"#0F172A",textTransform:"uppercase",letterSpacing:.4}; const timelineList={listStyle:"none",padding:0,margin:0,display:"grid",gap:4};
const timelineItem={display:"grid",gridTemplateColumns:"32px 1fr",gap:10,padding:"10px 0",borderBottom:"1px solid #F1F5F9"}; const iconBase={fontSize:20,fontWeight:900}; const stateLabel={marginLeft:8,fontSize:11,textTransform:"uppercase",color:"#64748B"};
const description={margin:"5px 0",color:"#64748B",fontSize:14,lineHeight:1.5}; const timestamp={fontSize:12,color:"#94A3B8"}; const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:20};
const financialGrid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:20}; const columns={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:18};
const labelStyle={fontSize:11,textTransform:"uppercase",letterSpacing:.5,color:"#64748B",fontWeight:800,marginBottom:5}; const valueStyle={color:"#0F172A",lineHeight:1.5,overflowWrap:"anywhere"};
const record={padding:"10px 0",borderTop:"1px solid #E2E8F0"}; const copyButton={marginTop:6,border:"1px solid #CBD5E1",background:"white",borderRadius:6,padding:"5px 9px",cursor:"pointer",fontWeight:700};
const errorBox={padding:16,background:"#FEF2F2",color:"#991B1B",borderRadius:8};
