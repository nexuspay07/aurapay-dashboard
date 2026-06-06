import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function StripePaymentForm({
  clientSecret,
  sessionId,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  async function handlePay() {
    if (!stripe || !elements)
      return;

    setLoading(true);

    const result =
      await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card:
              elements.getElement(
                CardElement
              ),
          },
        }
      );

    setLoading(false);

    if (result.error) {
      alert(result.error.message);
      return;
    }

    await API.post(
  `/payment-completion/complete/${sessionId}`
);

navigate(
  "/payment-success"
);
  }

  return (
    <>
      <div
        style={{
          padding: 16,
          border:
            "1px solid #E2E8F0",
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <CardElement />
      </div>

      <button
        onClick={handlePay}
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : "Pay Now"}
      </button>
    </>
  );
}