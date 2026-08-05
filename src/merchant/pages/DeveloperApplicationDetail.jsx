import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";
import {
  emptyState,
  errorBanner,
  pageHeader,
  pageSubtitle,
  pageTitle,
  panel,
} from "./developerStyles";

export default function DeveloperApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplication();
  }, [id]);

  async function loadApplication() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/merchant/developer/applications/${id}`);
      setApplication(res.data?.data || null);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell menu={merchantMenu} title="Application Details">
      <section style={pageHeader}>
        <Link style={backLink} to="/merchant/developer/applications">Back to applications</Link>
        <h1 style={pageTitle}>{application?.name || "Application Details"}</h1>
        <p style={pageSubtitle}>
          Inspect application configuration, redirect URLs, allowed origins, and
          operational status.
        </p>
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      {loading ? (
        <div style={emptyState}>Loading application...</div>
      ) : !application ? (
        <div style={emptyState}>Application not found.</div>
      ) : (
        <section style={grid}>
          <Card title="Overview">
            <Field label="Application ID" value={application._id} mono />
            <Field label="Name" value={application.name} />
            <Field label="Description" value={application.description} />
            <Field label="Website" value={application.website} />
            <Field label="Environment" value={application.environment} />
            <Field label="Status" value={application.active === false ? "Disabled" : "Active"} />
          </Card>

          <Card title="Redirect URLs">
            {(application.redirectUris || []).length === 0 ? (
              <p style={muted}>No redirect URLs configured.</p>
            ) : (
              (application.redirectUris || []).map((url) => (
                <code key={url} style={codeBlock}>{url}</code>
              ))
            )}
          </Card>

          <Card title="Allowed Origins">
            {(application.allowedOrigins || []).length === 0 ? (
              <p style={muted}>No allowed origins configured.</p>
            ) : (
              (application.allowedOrigins || []).map((origin) => (
                <code key={origin} style={codeBlock}>{origin}</code>
              ))
            )}
          </Card>

          <Card title="Branding">
            <Field label="Logo" value={application.logo || "Not configured"} />
            {application.logo && (
              <img src={application.logo} alt="" style={logo} />
            )}
          </Card>
        </section>
      )}
    </AppShell>
  );
}

function Card({ title, children }) {
  return (
    <article style={panel}>
      <h2 style={sectionTitle}>{title}</h2>
      <div style={stack}>{children}</div>
    </article>
  );
}

function Field({ label, value, mono = false }) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <strong style={mono ? monoValue : valueStyle}>{value || "Not configured"}</strong>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
  gap: 16,
  maxWidth: "100%",
};

const backLink = {
  display: "inline-block",
  color: "#2563EB",
  fontWeight: 800,
  textDecoration: "none",
  marginBottom: 10,
};

const sectionTitle = {
  margin: "0 0 16px",
  color: "#0F172A",
};

const stack = {
  display: "grid",
  gap: 12,
};

const labelStyle = {
  display: "block",
  color: "#64748B",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  marginBottom: 4,
};

const valueStyle = {
  color: "#0F172A",
  overflowWrap: "anywhere",
};

const monoValue = {
  ...valueStyle,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  wordBreak: "break-all",
};

const codeBlock = {
  display: "block",
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 10,
  maxWidth: "100%",
  whiteSpace: "pre-wrap",
  overflowWrap: "anywhere",
};

const muted = {
  color: "#64748B",
};

const logo = {
  width: 120,
  height: 120,
  borderRadius: 8,
  border: "1px solid #E2E8F0",
  objectFit: "contain",
};
