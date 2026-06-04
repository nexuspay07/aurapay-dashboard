import { useState } from "react";
import API from "../services/api";

export default function CreateCheckoutPage() {
  const [amount, setAmount] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function createCheckout() {
    try {
      setLoading(true);

      const res =
        await API.post(
          "/checkout-ops/sessions",
          {
            amount:
              Number(amount),

            customerEmail:
              email,
          }
        );

      setSession(res.data);
    } catch (err) {
      console.log(err);
      alert(
        "Failed to create checkout"
      );
    } finally {
      setLoading(false);
    }
  }

  const checkoutLink =
    session
      ? `${window.location.origin}/pay/${session.sessionId}`
      : "";

  return (
    <div style={page}>
      <div style={card}>
        <div style={eyebrow}>
          AURAPAY MERCHANT
        </div>

        <h1 style={title}>
          Create Checkout
        </h1>

        <p style={subtitle}>
          Generate a secure payment
          link for your customer.
        </p>

        <div style={field}>
          <label style={label}>
            Amount
          </label>

          <input
            value={amount}
            onChange={(e) =>
              setAmount(
                e.target.value
              )
            }
            placeholder="10.00"
            style={input}
          />
        </div>

        <div style={field}>
          <label style={label}>
            Customer Email
          </label>

          <input
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            placeholder="customer@email.com"
            style={input}
          />
        </div>

        <button
          onClick={
            createCheckout
          }
          disabled={
            loading ||
            !amount
          }
          style={button}
        >
          {loading
            ? "Creating..."
            : "Generate Checkout"}
        </button>

        {session && (
          <div style={resultCard}>
            <h3>
              Checkout Created
            </h3>

            <p>
              Session:
              {" "}
              {
                session.sessionId
              }
            </p>

            <input
              value={
                checkoutLink
              }
              readOnly
              style={
                linkInput
              }
            />

            <div
              style={
                actions
              }
            >
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    checkoutLink
                  )
                }
                style={
                  secondaryButton
                }
              >
                Copy Link
              </button>

              <a
                href={
                  checkoutLink
                }
                target="_blank"
                rel="noreferrer"
                style={
                  openButton
                }
              >
                Open Checkout
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#F8FAFC",
  padding: 40,
};

const card = {
  maxWidth: 700,
  margin: "0 auto",
  background: "#fff",
  borderRadius: 24,
  padding: 32,
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 10px 30px rgba(15,23,42,0.06)",
};

const eyebrow = {
  color: "#2563EB",
  fontWeight: 700,
  marginBottom: 8,
};

const title = {
  fontSize: 38,
  marginBottom: 8,
};

const subtitle = {
  color: "#64748B",
  marginBottom: 30,
};

const field = {
  marginBottom: 20,
};

const label = {
  display: "block",
  marginBottom: 8,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  fontSize: 16,
};

const button = {
  width: "100%",
  padding: 16,
  background: "#0F172A",
  color: "#fff",
  border: "none",
  borderRadius: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const resultCard = {
  marginTop: 30,
  padding: 20,
  borderRadius: 16,
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
};

const linkInput = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  border: "1px solid #CBD5E1",
  marginTop: 12,
};

const actions = {
  display: "flex",
  gap: 12,
  marginTop: 16,
};

const secondaryButton = {
  padding: "12px 18px",
  borderRadius: 10,
  border: "1px solid #CBD5E1",
  cursor: "pointer",
};

const openButton = {
  padding: "12px 18px",
  borderRadius: 10,
  background: "#2563EB",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};