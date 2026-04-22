import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import API from "../services/api";

export default function StripeCheckout() {
  const stripe = useStripe();
  const elements = useElements();

  const [provider, setProvider] = useState("stripe");
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStripeSubmit(e) {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/checkout", {
        provider: "stripe",
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
        await API.post("/checkout/save-stripe-payment", {
          amount: Number(amount),
          currency: "usd",
          paymentIntentId: result.paymentIntent.id,
          status: result.paymentIntent.status,
        });

        setMessage("✅ Stripe payment successful and saved!");
      } else {
        setMessage("Stripe payment did not complete.");
      }
    } catch (err) {
      setMessage(err?.response?.data?.error || "❌ Stripe checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h2>Checkout</h2>

        <p style={{ color: "#666" }}>
          Choose a payment network and complete the payment.
        </p>

        <select
          value={provider}
          onChange={(e) => {
            setProvider(e.target.value);
            setMessage("");
          }}
          style={input}
        >
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        {provider === "stripe" && (
          <form onSubmit={handleStripeSubmit}>
            <div style={cardElementBox}>
              <CardElement />
            </div>

            <button disabled={loading} style={button}>
              {loading ? "Processing..." : "Pay with Stripe"}
            </button>
          </form>
        )}

        {provider === "paypal" && (
          <div style={{ marginTop: 12 }}>
            <PayPalScriptProvider
              options={{
                clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  const res = await API.post("/paypal-checkout/create-order", {
                    amount: Number(amount),
                    currency: "USD",
                  });

                  return res.data.id;
                }}
                onApprove={async (data) => {
                  const res = await API.post("/paypal-checkout/capture-order", {
                    orderID: data.orderID,
                    amount: Number(amount),
                    currency: "USD",
                  });

                  setMessage("✅ PayPal payment captured and saved!");
                  console.log("PayPal capture response:", res.data);
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  setMessage("❌ PayPal checkout failed");
                }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {message && <p style={{ marginTop: 14 }}>{message}</p>}
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
};

const card = {
  width: 420,
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
  cursor: "pointer",
};