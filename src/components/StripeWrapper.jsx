import { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function StripeWrapper({
  children,
}) {
  const stripePromise = useMemo(() => {
    const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

    return publicKey ? loadStripe(publicKey) : null;
  }, []);

  if (!stripePromise) {
    return children;
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
