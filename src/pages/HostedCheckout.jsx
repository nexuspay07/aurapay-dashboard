import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

export default function HostedCheckout() {
  const { sessionId } = useParams();

  const [session, setSession] =
    useState(null);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      const res = await API.get(
        `/checkout-ops/sessions/by-code/${sessionId}`
      );

      setSession(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  if (!session) {
    return (
      <div style={loadingPage}>
        Loading Secure Checkout...
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={brand}>
          AuraPay
        </div>

        <h1 style={title}>
          Secure Payment
        </h1>

        <p style={subtitle}>
          Complete your payment securely.
        </p>

        <div style={summaryCard}>
          <div style={summaryRow}>
            <span>Session</span>

            <strong>
              {session.sessionId}
            </strong>
          </div>

          <div style={summaryRow}>
            <span>Email</span>

            <strong>
              {session.customerEmail ||
                "Not Provided"}
            </strong>
          </div>

          <div style={summaryRow}>
            <span>Status</span>

            <strong>
              {session.status}
            </strong>
          </div>
        </div>

        <div style={amountCard}>
          <div style={amountLabel}>
            Total Amount
          </div>

          <div style={amountValue}>
            $
            {Number(
              session.amount
            ).toFixed(2)}
          </div>

          <div style={currency}>
            {session.currency}
          </div>
        </div>

        <div style={paymentMethods}>
          <div style={method}>
            💳 Card Payment
          </div>

          <div style={method}>
            🔒 Secure Checkout
          </div>
        </div>

        <button style={payButton}>
          Pay Now
        </button>

        <div style={footer}>
          Powered by AuraPay
        </div>
      </div>
    </div>
  );
}

const loadingPage = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#F8FAFC",
  fontSize: 18,
};

const page = {
  minHeight: "100vh",
  background: "#F8FAFC",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
};

const card = {
  width: "100%",
  maxWidth: 550,
  background: "#fff",
  borderRadius: 24,
  padding: 32,
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 20px 50px rgba(15,23,42,0.08)",
};

const brand = {
  color: "#2563EB",
  fontWeight: 800,
  marginBottom: 10,
};

const title = {
  margin: 0,
  fontSize: 36,
};

const subtitle = {
  color: "#64748B",
  marginBottom: 30,
};

const summaryCard = {
  background: "#F8FAFC",
  borderRadius: 16,
  padding: 18,
  border: "1px solid #E2E8F0",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
};

const amountCard = {
  textAlign: "center",
  marginTop: 24,
  marginBottom: 24,
};

const amountLabel = {
  color: "#64748B",
};

const amountValue = {
  fontSize: 52,
  fontWeight: 800,
  marginTop: 10,
};

const currency = {
  color: "#64748B",
};

const paymentMethods = {
  display: "grid",
  gap: 12,
  marginBottom: 24,
};

const method = {
  padding: 16,
  borderRadius: 12,
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
};

const payButton = {
  width: "100%",
  padding: 18,
  borderRadius: 14,
  border: "none",
  background: "#0F172A",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 16,
};

const footer = {
  textAlign: "center",
  marginTop: 20,
  color: "#64748B",
  fontSize: 14,
};