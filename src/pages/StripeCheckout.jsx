import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import API from "../services/api";

export default function StripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      // 1. Create payment intent
      const res = await API.post("/stripe/create-payment-intent", {
        amount: Number(amount),
        currency: "usd",
      });

      const clientSecret = res.data.clientSecret;

      // 2. Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        // 3. Save successful payment in DB
        await API.post("/stripe/save-payment", {
          amount: Number(amount),
          currency: "usd",
          paymentIntentId: result.paymentIntent.id,
          status: result.paymentIntent.status,
        });

        setMessage("✅ Payment successful and saved to AuraPay!");
      } else {
        setMessage("Payment did not complete.");
      }
    } catch (err) {
      setMessage(err?.response?.data?.error || "❌ Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <form onSubmit={handleSubmit} style={card}>
        <h2>Make a Payment</h2>

        <p>Use Stripe test card:</p>
        <p style={{ marginTop: -8, color: "#666" }}>4242 4242 4242 4242</p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <div style={cardElementBox}>
          <CardElement />
        </div>

        <button disabled={!stripe || loading} style={button}>
          {loading ? "Processing..." : "Pay"}
        </button>

        {message && <p style={{ marginTop: 14 }}>{message}</p>}
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
};

const card = {
  width: 400,
  padding: 20,
  border: "1px solid #ddd",
  borderRadius: 10,
  background: "#fff",
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  boxSizing: "border-box",
};

const cardElementBox = {
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 6,
  marginBottom: 12,
};

const button = {
  width: "100%",
  padding: 12,
  background: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: 6,
};