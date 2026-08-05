import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../../services/api";

export default function MerchantLogin() {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [
    rememberMe,
    setRememberMe,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const res =
        await API.post(
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
          "Not a merchant account."
        );
        return;
      }

      if (rememberMe) {
        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        sessionStorage.removeItem(
          "token"
        );

        sessionStorage.removeItem(
          "user"
        );
      } else {
        sessionStorage.setItem(
          "token",
          res.data.token
        );

        sessionStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );
      }

      navigate(
        "/merchant/dashboard"
      );
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data
          ?.error ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <form
        onSubmit={
          handleLogin
        }
        style={card}
      >
        <h1 style={title}>
          Merchant Login
        </h1>

        {error && (
          <div
            style={errorBox}
          >
            {error}
          </div>
        )}

        <input
          style={input}
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target
                  .value,
            })
          }
        />

        <input
          style={input}
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target
                  .value,
            })
          }
        />

        <div
          style={optionsRow}
        >
          <label
            style={
              rememberLabel
            }
          >
            <input
              type="checkbox"
              checked={
                rememberMe
              }
              onChange={(
                e
              ) =>
                setRememberMe(
                  e.target
                    .checked
                )
              }
            />

            Remember Me
          </label>

          <Link
            to="/forgot-password"
            style={link}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={button}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

        <div style={footer}>
          <p
            style={
              footerText
            }
          >
            Didn't receive
            your verification
            email?
          </p>

          <Link
            to="/resend-verification-email"
            style={link}
          >
            Resend
            Verification
            Email
          </Link>

          <p
            style={{
              marginTop: 18,
            }}
          >
            New Merchant?{" "}
            <Link
              to="/merchant/register"
              style={link}
            >
              Create
              Account
            </Link>
          </p>
        </div>

              </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f3f4f6",
  padding: 16,
  boxSizing: "border-box",
  overflowX: "hidden",
};

const card = {
  width: "min(430px, 100%)",
  background: "#fff",
  padding: 32,
  borderRadius: 20,
  border: "1px solid #e5e7eb",
  boxSizing: "border-box",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
};

const title = {
  marginTop: 0,
  marginBottom: 24,
  textAlign: "center",
  fontSize: 30,
  fontWeight: 700,
  color: "#111827",
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 16,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  boxSizing: "border-box",
  fontSize: 15,
};

const optionsRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 20,
};

const rememberLabel = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  cursor: "pointer",
  color: "#374151",
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
  fontSize: 15,
};

const footer = {
  marginTop: 24,
  textAlign: "center",
};

const footerText = {
  marginBottom: 10,
  color: "#6b7280",
  fontSize: 14,
};

const link = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 600,
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 12,
  borderRadius: 10,
  marginBottom: 18,
  textAlign: "center",
};
