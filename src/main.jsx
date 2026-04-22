import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AuthProvider } from "./context/AuthContext";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </AuthProvider>
  </React.StrictMode>
);