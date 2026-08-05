import { useEffect, useState } from "react";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";

const tabs = [
  "General",
  "Security",
  "Notifications",
  "Branding",
  "Payment Preferences",
  "Settlement Preferences",
  "API",
  "Danger Zone",
];

export default function MerchantSettings() {
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [settings, setSettings] = useState({
    defaultCurrency: "USD",
    emailNotifications: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant/settings");
      setSettings((current) => ({
        ...current,
        ...res.data,
      }));
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load merchant settings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setError("");
      setNotice("");

      await API.put("/merchant/settings", settings);
      setNotice("Settings saved.");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to save settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function update(field, value) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <AppShell menu={merchantMenu} title="Settings">
      <section style={header}>
        <div>
          <h1 style={title}>Settings</h1>
          <p style={subtitle}>
            Configure notifications, payment defaults, API posture, and account
            controls.
          </p>
        </div>
      </section>

      {error && <div style={errorBanner}>{error}</div>}
      {notice && <div style={successBanner}>{notice}</div>}

      <section style={settingsLayout}>
        <nav style={tabList}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              style={activeTab === tab ? activeTabButton : tabButton}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <article style={panel}>
          {loading ? (
            <div style={skeletonPanel} />
          ) : (
            <>
              {activeTab === "General" && (
                <Section title="General">
                  <Field label="Default Currency">
                    <select
                      style={input}
                      value={settings.defaultCurrency}
                      onChange={(event) =>
                        update("defaultCurrency", event.target.value)
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="CAD">CAD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </Field>
                </Section>
              )}

              {activeTab === "Notifications" && (
                <Section title="Notifications">
                  <Toggle
                    label="Email Notifications"
                    checked={settings.emailNotifications}
                    onChange={(value) => update("emailNotifications", value)}
                  />
                  <Toggle
                    label="Payment Notifications"
                    checked={settings.paymentNotifications}
                    onChange={(value) => update("paymentNotifications", value)}
                  />
                  <Toggle
                    label="Marketing Emails"
                    checked={settings.marketingEmails}
                    onChange={(value) => update("marketingEmails", value)}
                  />
                </Section>
              )}

              {activeTab !== "General" && activeTab !== "Notifications" && (
                <Section title={activeTab}>
                  <div style={emptyState}>
                    No configurable live backend fields are available for this
                    section yet.
                  </div>
                </Section>
              )}

              <div style={footer}>
                <button
                  type="button"
                  style={primaryButton}
                  onClick={saveSettings}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save settings"}
                </button>
              </div>
            </>
          )}
        </article>
      </section>
    </AppShell>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 style={panelTitle}>{title}</h2>
      <div style={sectionStack}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={field}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label style={toggleRow}>
      <span>
        <strong>{label}</strong>
        <small style={toggleHint}>Managed from the merchant settings API.</small>
      </span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

const header = {
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
  maxWidth: 760,
};

const settingsLayout = {
  display: "grid",
  gridTemplateColumns: "260px minmax(0, 1fr)",
  gap: 16,
};

const tabList = {
  display: "grid",
  alignContent: "start",
  gap: 8,
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 10,
};

const tabButton = {
  border: "none",
  background: "transparent",
  color: "#475569",
  textAlign: "left",
  borderRadius: 8,
  padding: "11px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const activeTabButton = {
  ...tabButton,
  background: "#EFF6FF",
  color: "#2563EB",
};

const panel = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 22,
};

const panelTitle = {
  margin: "0 0 18px",
  color: "#0F172A",
  fontSize: 20,
};

const sectionStack = {
  display: "grid",
  gap: 14,
};

const field = {
  display: "grid",
  gap: 8,
};

const fieldLabel = {
  color: "#475569",
  fontSize: 13,
  fontWeight: 800,
};

const input = {
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  padding: "11px 12px",
  background: "#FFFFFF",
};

const toggleRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: 14,
  border: "1px solid #E2E8F0",
  borderRadius: 8,
};

const toggleHint = {
  display: "block",
  color: "#64748B",
  marginTop: 4,
};

const footer = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: 24,
  paddingTop: 18,
  borderTop: "1px solid #E2E8F0",
};

const primaryButton = {
  border: "none",
  background: "#0F172A",
  color: "#FFFFFF",
  borderRadius: 8,
  padding: "11px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const emptyState = {
  minHeight: 180,
  display: "grid",
  placeItems: "center",
  color: "#64748B",
  background: "#F8FAFC",
  border: "1px dashed #CBD5E1",
  borderRadius: 8,
  textAlign: "center",
  padding: 20,
};

const skeletonPanel = {
  height: 280,
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

const successBanner = {
  background: "#ECFDF5",
  color: "#047857",
  border: "1px solid #A7F3D0",
  borderRadius: 8,
  padding: 14,
  marginBottom: 16,
};
