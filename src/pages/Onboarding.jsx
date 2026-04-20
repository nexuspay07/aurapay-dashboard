import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AlertBanner from "../components/AlertBanner";

export default function Onboarding() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    country: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await API.post("/onboarding", form);

      setMessage({
        type: "success",
        text: "Onboarding submitted successfully. Your account is now pending verification.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      const data = err?.response?.data;
      setMessage({
        type: "danger",
        text: data?.error || "Onboarding failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ marginTop: 0 }}>Complete Onboarding</h2>
        <p style={{ color: "#666", marginTop: 0 }}>
          Tell us a little about your account before using larger transfers.
        </p>

        {message && (
          <AlertBanner message={message.text} type={message.type} />
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={input}
            placeholder="Business Name"
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Owner Name"
            value={form.ownerName}
            onChange={(e) =>
              setForm({ ...form, ownerName: e.target.value })
            }
          />

          <input
            style={input}
            placeholder="Country"
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
          />

          <button style={button} disabled={loading} type="submit">
            {loading ? "Submitting..." : "Submit Onboarding"}
          </button>
        </form>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#f5f7fb",
  display: "grid",
  placeItems: "center",
  padding: 24,
};

const card = {
  width: "100%",
  maxWidth: 480,
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: 24,
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