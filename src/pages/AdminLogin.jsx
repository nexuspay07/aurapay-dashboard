import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post(
        "/admin-auth/login",
        form
      );

      localStorage.setItem(
        "adminToken",
        res.data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(res.data.admin)
      );

      navigate("/admin");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <form
        onSubmit={handleSubmit}
        style={card}
      >
        <h1 style={title}>
          AuraPay Admin
        </h1>

        <p style={subtitle}>
          Secure Operations Access
        </p>

        {error && (
          <div style={alert}>
            {error}
          </div>
        )}

        <input
          style={input}
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
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
          style={button}
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Admin Login"}
        </button>
      </form>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f3f4f6",
};

const card = {
  width: 420,
  background: "#fff",
  padding: 32,
  borderRadius: 16,
  border: "1px solid #ddd",
};

const title = {
  marginBottom: 8,
};

const subtitle = {
  marginBottom: 24,
  color: "#666",
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 16,
  borderRadius: 10,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 14,
  border: "none",
  borderRadius: 10,
  background: "#111827",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const alert = {
  padding: 12,
  borderRadius: 10,
  background: "#fef3c7",
  marginBottom: 16,
};