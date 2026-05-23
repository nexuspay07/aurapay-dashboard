import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      await register(form);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err.message ||
          "Registration failed"
      );
    }
  }

  return (
    <div style={container}>
      <form
        onSubmit={handleSubmit}
        style={card}
      >
        <h1>Register</h1>

        {error && (
          <div style={alert}>
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
              password: e.target.value,
            })
          }
        />

        <button
          style={button}
          type="submit"
        >
          Create Account
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
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
  width: 360,
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const button = {
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const alert = {
  padding: 12,
  borderRadius: 8,
  background: "#fee2e2",
  color: "#991b1b",
  marginBottom: 12,
};