import { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
  ["Products", "#products"],
  ["Developers", "#developers"],
  ["Security", "#security"],
  ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"],
  ["FAQ", "#faq"],
];

const capabilities = [
  {
    title: "Hosted Checkout",
    icon: "checkout",
    items: ["Create payment links", "Mobile-friendly checkout", "Payment status tracking"],
  },
  {
    title: "Merchant Dashboard",
    icon: "dashboard",
    items: ["Revenue overview", "Transactions", "Settlements", "Analytics"],
  },
  {
    title: "Developer API",
    icon: "api",
    items: ["API keys", "Versioned /api/v1 endpoints", "Idempotency", "API logs"],
  },
  {
    title: "Webhooks",
    icon: "webhooks",
    items: ["Event subscriptions", "Delivery history", "Retry failed deliveries", "Signing secrets"],
  },
  {
    title: "Applications",
    icon: "apps",
    items: ["Redirect URLs", "Allowed origins", "Sandbox configuration"],
  },
  {
    title: "Security Controls",
    icon: "security",
    items: ["Authentication", "Permissions", "Rate limiting", "Request IDs", "Sanitized logs"],
  },
];

const steps = [
  {
    title: "Create a merchant account",
    text: "Open a sandbox merchant workspace for dashboard and API testing.",
  },
  {
    title: "Generate a sandbox API key",
    text: "Choose permission scopes, copy the one-time secret, and start locally.",
  },
  {
    title: "Create a checkout or API request",
    text: "Use hosted checkout pages or call the versioned REST API directly.",
  },
  {
    title: "Review transactions and API logs",
    text: "Inspect sanitized request details, statuses, settlements, and webhook deliveries.",
  },
];

const securityItems = [
  "API-key authentication",
  "Merchant-scoped data access",
  "Permission enforcement",
  "Rate limiting",
  "Idempotency",
  "Request IDs",
  "Webhook signing secrets",
  "Sanitized API logs",
];

const available = [
  "Merchant accounts",
  "Hosted checkouts",
  "Transactions",
  "Settlements",
  "Analytics",
  "API keys",
  "Applications",
  "Webhooks",
  "API logs",
  "Developer documentation",
];

const unavailable = [
  "Real-money processing",
  "Live production keys",
  "Real payouts",
  "Fund custody",
];

const faqs = [
  {
    question: "What is AuraPay?",
    answer:
      "AuraPay is sandbox payment infrastructure for merchants and developers testing hosted checkout, transaction monitoring, settlements, webhooks, and API integrations.",
  },
  {
    question: "Does AuraPay process real money?",
    answer:
      "No. AuraPay is currently in Sandbox Beta, and no real funds are processed.",
  },
  {
    question: "Is the Sandbox Beta free?",
    answer:
      "Yes. Sandbox Beta access is $0 during beta. Production pricing will be announced before live payment processing launches.",
  },
  {
    question: "Can developers use the API?",
    answer:
      "Yes. Developers can use sandbox API keys with versioned /api/v1 endpoints, idempotency keys, request IDs, logs, and webhook testing.",
  },
  {
    question: "Are API keys secure?",
    answer:
      "Secret keys are shown only immediately after creation or rotation in the merchant dashboard. The platform enforces key permissions and merchant-scoped access.",
  },
  {
    question: "Can I test webhooks?",
    answer:
      "Yes. Merchants can create webhook endpoints, regenerate signing secrets, send test deliveries, inspect delivery history, and retry failed deliveries.",
  },
  {
    question: "When will live payments launch?",
    answer:
      "Live payment processing is not available in Sandbox Beta. Launch timing and production pricing will be announced before live processing opens.",
  },
];

const checkoutCurl = `curl -X POST "https://sandbox-api.aurapay.test/api/v1/checkouts" \\
  -H "Authorization: Bearer sk_test_your_secret_key" \\
  -H "Idempotency-Key: checkout_2026_001" \\
  -H "X-Request-Id: req_demo_checkout_001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2500,
    "currency": "usd",
    "customerEmail": "customer@example.com"
  }'`;

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div style={page}>
      <style>{responsiveStyles}</style>

      <header style={header}>
        <a href="#top" style={brand} aria-label="AuraPay home" onClick={closeMenu}>
          <span style={logoMark}>A</span>
          <span style={brandText}>AuraPay</span>
          <span style={betaBadge}>Sandbox Beta</span>
        </a>

        <button
          type="button"
          className="mobile-menu-button"
          style={mobileMenuButton}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span style={menuLine} />
          <span style={menuLine} />
          <span style={menuLine} />
        </button>

        <nav
          className={menuOpen ? "landing-nav is-open" : "landing-nav"}
          style={nav}
          aria-label="Primary navigation"
        >
          <div style={navLinks}>
            {navItems.map(([label, href]) => (
              <a key={href} href={href} style={navLink} onClick={closeMenu}>
                {label}
              </a>
            ))}
          </div>

          <div style={navActions}>
            <Link to="/merchant/login" style={ghostButton} onClick={closeMenu}>
              Merchant Login
            </Link>
            <Link to="/merchant/register" style={primaryButton} onClick={closeMenu}>
              Start Building
            </Link>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero-grid" style={hero}>
          <div style={heroCopy}>
            <div style={noticePill}>AuraPay is currently in Sandbox Beta. No real funds are processed.</div>
            <h1 style={headline}>Payments infrastructure built for modern businesses.</h1>
            <p style={heroText}>
              Create hosted checkout links, manage transactions, monitor settlements,
              and integrate through one secure sandbox API.
            </p>
            <div style={heroActions}>
              <Link to="/merchant/register" style={primaryButtonLarge}>
                Start Building
              </Link>
              <Link to="/merchant/developer/documentation" style={secondaryButtonLarge}>
                View Documentation
              </Link>
            </div>
            <div style={heroFacts}>
              <span>REST API</span>
              <span>Sandbox keys</span>
              <span>Webhook testing</span>
            </div>
          </div>

          <div className="product-preview" style={productPreview} aria-label="AuraPay dashboard and checkout preview">
            <DashboardMockup />
            <div className="preview-side" style={previewSide}>
              <TransactionCard />
              <ApiRequestCard />
              <CheckoutPreviewSmall />
            </div>
          </div>
        </section>

        <section id="products" style={section}>
          <SectionIntro
            kicker="Products"
            title="Everything a sandbox merchant needs to test payment operations."
            text="AuraPay combines hosted checkout, dashboard workflows, and a developer API without claiming live processing before it exists."
          />
          <div className="capability-grid" style={capabilityGrid}>
            {capabilities.map((capability) => (
              <article key={capability.title} style={capabilityCard}>
                <Icon name={capability.icon} />
                <h3 style={cardTitle}>{capability.title}</h3>
                <ul style={list}>
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" style={sectionTint}>
          <SectionIntro
            kicker="How It Works"
            title="From account to API logs in four clear steps."
            text="The beta flow is intentionally practical: create a merchant account, generate credentials, make sandbox requests, and review the results."
          />
          <div className="steps-grid" style={stepsGrid}>
            {steps.map((step, index) => (
              <article key={step.title} style={stepCard}>
                <div style={stepNumber}>{index + 1}</div>
                <h3 style={cardTitle}>{step.title}</h3>
                <p style={mutedText}>{step.text}</p>
                <div style={stepVisual}>
                  <span style={{ width: `${35 + index * 14}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="developers" className="developer-grid" style={developerSection}>
          <div>
            <SectionIntro
              kicker="Developer Experience"
              title="A real REST API surface for sandbox checkout testing."
              text="Use sandbox keys, idempotent requests, request logging, and webhook testing while every request remains scoped to the merchant account."
              compact
            />
            <div style={developerList}>
              {["REST API", "Sandbox keys", "Idempotent requests", "Request logging", "Webhook testing"].map((item) => (
                <span key={item} style={featureChip}>{item}</span>
              ))}
            </div>
            <div style={sectionActions}>
              <Link to="/merchant/developer/documentation" style={primaryButton}>
                Read Documentation
              </Link>
              <Link to="/merchant/login" style={ghostButtonDark}>
                Merchant Login
              </Link>
            </div>
          </div>

          <div style={codePanel}>
            <div style={codeHeader}>
              <span>POST /api/v1/checkouts</span>
              <span style={codeBadge}>Sandbox</span>
            </div>
            <pre style={codeBlock}>{checkoutCurl}</pre>
          </div>
        </section>

        <section style={section}>
          <div className="checkout-grid" style={checkoutGrid}>
            <div>
              <SectionIntro
                kicker="Hosted Checkout"
                title="Preview the customer payment flow before live money is available."
                text="This visual is a frontend preview only. It represents a sandbox checkout state and does not indicate a real completed payment."
                compact
              />
              <Link to="/merchant/create-checkout" style={primaryButton}>
                Create Your First Checkout
              </Link>
            </div>
            <HostedCheckoutPreview />
          </div>
        </section>

        <section id="security" style={sectionTint}>
          <SectionIntro
            kicker="Security"
            title="Accurate controls for sandbox development and product testing."
            text="AuraPay Sandbox Beta is for development and product testing only. No PCI, SOC 2, regulatory, or uptime claims are made here."
          />
          <div className="security-grid" style={securityGrid}>
            {securityItems.map((item) => (
              <div key={item} style={securityItem}>
                <Icon name="security" small />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="sandbox" className="beta-grid" style={betaSection}>
          <div>
            <SectionIntro
              kicker="Sandbox Beta"
              title="Available for build, test, and review workflows."
              text="AuraPay is open for sandbox integration work. Live production payment processing is intentionally not enabled."
              compact
            />
            <Link to="/merchant/register" style={primaryButtonLarge}>
              Join Sandbox Beta
            </Link>
          </div>
          <AvailabilityCard title="Available now" items={available} positive />
          <AvailabilityCard title="Not available" items={unavailable} />
        </section>

        <section id="pricing" style={section}>
          <SectionIntro
            kicker="Pricing"
            title="Sandbox Beta is $0 during beta."
            text="Production pricing will be announced before live payment processing launches."
          />
          <article style={pricingCard}>
            <div>
              <span style={betaBadge}>Sandbox Beta</span>
              <h3 style={price}>$0</h3>
              <p style={mutedText}>during beta</p>
            </div>
            <ul style={pricingList}>
              {[
                "Sandbox merchant account",
                "Test API keys",
                "Hosted checkout testing",
                "API logs",
                "Webhook testing",
                "Developer documentation",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section id="faq" style={sectionTint}>
          <SectionIntro
            kicker="FAQ"
            title="Clear answers for the Sandbox Beta."
            text="Short, practical details for merchants and developers evaluating AuraPay."
          />
          <div style={faqWrap}>
            {faqs.map((faq, index) => (
              <div key={faq.question} style={faqItem}>
                <button
                  type="button"
                  style={faqButton}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-panel-${index}`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true">{openFaq === index ? "-" : "+"}</span>
                </button>
                {openFaq === index && (
                  <p id={`faq-panel-${index}`} style={faqAnswer}>
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={footer}>
        <div style={footerBrand}>
          <span style={logoMark}>A</span>
          <div>
            <strong>AuraPay</strong>
            <p>Sandbox payment infrastructure for modern businesses.</p>
          </div>
        </div>
        <FooterGroup title="Product" links={[["Dashboard", "/merchant/dashboard"], ["Hosted Checkout", "#products"], ["Transactions", "/merchant/transactions"], ["Settlements", "/merchant/settlements"]]} />
        <FooterGroup title="Developers" links={[["Documentation", "/merchant/developer/documentation"], ["API Keys", "/merchant/developer/api-keys"], ["Webhooks", "/merchant/developer/webhooks"], ["API Logs", "/merchant/developer/api-logs"]]} />
        <FooterGroup title="Company" links={[["About", "#top"], ["Contact", "#top"], ["Sandbox Beta", "#sandbox"]]} />
        <FooterGroup title="Legal" links={[["Privacy", "#faq"], ["Terms", "#faq"], ["Acceptable Use", "#faq"]]} />
      </footer>
    </div>
  );
}

function SectionIntro({ kicker, title, text, compact = false }) {
  return (
    <div style={compact ? sectionIntroCompact : sectionIntro}>
      <p style={kickerStyle}>{kicker}</p>
      <h2 style={sectionTitle}>{title}</h2>
      <p style={sectionText}>{text}</p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div style={dashboardMockup}>
      <div style={mockupTopbar}>
        <strong>AuraPay</strong>
        <span style={sandboxChip}>Sandbox</span>
      </div>
      <div style={mockupGrid}>
        <div style={mockMetric}>
          <span>Checkout volume</span>
          <strong>Sandbox data</strong>
        </div>
        <div style={mockMetric}>
          <span>Settlements</span>
          <strong>Testing only</strong>
        </div>
      </div>
      <div style={mockTable}>
        {["checkout.created", "payment.completed", "settlement.created"].map((event) => (
          <div key={event} style={mockRow}>
            <span>{event}</span>
            <span>Logged</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionCard() {
  return (
    <article style={miniCard}>
      <div style={miniHeader}>
        <span>Transaction</span>
        <span style={successBadge}>Sandbox</span>
      </div>
      <strong>$25.00 USD</strong>
      <p style={mutedText}>customer@example.com</p>
    </article>
  );
}

function ApiRequestCard() {
  return (
    <article style={miniCardDark}>
      <span style={codeBadge}>POST</span>
      <code>/api/v1/checkouts</code>
      <p>Idempotency-Key: checkout_001</p>
    </article>
  );
}

function CheckoutPreviewSmall() {
  return (
    <article style={miniCard}>
      <div style={miniHeader}>
        <span>Hosted checkout</span>
        <span style={sandboxChip}>Preview</span>
      </div>
      <div style={checkoutLine}>
        <span>Order summary</span>
        <strong>$25.00</strong>
      </div>
    </article>
  );
}

function HostedCheckoutPreview() {
  return (
    <article style={hostedPreview}>
      <div style={miniHeader}>
        <strong>Northstar Studio</strong>
        <span style={sandboxChip}>Sandbox</span>
      </div>
      <h3 style={checkoutAmount}>$25.00 USD</h3>
      <p style={mutedText}>customer@example.com</p>
      <div style={checkoutSummary}>
        <div style={checkoutLine}>
          <span>Order amount</span>
          <strong>$25.00</strong>
        </div>
        <div style={checkoutLine}>
          <span>Payment state</span>
          <strong>Sandbox success</strong>
        </div>
      </div>
      <div style={successState}>Visual preview only. No real payment was completed.</div>
    </article>
  );
}

function AvailabilityCard({ title, items, positive = false }) {
  return (
    <article style={availabilityCard}>
      <h3 style={cardTitle}>{title}</h3>
      <ul style={list}>
        {items.map((item) => (
          <li key={item} style={positive ? positiveItem : unavailableItem}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div style={footerGroup}>
      <strong>{title}</strong>
      {links.map(([label, href]) =>
        href.startsWith("/") ? (
          <Link key={label} to={href} style={footerLink}>
            {label}
          </Link>
        ) : (
          <a key={label} href={href} style={footerLink}>
            {label}
          </a>
        )
      )}
    </div>
  );
}

function Icon({ name, small = false }) {
  const paths = {
    checkout: "M5 6h16l-2 9H8L5 6Zm3 12h.01M17 18h.01M3 3h3l1 3",
    dashboard: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z",
    api: "M8 7 4 12l4 5m8-10 4 5-4 5M14 4l-4 16",
    webhooks: "M7 8a4 4 0 1 1 4 4H9m8 4a4 4 0 1 1-4-4h2",
    apps: "M4 5h7v7H4V5Zm9 0h7v7h-7V5ZM4 14h7v7H4v-7Zm9 0h7v7h-7v-7Z",
    security: "M12 3 20 7v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4Z",
  };

  return (
    <span style={small ? iconSmall : iconWrap}>
      <svg aria-hidden="true" width={small ? 16 : 22} height={small ? 16 : 22} viewBox="0 0 24 24" fill="none">
        <path d={paths[name] || paths.dashboard} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const page = {
  minHeight: "100vh",
  background: "#F7FAFC",
  color: "#0F172A",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const header = {
  position: "sticky",
  top: 0,
  zIndex: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
  minHeight: 74,
  padding: "0 32px",
  background: "rgba(255, 255, 255, 0.92)",
  borderBottom: "1px solid #E2E8F0",
  backdropFilter: "blur(16px)",
};

const brand = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
  color: "#0F172A",
  fontWeight: 900,
};

const logoMark = {
  display: "inline-grid",
  placeItems: "center",
  width: 36,
  height: 36,
  borderRadius: 8,
  background: "#0F172A",
  color: "#FFFFFF",
  fontWeight: 900,
};

const brandText = {
  fontSize: 20,
};

const betaBadge = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 999,
  background: "#E0F2FE",
  color: "#075985",
  border: "1px solid #BAE6FD",
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 900,
};

const nav = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 24,
};

const navLinks = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  flex: 1,
};

const navLink = {
  color: "#475569",
  textDecoration: "none",
  fontWeight: 800,
  fontSize: 14,
  padding: "10px 11px",
  borderRadius: 8,
};

const navActions = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const ghostButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "10px 14px",
  fontWeight: 900,
  textDecoration: "none",
};

const ghostButtonDark = {
  ...ghostButton,
  background: "#111827",
  borderColor: "#334155",
  color: "#FFFFFF",
};

const primaryButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #0F172A",
  background: "#0F172A",
  color: "#FFFFFF",
  borderRadius: 8,
  padding: "10px 14px",
  fontWeight: 900,
  textDecoration: "none",
};

const primaryButtonLarge = {
  ...primaryButton,
  padding: "14px 18px",
};

const secondaryButtonLarge = {
  ...ghostButton,
  padding: "14px 18px",
};

const mobileMenuButton = {
  display: "none",
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  borderRadius: 8,
  padding: 10,
  cursor: "pointer",
};

const menuLine = {
  display: "block",
  width: 20,
  height: 2,
  background: "#0F172A",
  margin: "4px 0",
};

const hero = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "86px 32px 72px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.9fr) minmax(420px, 1.1fr)",
  gap: 44,
  alignItems: "center",
};

const heroCopy = {
  minWidth: 0,
};

const noticePill = {
  display: "inline-flex",
  maxWidth: 520,
  border: "1px solid #BAE6FD",
  background: "#E0F2FE",
  color: "#075985",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 900,
  fontSize: 13,
};

const headline = {
  margin: "22px 0 18px",
  fontSize: 64,
  lineHeight: 1.02,
  letterSpacing: 0,
  maxWidth: 720,
};

const heroText = {
  margin: 0,
  color: "#475569",
  fontSize: 19,
  lineHeight: 1.65,
  maxWidth: 620,
};

const heroActions = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 28,
};

const heroFacts = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 24,
  color: "#334155",
  fontSize: 13,
  fontWeight: 900,
};

const productPreview = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 240px",
  gap: 14,
  alignItems: "stretch",
  background: "#E2E8F0",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  padding: 14,
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.16)",
};

const previewSide = {
  display: "grid",
  gap: 14,
};

const dashboardMockup = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 18,
  display: "grid",
  gap: 16,
};

const mockupTopbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const sandboxChip = {
  display: "inline-flex",
  borderRadius: 999,
  background: "#ECFDF5",
  color: "#047857",
  padding: "5px 8px",
  fontSize: 12,
  fontWeight: 900,
};

const mockupGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 12,
};

const mockMetric = {
  display: "grid",
  gap: 8,
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 14,
};

const mockTable = {
  display: "grid",
  gap: 8,
};

const mockRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  color: "#475569",
  background: "#F8FAFC",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
};

const miniCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 14,
  display: "grid",
  gap: 8,
};

const miniCardDark = {
  ...miniCard,
  background: "#0F172A",
  borderColor: "#0F172A",
  color: "#E2E8F0",
};

const miniHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const successBadge = {
  ...sandboxChip,
  background: "#DCFCE7",
  color: "#166534",
};

const section = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "76px 32px",
};

const sectionTint = {
  ...section,
  background: "#FFFFFF",
  maxWidth: "none",
  paddingLeft: "max(32px, calc((100vw - 1220px) / 2 + 32px))",
  paddingRight: "max(32px, calc((100vw - 1220px) / 2 + 32px))",
  borderTop: "1px solid #E2E8F0",
  borderBottom: "1px solid #E2E8F0",
};

const sectionIntro = {
  maxWidth: 760,
  marginBottom: 28,
};

const sectionIntroCompact = {
  maxWidth: 620,
  marginBottom: 22,
};

const kickerStyle = {
  margin: "0 0 10px",
  color: "#2563EB",
  fontSize: 13,
  fontWeight: 900,
  textTransform: "uppercase",
};

const sectionTitle = {
  margin: 0,
  color: "#0F172A",
  fontSize: 40,
  lineHeight: 1.12,
  letterSpacing: 0,
};

const sectionText = {
  margin: "14px 0 0",
  color: "#475569",
  fontSize: 17,
  lineHeight: 1.65,
};

const capabilityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 16,
};

const capabilityCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 22,
  minHeight: 220,
};

const iconWrap = {
  display: "inline-grid",
  placeItems: "center",
  width: 42,
  height: 42,
  color: "#0F172A",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
};

const iconSmall = {
  ...iconWrap,
  width: 30,
  height: 30,
};

const cardTitle = {
  margin: "14px 0 10px",
  color: "#0F172A",
  fontSize: 19,
};

const list = {
  margin: 0,
  paddingLeft: 18,
  color: "#475569",
  lineHeight: 1.8,
};

const stepsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 16,
};

const stepCard = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 20,
};

const stepNumber = {
  display: "grid",
  placeItems: "center",
  width: 34,
  height: 34,
  borderRadius: 8,
  background: "#0F172A",
  color: "#FFFFFF",
  fontWeight: 900,
};

const stepVisual = {
  height: 8,
  borderRadius: 999,
  background: "#E2E8F0",
  overflow: "hidden",
  marginTop: 18,
};

const developerSection = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "76px 32px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.85fr) minmax(420px, 1fr)",
  gap: 30,
  alignItems: "center",
};

const developerList = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 22,
};

const featureChip = {
  borderRadius: 999,
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#334155",
  padding: "8px 10px",
  fontSize: 13,
  fontWeight: 900,
};

const sectionActions = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const codePanel = {
  borderRadius: 8,
  overflow: "hidden",
  background: "#0F172A",
  border: "1px solid #1E293B",
  boxShadow: "0 22px 70px rgba(15, 23, 42, 0.16)",
};

const codeHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  background: "#111827",
  borderBottom: "1px solid #334155",
  color: "#E2E8F0",
  padding: "13px 16px",
  fontWeight: 900,
};

const codeBadge = {
  display: "inline-flex",
  borderRadius: 999,
  background: "#1D4ED8",
  color: "#FFFFFF",
  padding: "5px 8px",
  fontSize: 12,
  fontWeight: 900,
};

const codeBlock = {
  margin: 0,
  padding: 18,
  color: "#D1FAE5",
  fontSize: 13,
  lineHeight: 1.7,
  overflowX: "auto",
};

const checkoutGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.9fr) minmax(340px, 0.8fr)",
  gap: 36,
  alignItems: "center",
};

const hostedPreview = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 24,
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
};

const checkoutAmount = {
  margin: "20px 0 6px",
  fontSize: 34,
};

const checkoutSummary = {
  display: "grid",
  gap: 10,
  margin: "20px 0",
};

const checkoutLine = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
};

const successState = {
  border: "1px solid #A7F3D0",
  background: "#ECFDF5",
  color: "#047857",
  borderRadius: 8,
  padding: 12,
  fontWeight: 900,
};

const securityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
};

const securityItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 14,
  fontWeight: 900,
};

const betaSection = {
  maxWidth: 1220,
  margin: "0 auto",
  padding: "76px 32px",
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.8fr) repeat(2, minmax(260px, 1fr))",
  gap: 16,
};

const availabilityCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 22,
};

const positiveItem = {
  color: "#047857",
};

const unavailableItem = {
  color: "#92400E",
};

const pricingCard = {
  display: "grid",
  gridTemplateColumns: "260px minmax(0, 1fr)",
  gap: 28,
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 28,
};

const price = {
  margin: "18px 0 0",
  fontSize: 58,
  lineHeight: 1,
};

const pricingList = {
  ...list,
  columns: 2,
};

const faqWrap = {
  display: "grid",
  gap: 10,
  maxWidth: 900,
};

const faqItem = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  overflow: "hidden",
};

const faqButton = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  border: "none",
  background: "#FFFFFF",
  color: "#0F172A",
  padding: "17px 18px",
  textAlign: "left",
  fontWeight: 900,
  cursor: "pointer",
};

const faqAnswer = {
  margin: 0,
  padding: "0 18px 18px",
  color: "#475569",
  lineHeight: 1.65,
};

const footer = {
  display: "grid",
  gridTemplateColumns: "minmax(240px, 1.4fr) repeat(4, minmax(120px, 1fr))",
  gap: 26,
  padding: "46px 32px",
  maxWidth: 1220,
  margin: "0 auto",
  borderTop: "1px solid #E2E8F0",
};

const footerBrand = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  color: "#475569",
};

const footerGroup = {
  display: "grid",
  alignContent: "start",
  gap: 10,
};

const footerLink = {
  color: "#475569",
  textDecoration: "none",
  fontWeight: 700,
};

const mutedText = {
  color: "#64748B",
  lineHeight: 1.6,
  margin: 0,
};

const responsiveStyles = `
  html {
    scroll-behavior: smooth;
  }

  a:focus-visible,
  button:focus-visible {
    outline: 3px solid #93C5FD;
    outline-offset: 3px;
  }

  a:hover,
  button:hover {
    filter: brightness(0.98);
  }

  @media (max-width: 1080px) {
    .hero-grid,
    .developer-grid,
    .checkout-grid,
    .beta-grid {
      grid-template-columns: 1fr !important;
    }

    .capability-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .steps-grid,
    .security-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .product-preview {
      grid-template-columns: 1fr !important;
    }

    #pricing article {
      grid-template-columns: 1fr !important;
    }

    footer {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 820px) {
    .mobile-menu-button {
      display: block !important;
    }

    .landing-nav {
      position: absolute;
      left: 16px;
      right: 16px;
      top: 82px;
      display: none !important;
      grid-template-columns: 1fr;
      gap: 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
    }

    .landing-nav.is-open {
      display: grid !important;
    }

    .landing-nav > div {
      flex-direction: column;
      align-items: stretch !important;
    }
  }

  @media (max-width: 720px) {
    h1 {
      font-size: 42px !important;
    }

    h2 {
      font-size: 30px !important;
    }

    .capability-grid,
    .steps-grid,
    .security-grid {
      grid-template-columns: 1fr !important;
    }

    .preview-side {
      grid-template-columns: 1fr !important;
    }

    footer {
      grid-template-columns: 1fr 1fr !important;
    }

    ul {
      columns: 1 !important;
    }
  }

  @media (max-width: 520px) {
    header {
      padding-left: 16px !important;
      padding-right: 16px !important;
    }

    main section {
      padding-left: 18px !important;
      padding-right: 18px !important;
    }

    .hero-grid {
      padding-top: 48px !important;
    }

    .hero-grid > div:last-child {
      grid-template-columns: 1fr !important;
    }

    footer {
      grid-template-columns: 1fr !important;
      padding-left: 18px !important;
      padding-right: 18px !important;
    }
  }
`;
