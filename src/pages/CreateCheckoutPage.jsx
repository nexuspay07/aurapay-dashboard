import { useState } from "react";

import API from "../services/api";

export default function CreateCheckoutPage() {
  const [amount, setAmount] =
    useState("");

  async function createCheckout() {
    try {
      const res =
        await API.post(
          "/checkout-ops/sessions",
          {
            amount:
              Number(amount),
          }
        );

      alert(
        "Checkout Created: " +
          res.data.sessionId
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      style={{
        padding: 40,
      }}
    >
      <h1>
        Create Checkout
      </h1>

      <input
        value={amount}
        onChange={(e) =>
          setAmount(
            e.target.value
          )
        }
        placeholder="Amount"
      />

      <button
        onClick={
          createCheckout
        }
      >
        Create
      </button>
    </div>
  );
}