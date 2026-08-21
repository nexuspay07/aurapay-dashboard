import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import API from "../services/api";

export default function ResendVerification() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailError = useMemo(() => {
    const value = email.trim();

    if (!value) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address.";
    }

    return "";
  }, [email]);

  function getBackendMessage(err) {
    return (
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "We could not resend the verification email. Please try again."
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    setError("");
    setSuccess("");

    if (emailError) {
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/resend-verification", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(
        res?.data?.message ||
          "Verification email sent. Please check your inbox."
      );
    } catch (err) {
      setError(getBackendMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const showEmailError = touched && emailError;

  return (
    <main style={page}>
      <style>{authPageStyles}</style>

      <section style={brandPanel}>
        <Link to="/merchant/login" style={brandLockup}>
          <span style={brandMark}>A</span>
          <span style={brandName}>AuraPay</span>
        </Link>

        <div>
          <p style={eyebrow}>Verification email</p>
          <h1 style={headline}>Get a fresh verification link.</h1>
          <p style={subhead}>
            Confirm your email address so AuraPay can protect your
            account and unlock the full dashboard experience.
          </p>
        </div>
      </section>

      <section style={formPanel}>
        <form onSubmit={handleSubmit} style={card} noValidate>
          <div style={formHeader}>
            <p style={formEyebrow}>Account verification</p>
            <h2 style={formTitle}>Resend verification</h2>
            <p style={formSubtitle}>
              Enter your account email and we will send a new
              verification message.
            </p>
          </div>

          {success && (
            <div style={successBanner} role="status">
              {success}
            </div>
          )}

          {error && (
            <div style={errorBanner} role="alert">
              {error}
            </div>
          )}

          <div style={fieldGroup}>
            <label htmlFor="email" style={label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              placeholder="name@company.com"
              autoComplete="email"
              inputMode="email"
              disabled={loading}
              style={{
                ...input,
                ...(showEmailError ? inputError : null),
              }}
              aria-invalid={Boolean(showEmailError)}
              aria-describedby={
                showEmailError ? "email-error" : undefined
              }
              onBlur={() => setTouched(true)}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
            />
            {showEmailError && (
              <p id="email-error" style={fieldError}>
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(emailError)}
            style={{
              ...button,
              ...(loading || emailError ? buttonDisabled : null),
            }}
          >
            {loading && <span style={spinner} aria-hidden="true" />}
            <span>
              {loading ? "Sending..." : "Resend verification email"}
            </span>
          </button>

          <p style={footerText}>
            Ready to sign in?{" "}
            <Link to="/merchant/login" style={strongLink}>
              Back to Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) minmax(360px, 520px)",
  background:
    "linear-gradient(135deg, #eef7f4 0%, #f8fafc 52%, #fff7ed 100%)",
  color: "#10201c",
};

const brandPanel = {
  minHeight: "100vh",
  padding: "clamp(28px, 5vw, 72px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 40,
  background:
    "linear-gradient(145deg, #0f2f2c 0%, #143f39 48%, #274634 100%)",
  color: "#f8fffc",
};

const brandLockup = {
  display: "inline-flex",
  alignItems: "center",
  gap: 12,
  color: "#f8fffc",
  fontWeight: 800,
  textDecoration: "none",
  letterSpacing: 0,
};

const brandMark = {
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  borderRadius: 12,
  background: "#f4c95d",
  color: "#10201c",
  fontSize: 22,
};

const brandName = {
  fontSize: 22,
};

const eyebrow = {
  margin: "0 0 14px",
  color: "#a7f3d0",
  fontSize: 14,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const headline = {
  margin: 0,
  maxWidth: 680,
  fontSize: "clamp(40px, 6vw, 72px)",
  lineHeight: 1,
  letterSpacing: 0,
};

const subhead = {
  maxWidth: 560,
  margin: "24px 0 0",
  color: "#d9f5ed",
  fontSize: 18,
  lineHeight: 1.7,
};

const formPanel = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "32px clamp(18px, 4vw, 56px)",
};

const card = {
  width: "100%",
  maxWidth: 430,
  background: "rgba(255, 255, 255, 0.94)",
  padding: "clamp(24px, 4vw, 36px)",
  borderRadius: 8,
  border: "1px solid rgba(15, 47, 44, 0.12)",
  boxShadow: "0 24px 80px rgba(15, 47, 44, 0.12)",
  boxSizing: "border-box",
};

const formHeader = {
  marginBottom: 24,
};

const formEyebrow = {
  margin: "0 0 8px",
  color: "#0f766e",
  fontSize: 13,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0,
};

const formTitle = {
  margin: 0,
  color: "#10201c",
  fontSize: 30,
  lineHeight: 1.15,
  letterSpacing: 0,
};

const formSubtitle = {
  margin: "10px 0 0",
  color: "#5f706b",
  fontSize: 15,
  lineHeight: 1.6,
};

const fieldGroup = {
  marginTop: 16,
};

const label = {
  display: "block",
  marginBottom: 8,
  color: "#20322e",
  fontSize: 14,
  fontWeight: 700,
};

const input = {
  width: "100%",
  minHeight: 48,
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #cbd8d3",
  background: "#ffffff",
  color: "#10201c",
  fontSize: 15,
  lineHeight: 1.4,
  outline: "none",
  boxSizing: "border-box",
};

const inputError = {
  borderColor: "#dc2626",
  background: "#fffafa",
};

const fieldError = {
  margin: "7px 0 0",
  color: "#b91c1c",
  fontSize: 13,
  lineHeight: 1.4,
};

const button = {
  width: "100%",
  minHeight: 50,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  marginTop: 22,
  padding: "13px 16px",
  border: "none",
  borderRadius: 8,
  background: "#0f766e",
  color: "#fff",
  cursor: "pointer",
  fontSize: 15,
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(15, 118, 110, 0.24)",
};

const buttonDisabled = {
  opacity: 0.64,
  cursor: "not-allowed",
  boxShadow: "none",
};

const spinner = {
  width: 16,
  height: 16,
  borderRadius: "50%",
  border: "2px solid rgba(255, 255, 255, 0.45)",
  borderTopColor: "#ffffff",
  animation: "aurapaySpin 0.8s linear infinite",
};

const successBanner = {
  marginBottom: 16,
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #99f6e4",
  background: "#ecfdf5",
  color: "#065f46",
  fontSize: 14,
  lineHeight: 1.5,
};

const errorBanner = {
  marginBottom: 16,
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#991b1b",
  fontSize: 14,
  lineHeight: 1.5,
};

const footerText = {
  margin: "22px 0 0",
  paddingTop: 20,
  borderTop: "1px solid #e5ece9",
  color: "#5f706b",
  textAlign: "center",
  fontSize: 14,
  lineHeight: 1.5,
};

const strongLink = {
  color: "#0f2f2c",
  fontWeight: 800,
  textDecoration: "none",
};

const authPageStyles = `
  @keyframes aurapaySpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    main {
      grid-template-columns: 1fr !important;
    }

    main > section:first-of-type {
      min-height: auto !important;
      padding: 28px 20px 32px !important;
    }

    main > section:last-of-type {
      min-height: auto !important;
      padding: 28px 18px 40px !important;
    }
  }

  @media (max-width: 560px) {
    main > section:first-of-type h1 {
      font-size: 36px !important;
      line-height: 1.05 !important;
    }
  }
`;
