import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={page}>
      <div style={contentWrapper}>
        <header style={header}>
          <div>
            <h1 style={logo}>AuraPay</h1>

            <p style={tagline}>
              Merchant payment infrastructure for modern businesses
            </p>
          </div>

          <div style={navActions}>
            <Link to="/merchant/login" style={ghostButton}>
              Merchant Login
            </Link>

            <Link
              to="/merchant/register"
              style={primaryButton}
            >
              Become a Merchant
            </Link>
          </div>
        </header>

        <section style={hero}>
          <div style={heroContent}>
            <p style={eyebrow}>
              PAYMENT INFRASTRUCTURE
            </p>

            <h2 style={headline}>
              Accept payments online through
              AuraPay.
            </h2>

            <p style={subtext}>
              Create checkout links, host secure
              payment pages, monitor transactions,
              and track settlements from one
              unified merchant platform.
            </p>

            <div style={heroButtons}>
              <Link
                to="/merchant/register"
                style={primaryButtonLarge}
              >
                Start Accepting Payments
              </Link>

              <Link
                to="/merchant/login"
                style={secondaryButtonLarge}
              >
                Merchant Login
              </Link>
            </div>

            <div style={statusBox}>
              <strong>
                Enterprise Platform Status:
              </strong>
              <br />
              Merchant onboarding, checkout
              creation, hosted checkout, payment
              monitoring, and settlement
              infrastructure are operational.
            </div>
          </div>

          <div style={heroCard}>
            <div style={heroCardInner}>
              <p style={cardLabel}>
                LIVE PLATFORM STATUS
              </p>

              <h3 style={cardTitle}>
                Fast. Secure. Scalable.
              </h3>

              <div style={miniStat}>
                <span style={miniLabel}>
                  Checkout Engine
                </span>
                <span style={miniValue}>
                  Active
                </span>
              </div>

              <div style={miniStat}>
                <span style={miniLabel}>
                  Merchant Services
                </span>
                <span style={miniValue}>
                  Online
                </span>
              </div>

              <div style={miniStat}>
                <span style={miniLabel}>
                  Settlement Engine
                </span>
                <span style={miniValue}>
                  Active
                </span>
              </div>

              <div style={miniStat}>
                <span style={miniLabel}>
                  Fraud Monitoring
                </span>
                <span style={miniValue}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

        <section style={featuresSection}>
          <h3 style={sectionTitle}>
            Why Businesses Choose AuraPay
          </h3>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <h4 style={featureTitle}>
                Merchant Accounts
              </h4>

              <p style={featureText}>
                Register your business and manage
                payment operations from a unified
                merchant dashboard.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>
                Hosted Checkout
              </h4>

              <p style={featureText}>
                Generate checkout sessions and
                accept payments through secure
                AuraPay payment pages.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>
                Settlement Tracking
              </h4>

              <p style={featureText}>
                Monitor transaction activity,
                revenue flow, and settlement
                status in real time.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionBlock}>
          <h3 style={sectionTitle}>
            How AuraPay Works
          </h3>

          <div style={stepsGrid}>
            <div style={stepCard}>
              <div style={stepNumber}>
                1
              </div>

              <h4 style={stepTitle}>
                Register Business
              </h4>

              <p style={stepText}>
                Create a merchant account and
                onboard your business to AuraPay.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>
                2
              </div>

              <h4 style={stepTitle}>
                Create Checkout
              </h4>

              <p style={stepText}>
                Generate checkout links and hosted
                payment sessions for customers.
              </p>
            </div>

            <div style={stepCard}>
              <div style={stepNumber}>
                3
              </div>

              <h4 style={stepTitle}>
                Accept Payments
              </h4>

              <p style={stepText}>
                Receive payments, monitor revenue,
                and track settlements from one
                dashboard.
              </p>
            </div>
          </div>
        </section>

        <section style={sectionBlock}>
          <h3 style={sectionTitle}>
            Platform Capabilities
          </h3>

          <div style={featuresGrid}>
            <div style={featureCard}>
              <h4 style={featureTitle}>
                Checkout Operations
              </h4>

              <p style={featureText}>
                Create, monitor, and manage hosted
                checkout sessions.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>
                Fraud Protection
              </h4>

              <p style={featureText}>
                Risk monitoring and transaction
                intelligence built directly into
                the platform.
              </p>
            </div>

            <div style={featureCard}>
              <h4 style={featureTitle}>
                Revenue Visibility
              </h4>

              <p style={featureText}>
                Track payments, transaction
                success, and settlement activity
                from one interface.
              </p>
            </div>
          </div>
        </section>

        <section style={pitchSection}>
          <h3 style={sectionTitle}>
            Built For Modern Commerce
          </h3>

          <p style={pitchText}>
            AuraPay provides merchant payment
            infrastructure that enables businesses
            to create checkout experiences, accept
            payments, monitor transactions, manage
            settlements, and operate through a
            unified payment platform.
          </p>
        </section>

        <footer style={footer}>
          <p style={footerText}>
            AuraPay • Merchant Payment
            Infrastructure
          </p>
        </footer>
      </div>
    </div>
  );
}

/* KEEP ALL YOUR EXISTING STYLES BELOW */
/* page, contentWrapper, header, logo, tagline, navActions, hero, heroContent, etc */

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

const statusBox = {
  marginTop: 26,
  padding: 18,
  borderRadius: 14,
  background: "#eef6ff",
  border: "1px solid #bfdbfe",
  color: "#1e3a8a",
};

const heroCard = {
  background: "linear-gradient(135deg, #0f172a, #111827)",
  borderRadius: 22,
  padding: 40,
  color: "#ffffff",
};

const heroCardInner = {
  width: "100%",
};

const cardLabel = {
  color: "#cbd5e1",
  fontSize: 12,
};

const cardTitle = {
  fontSize: 42,
};

const miniStat = {
  display: "flex",
  justifyContent: "space-between",
  padding: "18px 0",
  borderTop:
    "1px solid rgba(255,255,255,0.15)",
};

const miniLabel = {
  color: "#d1d5db",
};

const miniValue = {
  fontWeight: 700,
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
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: 24,
};

const featureCard = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 30,
};

const featureTitle = {
  fontSize: 24,
};

const featureText = {
  color: "#4b5563",
};

const stepsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: 24,
};

const stepCard = {
  background: "#fff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 30,
};

const stepNumber = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  background: "#111827",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const stepTitle = {
  fontSize: 24,
};

const stepText = {
  color: "#4b5563",
};

const pitchSection = {
  marginTop: 50,
  background: "#fff",
  borderRadius: 18,
  border: "1px solid #e5e7eb",
  padding: 32,
};

const pitchText = {
  color: "#374151",
};

const footer = {
  marginTop: 50,
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
  color: "#fff",
  padding: "12px 18px",
};

const ghostButton = {
  ...baseButton,
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "12px 18px",
};

const primaryButtonLarge = {
  ...baseButton,
  background: "#111827",
  color: "#fff",
  padding: "16px 24px",
};

const secondaryButtonLarge = {
  ...baseButton,
  background: "#fff",
  color: "#111827",
  border: "1px solid #d1d5db",
  padding: "16px 24px",
};