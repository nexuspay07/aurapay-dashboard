import { useMemo, useState } from "react";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import {
  pageHeader,
  pageSubtitle,
  pageTitle,
  panel,
  textButton,
} from "./developerStyles";

const sections = [
  "Authentication",
  "API Keys",
  "Permissions",
  "Idempotency",
  "Payments",
  "Checkouts",
  "Refunds",
  "Settlements",
  "Transactions",
  "Merchant",
  "Applications",
  "Webhooks",
  "Errors",
  "Rate Limits",
  "Request IDs",
  "Sandbox Guide",
];

const endpoints = [
  {
    section: "Authentication",
    method: "GET",
    path: "/api/v1/account",
    description: "Authenticate with a sandbox secret key and return the merchant account.",
    parameters: ["Authorization: Bearer sk_test_..."],
    requiredPermission: "account:read",
  },
  {
    section: "API Keys",
    method: "GET",
    path: "/merchant/developer/api-keys",
    description: "Merchant dashboard endpoint for managing sandbox API keys.",
    parameters: ["Merchant session token", "Never returns secret keys"],
    requiredPermission: "Merchant authentication",
  },
  {
    section: "Permissions",
    method: "ANY",
    path: "/api/v1/*",
    description: "Every endpoint requires an API key with the matching permission.",
    parameters: ["account:read", "payments:create", "payments:read", "refunds:create", "checkouts:create"],
    requiredPermission: "Endpoint-specific permission",
  },
  {
    section: "Idempotency",
    method: "POST",
    path: "/api/v1/payments",
    description: "POST payments, refunds, and checkouts require Idempotency-Key.",
    parameters: ["Idempotency-Key", "409 on payload conflict"],
    requiredPermission: "Endpoint-specific create permission",
  },
  {
    section: "Payments",
    method: "POST",
    path: "/api/v1/payments",
    description: "Create a sandbox test payment. AuraPay simulates the result and never moves real money.",
    parameters: ["amount", "currency", "customerEmail", "scenario", "Idempotency-Key"],
    requiredPermission: "payments:create",
  },
  {
    section: "Payments",
    method: "GET",
    path: "/api/v1/payments",
    description: "List merchant-scoped sandbox payments.",
    parameters: ["page", "limit", "status"],
    requiredPermission: "payments:read",
  },
  {
    section: "Checkouts",
    method: "POST",
    path: "/api/v1/checkouts",
    description: "Create a hosted checkout session.",
    parameters: ["amount", "currency", "customerEmail", "Idempotency-Key"],
    requiredPermission: "checkouts:create",
  },
  {
    section: "Checkouts",
    method: "GET",
    path: "/api/v1/checkouts",
    description: "List hosted checkout sessions for the API key merchant.",
    parameters: ["page", "limit", "status"],
    requiredPermission: "checkouts:read",
  },
  {
    section: "Refunds",
    method: "POST",
    path: "/api/v1/refunds",
    description: "Refund a completed transaction.",
    parameters: ["transactionId", "amount", "reason", "Idempotency-Key"],
    requiredPermission: "refunds:create",
  },
  {
    section: "Refunds",
    method: "GET",
    path: "/api/v1/refunds",
    description: "List refund transactions for the API key merchant.",
    parameters: ["page", "limit"],
    requiredPermission: "refunds:read",
  },
  {
    section: "Settlements",
    method: "GET",
    path: "/api/v1/settlements",
    description: "List merchant-scoped settlements.",
    parameters: ["page", "limit", "status"],
    requiredPermission: "settlements:read",
  },
  {
    section: "Transactions",
    method: "GET",
    path: "/api/v1/transactions",
    description: "List merchant-scoped transaction records.",
    parameters: ["page", "limit", "status"],
    requiredPermission: "transactions:read",
  },
  {
    section: "Merchant",
    method: "GET",
    path: "/api/v1/account",
    description: "Return merchant account information for the authenticated API key.",
    parameters: ["Authorization header"],
    requiredPermission: "account:read",
  },
  {
    section: "Applications",
    method: "GET",
    path: "/merchant/developer/applications",
    description: "Merchant dashboard endpoint for redirect URLs, allowed origins, and sandbox app metadata.",
    parameters: ["Merchant session token"],
    requiredPermission: "Merchant authentication",
  },
  {
    section: "Webhooks",
    method: "GET",
    path: "/merchant/developer/webhooks",
    description: "Merchant dashboard endpoint for event destinations and delivery history.",
    parameters: ["Merchant session token", "Signing secret is never returned in list responses"],
    requiredPermission: "Merchant authentication",
  },
  {
    section: "Errors",
    method: "ANY",
    path: "All endpoints",
    description: "Errors return a stable success/message or error payload.",
    parameters: ["HTTP status", "message"],
    requiredPermission: "Endpoint-specific permission",
  },
  {
    section: "Rate Limits",
    method: "ANY",
    path: "/api/v1/*",
    description: "Per-key and per-merchant sandbox rate limits return 429 with retry headers.",
    parameters: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "Retry-After"],
    requiredPermission: "Valid API key",
  },
  {
    section: "Request IDs",
    method: "ANY",
    path: "/api/v1/*",
    description: "Send X-Request-Id or AuraPay generates one and returns it.",
    parameters: ["X-Request-Id"],
    requiredPermission: "Valid API key",
  },
  {
    section: "Sandbox Guide",
    method: "POST",
    path: "/api/v1/payments",
    description: "Use scenario=success, declined, insufficient_funds, pending, or failed to trigger deterministic sandbox payment outcomes.",
    parameters: ["sk_test_...", "sandbox environment", "livemode=false", "No card data required"],
    requiredPermission: "Valid sandbox API key",
  },
  {
    section: "Sandbox Guide",
    method: "POST",
    path: "/api/v1/refunds",
    description: "Refund completed sandbox payments. Partial refunds are allowed until the remaining refundable amount reaches zero.",
    parameters: ["transactionId", "amount", "reason", "Idempotency-Key"],
    requiredPermission: "refunds:create",
  },
  {
    section: "Sandbox Guide",
    method: "ANY",
    path: "Webhook events",
    description: "Sandbox payment, checkout, refund, and settlement events include environment=sandbox and livemode=false.",
    parameters: ["payment.created", "payment.completed", "payment.failed", "payment.refunded", "checkout.created", "checkout.paid", "settlement.created"],
    requiredPermission: "Configured merchant webhook",
  },
];

const sampleBody = {
  amount: 25,
  currency: "usd",
  customerEmail: "customer@example.com",
  scenario: "success",
};

export default function DeveloperDocumentation() {
  const [active, setActive] = useState("Authentication");
  const [notice, setNotice] = useState("");

  const visibleEndpoints = useMemo(
    () => endpoints.filter((endpoint) => endpoint.section === active),
    [active]
  );

  async function copy(value) {
    await navigator.clipboard?.writeText(value);
    setNotice("Copied.");
  }

  return (
    <AppShell menu={merchantMenu} title="Documentation">
      <section style={pageHeader}>
        <h1 style={pageTitle}>Developer Documentation</h1>
        <p style={pageSubtitle}>
          Sandbox reference for authentication, payments, checkouts, refunds,
          settlements, applications, webhooks, errors, and rate limits.
        </p>
      </section>

      {notice && <div style={toast}>{notice}</div>}

      <section style={layout}>
        <nav style={sideNav}>
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              style={active === section ? activeNavButton : navButton}
              onClick={() => setActive(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        <main style={content}>
          {visibleEndpoints.map((endpoint) => (
            <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} onCopy={copy} />
          ))}
        </main>
      </section>
    </AppShell>
  );
}

function EndpointCard({ endpoint, onCopy }) {
  const samples = buildSamples(endpoint);

  return (
    <article style={panel}>
      <div style={endpointHeader}>
        <span style={methodBadge}>{endpoint.method}</span>
        <code style={pathText}>{endpoint.path}</code>
      </div>

      <p style={description}>{endpoint.description}</p>

      <div style={requiredPermission}>
        Required permission: <strong>{endpoint.requiredPermission}</strong>
      </div>

      <h3 style={minorTitle}>Parameters</h3>
      <div style={chips}>
        {endpoint.parameters.map((parameter) => (
          <span key={parameter} style={chip}>{parameter}</span>
        ))}
      </div>

      <h3 style={minorTitle}>Example Request</h3>
      <CodeBlock value={samples.request} onCopy={onCopy} />

      <h3 style={minorTitle}>Example Response</h3>
      <CodeBlock value={samples.response} onCopy={onCopy} />

      <h3 style={minorTitle}>Code Samples</h3>
      <div style={sampleGrid}>
        {["Node.js", "Python", "PHP", "cURL"].map((language) => (
          <CodeBlock
            key={language}
            title={language}
            value={samples[language]}
            onCopy={onCopy}
          />
        ))}
      </div>
    </article>
  );
}

function CodeBlock({ title, value, onCopy }) {
  return (
    <div style={codePanel}>
      <div style={codeHeader}>
        {title && <strong>{title}</strong>}
        <button type="button" style={textButton} onClick={() => onCopy(value)}>
          Copy
        </button>
      </div>
      <pre style={pre}>{value}</pre>
    </div>
  );
}

function buildSamples(endpoint) {
  const body = JSON.stringify(sampleBody, null, 2);
  const response = JSON.stringify(
    {
      success: true,
      data: {
        id: "txn_test_resource_id",
        status: "completed",
        environment: "sandbox",
        livemode: false,
        sandboxScenario: "success",
      },
    },
    null,
    2
  );

  return {
    request: `${endpoint.method} ${endpoint.path}\nAuthorization: Bearer sk_test_...\nX-Request-Id: req_123\nIdempotency-Key: idem_123\nContent-Type: application/json\n\n${body}`,
    response,
    "Node.js": `const res = await fetch("https://api.aurapay.test${endpoint.path}", {\n  method: "${endpoint.method === "ANY" ? "GET" : endpoint.method}",\n  headers: {\n    Authorization: "Bearer sk_test_...",\n    "Content-Type": "application/json",\n    "X-Request-Id": "req_123",\n    "Idempotency-Key": "idem_123"\n  },\n  body: JSON.stringify(${body.replace(/\n/g, "\n  ")})\n});\nconst data = await res.json();`,
    Python: `import requests\n\nres = requests.request(\n    "${endpoint.method === "ANY" ? "GET" : endpoint.method}",\n    "https://api.aurapay.test${endpoint.path}",\n    headers={\n        "Authorization": "Bearer sk_test_...",\n        "X-Request-Id": "req_123",\n        "Idempotency-Key": "idem_123"\n    },\n    json=${JSON.stringify(sampleBody)}\n)\nprint(res.json())`,
    PHP: `<?php\n$ch = curl_init("https://api.aurapay.test${endpoint.path}");\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${endpoint.method === "ANY" ? "GET" : endpoint.method}");\ncurl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer sk_test_...", "Content-Type: application/json", "X-Request-Id: req_123", "Idempotency-Key: idem_123"]);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(sampleBody)}');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\necho curl_exec($ch);`,
    cURL: `curl -X ${endpoint.method === "ANY" ? "GET" : endpoint.method} "https://api.aurapay.test${endpoint.path}" \\\n  -H "Authorization: Bearer sk_test_..." \\\n  -H "X-Request-Id: req_123" \\\n  -H "Idempotency-Key: idem_123" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(sampleBody)}'`,
  };
}

const layout = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: 16,
};

const sideNav = {
  ...panel,
  display: "grid",
  alignContent: "start",
  gap: 8,
};

const navButton = {
  border: "none",
  background: "transparent",
  color: "#475569",
  textAlign: "left",
  borderRadius: 8,
  padding: "11px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const activeNavButton = {
  ...navButton,
  background: "#EFF6FF",
  color: "#2563EB",
};

const content = {
  display: "grid",
  gap: 16,
};

const endpointHeader = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
};

const methodBadge = {
  background: "#0F172A",
  color: "#FFFFFF",
  borderRadius: 6,
  padding: "6px 9px",
  fontWeight: 900,
  fontSize: 12,
};

const pathText = {
  color: "#0F172A",
  fontSize: 16,
  wordBreak: "break-all",
};

const description = {
  color: "#475569",
  lineHeight: 1.6,
};

const requiredPermission = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#ECFDF5",
  color: "#047857",
  border: "1px solid #A7F3D0",
  borderRadius: 999,
  padding: "7px 10px",
  fontSize: 13,
  fontWeight: 800,
};

const minorTitle = {
  margin: "18px 0 10px",
  color: "#0F172A",
  fontSize: 15,
};

const chips = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  background: "#F1F5F9",
  color: "#334155",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 800,
};

const sampleGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12,
};

const codePanel = {
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  overflow: "hidden",
  background: "#F8FAFC",
};

const codeHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "9px 12px",
  borderBottom: "1px solid #E2E8F0",
  background: "#FFFFFF",
};

const pre = {
  margin: 0,
  padding: 12,
  overflowX: "auto",
  fontSize: 12,
  lineHeight: 1.6,
};

const toast = {
  background: "#ECFDF5",
  color: "#047857",
  border: "1px solid #A7F3D0",
  borderRadius: 8,
  padding: 14,
  marginBottom: 16,
};
