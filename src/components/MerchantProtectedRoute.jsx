import { Navigate } from "react-router-dom";

export default function MerchantProtectedRoute({
  children,
}) {
  const token =
    localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") ||
      "null"
  );

  if (!token) {
    return (
      <Navigate
        to="/merchant/login"
        replace
      />
    );
  }

  const allowedRoles = [
    "merchant_owner",
    "merchant_staff",
  ];

  if (
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}