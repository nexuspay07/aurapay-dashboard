import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={page}>
      <header style={header}>
        <div>
          <h1 style={logo}>AuraPay</h1>
          <p style={tagline}>Smart transfers powered by intelligence</p>
        </div>

        <div style={navActions}>
          <Link to="/login" style={ghostButton}>
            Login
          </Link>
          <Link to="/register" style={primaryButton}>
            Create Account
          </Link>
        </div>
      </header>

      <section style={hero}>
        <div style={heroContent}>
          <p style={eyebrow}>AURAPAY BETA</p>

          <h2 style={headline}>
            Secure digital transfers with fraud protection and intelligent routing.
          </h2>

          <p style={subtext}>
            AuraPay combines smart provider selection, real-time wallet balances,
            fraud monitoring, and transparent transaction tracking into one clean experience.
          </p>

          <div style={heroButtons}>
            <Link to="/register" style={primaryButtonLarge}>
              Get Started
            </Link>
            <Link to="/login" style={secondaryButtonLarge}>
              Sign In
            </Link>
          </div>
        </div>

        <div style={heroCard}>
          <div style={heroCardInner}>
            <p style={cardLabel}>Live Wallet Overview</p>
            <h3 style={cardTitle}>Fast. Clear. Secure.</h3>

            <div style={miniStat}>
              <span style={miniLabel}>AI Routing</span>
              <span style={miniValue}>Active</span>
            </div>

            <div style={miniStat}>
              <span style={miniLabel}>Fraud Protection</span>
              <span style={miniValue}>Enabled</span>
            </div>

            <div style={miniStat}>
              <span style={miniLabel}>Transfer Status</span>
              <span style={miniValue}>Real-Time</span>
            </div>
          </div>
        </div>
      </section>

      <section style={featuresSection}>
        <h3 style={sectionTitle}>Why AuraPay</h3>

        <div style={featuresGrid}>
          <div style={featureCard}>
            <h4 style={featureTitle}>AI Routing</h4>
            <p style={featureText}>
              AuraPay intelligently chooses the best provider path based on performance,
              speed, and success history.
            </p>
          </div>

          <div style={featureCard}>
            <h4 style={featureTitle}>Fraud Protection</h4>
            <p style={featureText}>
              Built-in fraud checks and account defense help detect risky transfers
              before they become problems.
            </p>
          </div>

          <div style={featureCard}>
            <h4 style={featureTitle}>Real-Time Wallet</h4>
            <p style={featureText}>
              Users can view balances, recent transfers, and system intelligence
              instantly from one dashboard.
            </p>
          </div>
        </div>
      </section>

      <footer style={footer}>
        <p style={footerText}>AuraPay Beta • Intelligent transfer infrastructure</p>
      </footer>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#f5f7fb",
  color: "#111827",
  padding: "24px 32px 40px",
  boxSizing: "border-box",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40,
  gap: 16,
  flexWrap: "wrap",
};

const logo = {
  margin: 0,
  fontSize: 32,
  fontWeight: 800,
};

const tagline = {
  margin: "6px 0 0",
  color: "#6b7280",
};

const navActions = {
  display: "flex",
  gap: 12,
  alignItems: "center",
};

const hero = {
  display: "grid",
  gridTemplateColumns: "1.3fr 0.9fr",
  gap: 24,
  alignItems: "stretch",
  marginBottom: 40,
};

const heroContent = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 32,
};

const eyebrow = {
  margin: 0,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: "#4b5563",
};

const headline = {
  margin: "14px 0 14px",
  fontSize: 42,
  lineHeight: 1.1,
  maxWidth: 720,
};

const subtext = {
  margin: 0,
  color: "#4b5563",
  fontSize: 16,
  lineHeight: 1.7,
  maxWidth: 700,
};

const heroButtons = {
  display: "flex",
  gap: 14,
  marginTop: 28,
  flexWrap: "wrap",
};

const heroCard = {
  background: "linear-gradient(135deg, #111827, #1f2937)",
  borderRadius: 18,
  padding: 24,
  color: "#ffffff",
  display: "flex",
  alignItems: "stretch",
};

const heroCardInner = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const cardLabel = {
  margin: 0,
  color: "#cbd5e1",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const cardTitle = {
  margin: "10px 0 24px",
  fontSize: 28,
};

const miniStat = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 0",
  borderTop: "1px solid rgba(255,255,255,0.12)",
};

const miniLabel = {
  color: "#d1d5db",
};

const miniValue = {
  fontWeight: 700,
};

const featuresSection = {
  marginTop: 12,
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 18,
  fontSize: 28,
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 20,
};

const featureCard = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 24,
};

const featureTitle = {
  marginTop: 0,
  marginBottom: 12,
  fontSize: 20,
};

const featureText = {
  margin: 0,
  color: "#4b5563",
  lineHeight: 1.7,
};

const footer = {
  marginTop: 36,
  paddingTop: 16,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  margin: 0,
  color: "#6b7280",
  fontSize: 14,
};

const baseButton = {
  textDecoration: "none",
  borderRadius: 10,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const primaryButton = {
  ...baseButton,
  background: "#111827",
  color: "#ffffff",
  padding: "10px 16px",
};

const ghostButton = {
  ...baseButton,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "10px 16px",
};

const primaryButtonLarge = {
  ...baseButton,
  background: "#111827",
  color: "#ffffff",
  padding: "14px 20px",
};

const secondaryButtonLarge = {
  ...baseButton,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "14px 20px",
};