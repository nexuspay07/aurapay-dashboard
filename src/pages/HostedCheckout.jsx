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
      <div style={{ padding: 40 }}>
        Loading Checkout...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "50px auto",
        padding: 30,
        background: "#fff",
        borderRadius: 16,
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h1>AuraPay Checkout</h1>

      <hr />

      <p>
        <strong>Session:</strong>{" "}
        {session.sessionId}
      </p>

      <p>
        <strong>Amount:</strong> $
        {session.amount}
      </p>

      <p>
        <strong>Currency:</strong>{" "}
        {session.currency}
      </p>

      <button
        style={{
          width: "100%",
          padding: 14,
          background: "#111827",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}