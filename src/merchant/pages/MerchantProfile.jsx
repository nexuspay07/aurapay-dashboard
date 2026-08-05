import { useEffect, useState } from "react";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";

export default function MerchantProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant/profile");
      setProfile(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load merchant profile."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell menu={merchantMenu} title="Profile">
      <section style={header}>
        <div>
          <h1 style={title}>Merchant Profile</h1>
          <p style={subtitle}>
            Business identity, verification posture, and payment operating
            defaults.
          </p>
        </div>
        {profile && <Badge value={profile.verificationStatus} />}
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      {loading ? (
        <div style={grid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={skeletonPanel} />
          ))}
        </div>
      ) : !profile ? (
        <div style={emptyState}>No merchant profile is available.</div>
      ) : (
        <div style={grid}>
          <Section title="Business Information">
            <Field label="Business Name" value={profile.businessName} />
            <Field label="Legal Name" value={profile.legalName} />
            <Field label="Business Type" value={formatValue(profile.businessType)} />
            <Field label="Merchant Category" value={profile.merchantCategory} />
            <Field label="Website" value={profile.website} />
            <Field label="Registration Number" value={profile.businessRegistrationNumber} />
            <Field label="Tax Number" value={profile.taxNumber} />
          </Section>

          <Section title="Contact Information">
            <Field label="Contact Email" value={profile.contactEmail} />
            <Field label="Contact Phone" value={profile.contactPhone} />
            <Field label="Owner Name" value={profile.ownerName} />
            <Field label="Owner Email" value={profile.ownerEmail} />
            <Field label="Country" value={profile.country} />
            <Field label="Business Address" value={profile.businessAddress} />
          </Section>

          <Section title="Verification Status">
            <Field label="Verification" value={formatValue(profile.verificationStatus)} />
            <Field label="KYB Submitted" value={profile.kybSubmitted ? "Yes" : "No"} />
            <Field label="Reviewed At" value={formatDate(profile.kybReviewedAt)} />
            <Field label="Reviewed By" value={profile.kybReviewedBy} />
          </Section>

          <Section title="Risk Profile">
            <Field label="Risk Level" value={formatValue(profile.riskLevel)} />
            <Field label="Account Active" value={profile.active ? "Active" : "Inactive"} />
          </Section>

          <Section title="Branding">
            <div style={logoBox}>
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Business logo" style={logo} />
              ) : (
                <span>No logo uploaded</span>
              )}
            </div>
            <Field label="Business Logo" value={profile.logoUrl || "Not configured"} />
          </Section>

          <Section title="Preferences">
            <Field label="Timezone" value={profile.timezone || "Not configured"} />
            <Field label="Currency" value={profile.defaultCurrency || "USD"} />
          </Section>
        </div>
      )}
    </AppShell>
  );
}

function Section({ title, children }) {
  return (
    <article style={panel}>
      <h2 style={panelTitle}>{title}</h2>
      <div style={fieldStack}>{children}</div>
    </article>
  );
}

function Field({ label, value }) {
  return (
    <div style={field}>
      <span style={fieldLabel}>{label}</span>
      <strong style={fieldValue}>{value || "Not provided"}</strong>
    </div>
  );
}

function Badge({ value }) {
  const normalized = String(value || "pending").toLowerCase();
  const tone =
    normalized === "verified"
      ? successBadge
      : normalized === "rejected"
      ? dangerBadge
      : warningBadge;

  return <span style={{ ...badge, ...tone }}>{formatValue(normalized)}</span>;
}

function formatValue(value) {
  return String(value || "Not provided").replace(/_/g, " ");
}

function formatDate(value) {
  if (!value) return "Not reviewed";
  return new Date(value).toLocaleString();
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: 20,
};

const title = {
  margin: 0,
  color: "#0F172A",
  fontSize: 32,
};

const subtitle = {
  margin: "8px 0 0",
  color: "#64748B",
  maxWidth: 720,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 16,
};

const panel = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 20,
};

const panelTitle = {
  margin: "0 0 16px",
  color: "#0F172A",
  fontSize: 18,
};

const fieldStack = {
  display: "grid",
  gap: 12,
};

const field = {
  display: "grid",
  gap: 4,
  paddingBottom: 12,
  borderBottom: "1px solid #F1F5F9",
};

const fieldLabel = {
  color: "#64748B",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
};

const fieldValue = {
  color: "#0F172A",
  fontSize: 15,
  textTransform: "capitalize",
};

const logoBox = {
  height: 120,
  borderRadius: 8,
  border: "1px dashed #CBD5E1",
  display: "grid",
  placeItems: "center",
  color: "#64748B",
  marginBottom: 12,
};

const logo = {
  maxWidth: "100%",
  maxHeight: 100,
  objectFit: "contain",
};

const emptyState = {
  minHeight: 280,
  display: "grid",
  placeItems: "center",
  color: "#64748B",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
};

const skeletonPanel = {
  height: 260,
  background: "#E2E8F0",
  borderRadius: 8,
};

const errorBanner = {
  background: "#FEF2F2",
  color: "#B91C1C",
  border: "1px solid #FECACA",
  borderRadius: 8,
  padding: 14,
  marginBottom: 16,
};

const badge = {
  borderRadius: 999,
  padding: "7px 11px",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "capitalize",
};

const successBadge = {
  background: "#DCFCE7",
  color: "#166534",
};

const warningBadge = {
  background: "#FEF3C7",
  color: "#92400E",
};

const dangerBadge = {
  background: "#FEE2E2",
  color: "#991B1B",
};
