import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

const scenarios = [
  {
    id: "success",
    label: "Successful payment",
    helper: "Creates a completed sandbox payment, transaction, settlement, and webhook events.",
  },
  {
    id: "declined",
    label: "Declined payment",
    helper: "Simulates a card_declined failure.",
  },
  {
    id: "insufficient_funds",
    label: "Insufficient funds",
    helper: "Simulates an insufficient_funds failure.",
  },
  {
    id: "pending",
    label: "Processing payment",
    helper: "Leaves the sandbox payment pending.",
  },
  {
    id: "failed",
    label: "Generic failure",
    helper: "Simulates a generic failed sandbox payment.",
  },
];

export default function HostedCheckout() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [scenario, setScenario] = useState("success");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const selectedScenario = useMemo(
    () => scenarios.find((item) => item.id === scenario) || scenarios[0],
    [scenario]
  );

  async function loadSession() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/checkout-ops/sessions/by-code/${sessionId}`);
      setSession(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Checkout session could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  async function submitPayment() {
    try {
      setProcessing(true);
      setError("");
      setResult(null);

      const res = await API.post(
        `/checkout-ops/sessions/by-code/${sessionId}/simulate`,
        { scenario }
      );

      setResult(res.data?.data || null);
      setSession(res.data?.data?.checkout || session);
    } catch (err) {
      setError(err?.response?.data?.error || "Sandbox payment could not be processed.");
    } finally {
      setProcessing(false);
    }
  }

  if (loading) {
    return <div style={loadingPage}>Loading AuraPay Sandbox Checkout...</div>;
  }

  if (error && !session) {
    return (
      <div style={page}>
        <section style={card}>
          <Brand />
          <ResultPanel
            status="failed"
            title="Checkout unavailable"
            message={error}
          />
        </section>
      </div>
    );
  }

  const paymentStatus = result?.transaction?.status || session?.status;

  return (
    <div style={page}>
      <section style={card}>
        <Brand />

        <div style={modeBanner}>
          <strong>SANDBOX / TEST MODE</strong>
          <span>No real funds will be charged or processed.</span>
        </div>

        <header style={header}>
          <h1 style={title}>AuraPay Checkout</h1>
          <p style={subtitle}>
            Review this sandbox checkout and choose a deterministic test outcome.
          </p>
        </header>

        <section style={summaryCard}>
          <SummaryRow label="Merchant" value={session?.merchant?.businessName || "AuraPay Merchant"} />
          <SummaryRow label="Amount" value={money(session?.amount, session?.currency)} />
          <SummaryRow label="Currency" value={String(session?.currency || "USD").toUpperCase()} />
          <SummaryRow label="Customer" value={session?.customerEmail || "Not provided"} />
          <SummaryRow label="Description" value={session?.description || "Sandbox checkout"} />
          <SummaryRow label="Status" value={paymentStatus || "created"} />
        </section>

        {result ? (
          <ResultPanel
            status={result.transaction?.status}
            title={resultTitle(result.transaction?.status)}
            message={result.outcome?.message || "Sandbox payment processed."}
          />
        ) : (
          <>
            <div style={scenarioList}>
              {scenarios.map((item) => (
                <label
                  key={item.id}
                  style={item.id === scenario ? selectedScenarioCard : scenarioCard}
                >
                  <input
                    type="radio"
                    name="scenario"
                    value={item.id}
                    checked={item.id === scenario}
                    onChange={(event) => setScenario(event.target.value)}
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.helper}</small>
                  </span>
                </label>
              ))}
            </div>

            {error && <div style={errorBanner}>{error}</div>}

            <button
              type="button"
              style={payButton}
              disabled={processing}
              onClick={submitPayment}
            >
              {processing ? "Processing sandbox payment..." : `Run ${selectedScenario.label}`}
            </button>
          </>
        )}

        <footer style={footer}>
          Powered by AuraPay Sandbox. Test data only.
        </footer>
      </section>
    </div>
  );
}

function Brand() {
  return <div style={brand}>AuraPay</div>;
}

function SummaryRow({ label, value }) {
  return (
    <div style={summaryRow}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ResultPanel({ status, title, message }) {
  const tone = status === "completed" || status === "paid"
    ? successPanel
    : status === "pending"
    ? pendingPanel
    : failedPanel;

  return (
    <section style={{ ...resultPanel, ...tone }}>
      <h2 style={resultTitleStyle}>{title}</h2>
      <p style={resultMessage}>{message}</p>
      <p style={resultFootnote}>This was a sandbox simulation. No real funds moved.</p>
    </section>
  );
}

function resultTitle(status) {
  if (status === "completed") return "Payment successful";
  if (status === "pending") return "Payment processing";
  if (status === "failed") return "Payment failed";
  return "Payment result";
}

function money(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "USD").toUpperCase(),
  }).format(Number(value || 0));
}

const loadingPage = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#F8FAFC",
  color: "#0F172A",
  fontSize: 18,
};

const page = {
  minHeight: "100vh",
  background: "#F8FAFC",
  display: "grid",
  placeItems: "center",
  padding: 20,
  boxSizing: "border-box",
};

const card = {
  width: "min(620px, 100%)",
  background: "#FFFFFF",
  borderRadius: 8,
  padding: 28,
  border: "1px solid #E2E8F0",
  boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
  boxSizing: "border-box",
};

const brand = {
  color: "#2563EB",
  fontWeight: 900,
  fontSize: 24,
  marginBottom: 14,
};

const modeBanner = {
  display: "grid",
  gap: 4,
  background: "#EFF6FF",
  color: "#1D4ED8",
  border: "1px solid #BFDBFE",
  borderRadius: 8,
  padding: 14,
  marginBottom: 20,
};

const header = {
  marginBottom: 20,
};

const title = {
  margin: 0,
  color: "#0F172A",
  fontSize: 32,
};

const subtitle = {
  color: "#64748B",
  margin: "8px 0 0",
};

const summaryCard = {
  background: "#F8FAFC",
  borderRadius: 8,
  padding: 16,
  border: "1px solid #E2E8F0",
  marginBottom: 18,
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 14,
  padding: "9px 0",
  borderBottom: "1px solid #E2E8F0",
  color: "#475569",
};

const scenarioList = {
  display: "grid",
  gap: 10,
  marginBottom: 18,
};

const scenarioCard = {
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: 12,
  padding: 14,
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  cursor: "pointer",
};

const selectedScenarioCard = {
  ...scenarioCard,
  border: "1px solid #2563EB",
  background: "#EFF6FF",
};

const errorBanner = {
  background: "#FEF2F2",
  color: "#B91C1C",
  border: "1px solid #FECACA",
  borderRadius: 8,
  padding: 14,
  marginBottom: 16,
};

const payButton = {
  width: "100%",
  padding: 15,
  borderRadius: 8,
  border: "none",
  background: "#0F172A",
  color: "#FFFFFF",
  fontWeight: 800,
  cursor: "pointer",
};

const resultPanel = {
  borderRadius: 8,
  padding: 20,
  border: "1px solid",
};

const successPanel = {
  background: "#ECFDF5",
  color: "#047857",
  borderColor: "#A7F3D0",
};

const pendingPanel = {
  background: "#FFFBEB",
  color: "#92400E",
  borderColor: "#FDE68A",
};

const failedPanel = {
  background: "#FEF2F2",
  color: "#B91C1C",
  borderColor: "#FECACA",
};

const resultTitleStyle = {
  margin: "0 0 8px",
};

const resultMessage = {
  margin: 0,
};

const resultFootnote = {
  margin: "12px 0 0",
  fontWeight: 800,
};

const footer = {
  textAlign: "center",
  marginTop: 20,
  color: "#64748B",
  fontSize: 14,
};
