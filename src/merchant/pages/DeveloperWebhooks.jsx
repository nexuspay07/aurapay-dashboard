import { useEffect, useMemo, useState } from "react";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";
import {
  emptyState,
  errorBanner,
  input,
  pageHeader,
  pageSubtitle,
  pageTitle,
  panel,
  primaryButton,
  successBanner,
  table,
  tableWrap,
  td,
  textButton,
  th,
} from "./developerStyles";

const blankForm = {
  url: "",
  eventTypes: [],
};

export default function DeveloperWebhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [events, setEvents] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    loadWebhooks();
  }, []);

  useEffect(() => {
    return () => {
      setSecret("");
      setShowSecret(false);
    };
  }, []);

  async function loadWebhooks() {
    try {
      setLoading(true);
      setError("");
      const [webhookRes, metadataRes] = await Promise.all([
        API.get("/merchant/developer/webhooks"),
        API.get("/merchant/developer/metadata"),
      ]);
      const data = Array.isArray(webhookRes.data?.data)
        ? webhookRes.data.data
        : [];
      setWebhooks(data);
      setEvents(metadataRes.data?.data?.webhookEvents || []);
      if (selected) {
        const nextSelected = data.find((item) => item._id === selected._id);
        setSelected(nextSelected || null);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load webhooks.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return webhooks.filter(
      (webhook) =>
        !term ||
        [webhook.url, webhook.status, ...(webhook.eventTypes || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [search, webhooks]);

  async function submitWebhook(event) {
    event.preventDefault();

    if (!form.url.trim()) {
      setError("Webhook URL is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");
      setSecret("");
      setShowSecret(false);

      if (editing) {
        await API.put(`/merchant/developer/webhooks/${editing._id}`, form);
        setNotice("Webhook updated.");
      } else {
        const res = await API.post("/merchant/developer/webhooks", form);
        setSecret(res.data?.data?.signingSecret || "");
        setNotice("Webhook created.");
      }

      setEditing(null);
      setForm(blankForm);
      await loadWebhooks();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to save webhook.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(webhook) {
    setEditing(webhook);
    setForm({
      url: webhook.url || "",
      eventTypes: webhook.eventTypes || [],
    });
  }

  async function toggleWebhook(webhook) {
    try {
      await API.put(`/merchant/developer/webhooks/${webhook._id}`, {
        active: !webhook.active,
      });
      setNotice(webhook.active ? "Webhook disabled." : "Webhook enabled.");
      await loadWebhooks();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update webhook.");
    }
  }

  async function deleteWebhook(webhook) {
    if (!window.confirm(`Delete webhook ${webhook.url}?`)) {
      return;
    }

    try {
      await API.delete(`/merchant/developer/webhooks/${webhook._id}`);
      setNotice("Webhook deleted.");
      if (selected?._id === webhook._id) {
        setSelected(null);
        setDeliveries([]);
      }
      await loadWebhooks();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete webhook.");
    }
  }

  async function regenerateSecret(webhook) {
    if (!window.confirm("Regenerate this signing secret? Store the new value immediately.")) {
      return;
    }

    try {
      const res = await API.patch(
        `/merchant/developer/webhooks/${webhook._id}/regenerate-secret`
      );
      setSecret(res.data?.data?.signingSecret || "");
      setShowSecret(false);
      setNotice("Signing secret regenerated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to regenerate secret.");
    }
  }

  async function testWebhook(webhook) {
    try {
      await API.post(`/merchant/developer/webhooks/${webhook._id}/test`);
      setNotice("Webhook test recorded.");
      await selectWebhook(webhook);
      await loadWebhooks();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to test webhook.");
    }
  }

  async function selectWebhook(webhook) {
    try {
      setSelected(webhook);
      const res = await API.get(
        `/merchant/developer/webhooks/${webhook._id}/deliveries`
      );
      setDeliveries(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load delivery history.");
    }
  }

  async function retryDelivery(delivery) {
    try {
      await API.post(`/merchant/developer/webhook-deliveries/${delivery._id}/retry`);
      setNotice("Delivery retried.");
      if (selected) {
        await selectWebhook(selected);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to retry delivery.");
    }
  }

  function toggleEvent(eventType) {
    setForm((current) => {
      const exists = current.eventTypes.includes(eventType);
      return {
        ...current,
        eventTypes: exists
          ? current.eventTypes.filter((item) => item !== eventType)
          : [...current.eventTypes, eventType],
      };
    });
  }

  async function copySecret() {
    await navigator.clipboard?.writeText(secret);
    setNotice("Signing secret copied.");
  }

  return (
    <AppShell menu={merchantMenu} title="Webhooks">
      <section style={pageHeader}>
        <h1 style={pageTitle}>Webhooks</h1>
        <p style={pageSubtitle}>
          Manage event destinations, signing secrets, delivery health, and retry
          failed webhook deliveries.
        </p>
      </section>

      {error && <div style={errorBanner}>{error}</div>}
      {notice && <div style={successBanner}>{notice}</div>}
      {secret && (
        <section style={secretPanel}>
          <div>
            <strong>Signing secret</strong>
            <p style={secretHint}>
              Store this secret securely. It will not be shown again.
            </p>
          </div>
          <code style={secretCode}>{showSecret ? secret : maskSecret(secret)}</code>
          <div style={actions}>
            <button
              type="button"
              style={secondaryButton}
              onClick={() => setShowSecret((value) => !value)}
              aria-label={showSecret ? "Hide signing secret" : "Show signing secret"}
              title={showSecret ? "Hide signing secret" : "Show signing secret"}
            >
              {showSecret ? "Hide" : "Show"}
            </button>
            <button
              type="button"
              style={secondaryButton}
              onClick={copySecret}
              aria-label="Copy signing secret"
              title="Copy signing secret"
            >
              Copy
            </button>
          </div>
        </section>
      )}

      <section style={layout}>
        <form style={panel} onSubmit={submitWebhook}>
          <h2 style={sectionTitle}>{editing ? "Edit webhook" : "Create webhook"}</h2>
          <div style={formGrid}>
            <input
              name="webhookUrl"
              autoComplete="url"
              style={input}
              value={form.url}
              onChange={(event) =>
                setForm((current) => ({ ...current, url: event.target.value }))
              }
              placeholder="https://example.com/webhooks/aurapay"
            />
            <div style={eventGrid}>
              {events.map((eventType) => (
                <label key={eventType} style={eventItem}>
                  <input
                    name="webhookEvents"
                    type="checkbox"
                    checked={form.eventTypes.includes(eventType)}
                    onChange={() => toggleEvent(eventType)}
                  />
                  {eventType}
                </label>
              ))}
            </div>
          </div>
          <div style={actions}>
            <button type="submit" style={primaryButton} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save webhook" : "Create webhook"}
            </button>
            {editing && (
              <button type="button" style={secondaryButton} onClick={() => { setEditing(null); setForm(blankForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section style={panel}>
          <input
            name="webhookSearch"
            autoComplete="off"
            style={{ ...input, marginBottom: 16 }}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search webhooks"
          />

          {loading ? (
            <div style={emptyState}>Loading webhooks...</div>
          ) : filtered.length === 0 ? (
            <div style={emptyState}>No webhooks match the current filters.</div>
          ) : (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>URL</th>
                    <th style={th}>Events</th>
                    <th style={th}>Status</th>
                    <th style={th}>Last Delivery</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((webhook) => (
                    <tr key={webhook._id}>
                      <td style={td}>{webhook.url}</td>
                      <td style={td}>{(webhook.eventTypes || []).length || "All"}</td>
                      <td style={td}><Badge value={webhook.status} /></td>
                      <td style={td}>{formatDate(webhook.lastDelivery)}</td>
                      <td style={td}>
                        <div style={actions}>
                          <ActionButton label="View delivery history" icon="History" onClick={() => selectWebhook(webhook)} />
                          <ActionButton label="Edit webhook" icon="Edit" onClick={() => startEdit(webhook)} />
                          <ActionButton label={webhook.active ? "Disable webhook" : "Enable webhook"} icon={webhook.active ? "Disable" : "Enable"} onClick={() => toggleWebhook(webhook)} />
                          <ActionButton label="Regenerate signing secret" icon="Secret" onClick={() => regenerateSecret(webhook)} />
                          <ActionButton label="Test webhook" icon="Test" onClick={() => testWebhook(webhook)} />
                          <ActionButton label="Delete webhook" icon="Delete" onClick={() => deleteWebhook(webhook)} destructive />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <section style={{ ...panel, marginTop: 16 }}>
        <h2 style={sectionTitle}>
          Delivery History {selected ? `for ${selected.url}` : ""}
        </h2>
        {!selected ? (
          <div style={emptyState}>Select a webhook to view delivery history.</div>
        ) : deliveries.length === 0 ? (
          <div style={emptyState}>No deliveries recorded for this webhook.</div>
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Time</th>
                  <th style={th}>Event</th>
                  <th style={th}>Status</th>
                  <th style={th}>Status Code</th>
                  <th style={th}>Latency</th>
                  <th style={th}>Attempts</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr key={delivery._id}>
                    <td style={td}>{formatDate(delivery.createdAt)}</td>
                    <td style={td}>{delivery.eventType}</td>
                    <td style={td}><Badge value={delivery.status} /></td>
                    <td style={td}>{delivery.statusCode || "None"}</td>
                    <td style={td}>{delivery.latencyMs || 0} ms</td>
                    <td style={td}>{delivery.attempts}</td>
                    <td style={td}>
                      <button type="button" style={textButton} onClick={() => retryDelivery(delivery)}>
                        Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function Badge({ value }) {
  const normalized = String(value || "healthy").toLowerCase();
  const style =
    normalized === "healthy" || normalized === "delivered"
      ? healthyBadge
      : normalized === "disabled"
      ? disabledBadge
      : failedBadge;
  return <span style={style}>{normalized}</span>;
}

function ActionButton({ label, icon, onClick, destructive = false }) {
  return (
    <button
      type="button"
      style={destructive ? destructiveIconButton : iconButton}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function maskSecret(value = "") {
  if (!value) return "";
  return `${value.slice(0, 8)}${"*".repeat(18)}${value.slice(-4)}`;
}

function formatDate(value) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

const layout = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
  gap: 16,
};

const formGrid = {
  display: "grid",
  gap: 12,
};

const eventGrid = {
  display: "grid",
  gap: 8,
};

const eventItem = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#334155",
  fontSize: 14,
};

const sectionTitle = {
  margin: "0 0 16px",
  color: "#0F172A",
};

const actions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
};

const secondaryButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "11px 16px",
  fontWeight: 800,
  cursor: "pointer",
};

const secretPanel = {
  ...panel,
  display: "grid",
  gridTemplateColumns: "minmax(180px, 260px) minmax(0, 1fr) auto",
  gap: 12,
  alignItems: "center",
  marginBottom: 16,
  background: "#EFF6FF",
  borderColor: "#93C5FD",
};

const secretHint = {
  margin: "6px 0 0",
  color: "#2563EB",
  fontSize: 13,
  fontWeight: 700,
};

const secretCode = {
  background: "#FFFFFF",
  border: "1px solid #BFDBFE",
  borderRadius: 8,
  padding: "10px 12px",
  overflowX: "auto",
};

const iconButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "8px 9px",
  fontSize: 12,
  fontWeight: 900,
  cursor: "pointer",
};

const destructiveIconButton = {
  ...iconButton,
  color: "#B91C1C",
  borderColor: "#FECACA",
  background: "#FEF2F2",
};

const badgeBase = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "5px 9px",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "capitalize",
};

const healthyBadge = {
  ...badgeBase,
  background: "#DCFCE7",
  color: "#166534",
};

const disabledBadge = {
  ...badgeBase,
  background: "#F1F5F9",
  color: "#475569",
};

const failedBadge = {
  ...badgeBase,
  background: "#FEE2E2",
  color: "#991B1B",
};
