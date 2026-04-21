import { useState } from "react";
import API from "../services/api";

export default function StripePayment() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function handlePayment() {
    try {
      const res = await API.post("/stripe/create-payment-intent", {
        amount: Number(amount),
        currency: "usd",
      });

      console.log("Client Secret:", res.data.clientSecret);

      setMessage("Payment intent created. Next: confirm payment (Stripe UI)");
    } catch (err) {
      setMessage("Payment failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Stripe Payment Test</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handlePayment}>
        Create Payment
      </button>

      <p>{message}</p>
    </div>
  );
}