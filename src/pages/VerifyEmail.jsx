import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import API from "../services/api";

const verificationRequests = new Map();
function requestVerification(token) {
  if (!verificationRequests.has(token)) {
    verificationRequests.set(token, API.get(`/auth/verify-email/${token}`));
  }
  return verificationRequests.get(token);
}

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let active = true;

    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage("Verification link is missing or invalid.");
        return;
      }

      try {
        await requestVerification(token);

        if (!active) {
          return;
        }

        setStatus("success");
        setMessage("Your email has been verified successfully.");
      } catch (err) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(
          err?.response?.data?.error?.message ||
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "We could not verify your email. Please request a new verification email."
        );
      }
    }

    verifyEmail();

    return () => {
      active = false;
    };
  }, [token]);

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  return (
    <main style={page}>
      <style>{authPageStyles}</style>

      <section style={brandPanel}>
        <Link to="/merchant/login" style={brandLockup}>
          <span style={brandMark}>A</span>
          <span style={brandName}>AuraPay</span>
        </Link>

        <div>
          <p style={eyebrow}>Email verification</p>
          <h1 style={headline}>Confirm your AuraPay identity.</h1>
          <p style={subhead}>
            We are checking your secure verification link and updating
            your account status.
          </p>
        </div>
      </section>

      <section style={formPanel}>
        <div style={card}>
          <div
            style={{
              ...statusIcon,
              ...(isSuccess ? successIcon : null),
              ...(!isLoading && !isSuccess ? errorIcon : null),
            }}
            aria-hidden="true"
          >
            {isLoading ? (
              <span style={largeSpinner} />
            ) : (
              <span>{isSuccess ? "✓" : "!"}</span>
            )}
          </div>

          <p style={formEyebrow}>
            {isLoading
              ? "Verification in progress"
              : isSuccess
                ? "Email verified"
                : "Verification failed"}
          </p>

          <h2 style={formTitle}>
            {isLoading
              ? "Checking your link"
              : isSuccess
                ? "You are verified"
                : "We could not verify this email"}
          </h2>

          <p
            style={{
              ...formSubtitle,
              marginBottom: 24,
            }}
            role={isLoading ? "status" : "alert"}
          >
            {message}
          </p>

          {!isSuccess && !isLoading && <Link to="/resend-verification-email" style={{ ...button, marginBottom: 12 }}>Request a new link</Link>}
          <Link to="/merchant/login" style={button}>
            Go to Sign In
          </Link>
        </div>
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
  textAlign: "center",
};

const statusIcon = {
  width: 64,
  height: 64,
  display: "grid",
  placeItems: "center",
  margin: "0 auto 20px",
  borderRadius: "50%",
  background: "#edf5f2",
  color: "#0f766e",
  fontSize: 28,
  fontWeight: 900,
};

const successIcon = {
  background: "#ecfdf5",
  color: "#047857",
};

const errorIcon = {
  background: "#fef2f2",
  color: "#b91c1c",
};

const largeSpinner = {
  width: 28,
  height: 28,
  borderRadius: "50%",
  border: "3px solid rgba(15, 118, 110, 0.2)",
  borderTopColor: "#0f766e",
  animation: "aurapaySpin 0.8s linear infinite",
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

const button = {
  width: "100%",
  minHeight: 50,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 16px",
  borderRadius: 8,
  background: "#0f766e",
  color: "#fff",
  fontSize: 15,
  fontWeight: 800,
  textDecoration: "none",
  boxSizing: "border-box",
  boxShadow: "0 14px 28px rgba(15, 118, 110, 0.24)",
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
