import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../services/api";

export default function StripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage("Stripe is still loading. Please wait a moment.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/stripe/create-payment-intent", {
        amount: Number(amount),
        currency: "usd",
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("✅ Payment successful!");
      } else {
        setMessage("Payment did not complete.");
      }
    } catch (err) {
      const data = err?.response?.data;
      setMessage(data?.error || "❌ Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Make a Payment</h2>
        <p style={subtext}>
          Use Stripe test card: 4242 4242 4242 4242
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={input}
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <div style={cardInput}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#111827",
                    "::placeholder": {
                      color: "#6b7280",
                    },
                  },
                  invalid: {
                    color: "#dc2626",
                  },
                },
              }}
            />
          </div>

          <button style={button} disabled={loading || !stripe}>
            {loading ? "Processing..." : "Pay"}
          </button>
        </form>

        {message && <p style={messageStyle}>{message}</p>}
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f5f7fb",
  padding: 24,
};

const card = {
  width: "100%",
  maxWidth: 420,
  padding: 24,
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #ddd",
};

const subtext = {
  color: "#6b7280",
  marginTop: 0,
  marginBottom: 16,
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const cardInput = {
  padding: "14px 12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  marginBottom: 12,
  background: "#fff",
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const messageStyle = {
  marginTop: 14,
};