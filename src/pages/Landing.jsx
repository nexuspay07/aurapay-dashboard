import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={page}>
      <div style={contentWrapper}>
        <header style={header}>
          <div>
            <h1 style={logo}>AuraPay</h1>

            <p style={tagline}>
              Smart transfer infrastructure powered by real-time intelligence
            </p>
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
              Intelligent transfer infrastructure for secure, transparent digital
              payments.
            </h2>

            <p style={subtext}>
              AuraPay combines intelligent routing, fraud protection, wallet
              controls, and transfer visibility into one unified financial
              experience.
            </p>

            <div style={heroButtons}>
              <Link to="/register" style={primaryButtonLarge}>
                Get Started
              </Link>

              <Link to="/login" style={secondaryButtonLarge}>
                Sign In
              </Link>
            </div>

            <div style={disclaimerBox}>
              <strong>Demo Notice:</strong> AuraPay is currently running in beta
              mode with test funds and simulated transfers. No real money is
              being moved.
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroCardInner}>
              <p style={cardLabel}>LIVE WALLET OVERVIEW</p>

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
                <span style={miniLabel}>Transfer Visibility</span>
                <span style={miniValue}>Real-Time</span>
              </div>
            </div>
          </div>
        </section>

        <section style={featuresSection}>
          <h3 style={sectionTitle}>Why AuraPay</h3>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <h4 style={featureTitle}>Intelligent Routing</h4>

              <p style={featureText}>
                AuraPay selects the best transfer path in real time using live
                provider performance data.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>Fraud Protection</h4>

              <p style={featureText}>
                Built-in security checks help detect suspicious transfers before
                they are completed.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>Wallet Infrastructure</h4>

              <p style={featureText}>
                Users can manage balances, top up wallets, and track transfer
                activity through one clean interface.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionBlock}>
          <h3 style={sectionTitle}>How AuraPay Works</h3>

          <div style={stepsGrid}>
            <div style={stepCard}>
              <div style={stepNumber}>1</div>

              <h4 style={stepTitle}>Fund Wallet</h4>

              <p style={stepText}>
                Users top up a demo wallet to simulate available transfer
                balance.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>2</div>

              <h4 style={stepTitle}>Send Transfer</h4>

              <p style={stepText}>
                Users submit a transfer amount and currency through a simple
                dashboard flow.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>3</div>

              <h4 style={stepTitle}>Route + Protect</h4>

              <p style={stepText}>
                AuraPay checks risk, evaluates network performance, and routes
                the transfer through the best available path.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionBlock}>
          <h3 style={sectionTitle}>Why It Matters</h3>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <h4 style={featureTitle}>Smarter Transfers</h4>

              <p style={featureText}>
                Instead of relying on one fixed provider, AuraPay can make
                routing decisions dynamically.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>Safer Flow</h4>

              <p style={featureText}>
                Security checks and transfer monitoring help reduce suspicious
                activity before it becomes a bigger issue.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>Better Transparency</h4>

              <p style={featureText}>
                Users can see balances, transfer results, network information,
                and system metrics from one place.
              </p>
            </div>
          </div>
        </section>

        <section style={pitchSection}>
          <h3 style={sectionTitle}>Product Positioning</h3>

          <p style={pitchText}>
            AuraPay is an intelligent transfer infrastructure platform that
            combines wallet systems, fraud protection, and real-time payment
            routing into one seamless experience.
          </p>
        </section>

        <footer style={footer}>
          <p style={footerText}>
            AuraPay Beta • Intelligent transfer infrastructure
          </p>
        </footer>
      </div>
    </div>
  );
}

const page = {
  width: "100%",
  minHeight: "100vh",
  background: "#f5f7fb",
  padding: "32px",
  boxSizing: "border-box",
};

const contentWrapper = {
  width: "100%",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40,
  flexWrap: "wrap",
  gap: 20,
};

const logo = {
  margin: 0,
  fontSize: 42,
  fontWeight: 800,
};

const tagline = {
  marginTop: 8,
  color: "#6b7280",
  fontSize: 18,
};

const navActions = {
  display: "flex",
  gap: 14,
};

const hero = {
  display: "grid",
  gridTemplateColumns: "1.3fr 0.9fr",
  gap: 28,
  marginBottom: 50,
};

const heroContent = {
  background: "#ffffff",
  borderRadius: 22,
  border: "1px solid #e5e7eb",
  padding: 48,
};

const eyebrow = {
  margin: 0,
  fontWeight: 700,
  letterSpacing: "0.1em",
  fontSize: 13,
  color: "#4b5563",
};

const headline = {
  fontSize: 64,
  lineHeight: 1.05,
  marginTop: 20,
  marginBottom: 24,
};

const subtext = {
  color: "#4b5563",
  fontSize: 20,
  lineHeight: 1.8,
};

const heroButtons = {
  display: "flex",
  gap: 16,
  marginTop: 30,
  flexWrap: "wrap",
};

const disclaimerBox = {
  marginTop: 26,
  padding: 18,
  borderRadius: 14,
  background: "#fffbeb",
  border: "1px solid #fde68a",
  color: "#92400e",
  lineHeight: 1.7,
};

const heroCard = {
  background: "linear-gradient(135deg, #0f172a, #111827)",
  borderRadius: 22,
  padding: 40,
  color: "#ffffff",
  display: "flex",
};

const heroCardInner = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const cardLabel = {
  color: "#cbd5e1",
  fontSize: 12,
  letterSpacing: "0.08em",
};

const cardTitle = {
  fontSize: 42,
  marginTop: 18,
  marginBottom: 28,
};

const miniStat = {
  display: "flex",
  justifyContent: "space-between",
  padding: "18px 0",
  borderTop: "1px solid rgba(255,255,255,0.15)",
};

const miniLabel = {
  color: "#d1d5db",
  fontSize: 18,
};

const miniValue = {
  fontWeight: 700,
  fontSize: 18,
};

const featuresSection = {
  marginTop: 10,
};

const sectionBlock = {
  marginTop: 50,
};

const sectionTitle = {
  fontSize: 38,
  marginBottom: 24,
};

const featuresGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 24,
};

const featureCard = {
  background: "#ffffff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 30,
};

const featureTitle = {
  fontSize: 24,
  marginBottom: 14,
};

const featureText = {
  color: "#4b5563",
  lineHeight: 1.8,
  fontSize: 17,
};

const stepsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 24,
};

const stepCard = {
  background: "#ffffff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 30,
};

const stepNumber = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "#111827",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  marginBottom: 18,
};

const stepTitle = {
  fontSize: 24,
  marginBottom: 14,
};

const stepText = {
  color: "#4b5563",
  lineHeight: 1.8,
  fontSize: 17,
};

const pitchSection = {
  marginTop: 50,
  background: "#ffffff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 32,
};

const pitchText = {
  fontSize: 18,
  lineHeight: 1.9,
  color: "#374151",
};

const footer = {
  marginTop: 50,
  paddingTop: 24,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  color: "#6b7280",
};

const baseButton = {
  textDecoration: "none",
  borderRadius: 12,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const primaryButton = {
  ...baseButton,
  background: "#111827",
  color: "#ffffff",
  padding: "12px 18px",
};

const ghostButton = {
  ...baseButton,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "12px 18px",
};

const primaryButtonLarge = {
  ...baseButton,
  background: "#111827",
  color: "#ffffff",
  padding: "16px 24px",
};

const secondaryButtonLarge = {
  ...baseButton,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "16px 24px",
};