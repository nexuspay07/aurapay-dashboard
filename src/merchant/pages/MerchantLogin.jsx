import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

export default function MerchantLogin() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post(
        "/auth/login",
        form
      );

      const user =
        res.data.user;

      const allowedRoles = [
        "merchant_owner",
        "merchant_staff",
      ];

      if (
        !allowedRoles.includes(
          user.role
        )
      ) {
        setError(
          "Not a merchant account"
        );

        return;
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate(
        "/merchant/dashboard"
      );
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data
          ?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <form
        onSubmit={handleLogin}
        style={card}
      >
        <h1
          style={{
            marginBottom: 24,
          }}
        >
          Merchant Login
        </h1>

        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        <input
          style={input}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          style={input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          style={button}
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f3f4f6",
};

const card = {
  width: 420,
  background: "#fff",
  padding: 30,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 14,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 14,
  border: "none",
  borderRadius: 10,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 12,
  borderRadius: 10,
  marginBottom: 14,
};