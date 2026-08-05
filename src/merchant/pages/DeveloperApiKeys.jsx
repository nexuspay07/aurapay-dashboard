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
  th,
} from "./developerStyles";

const pageSize = 8;

const permissionPresets = [
  {
    name: "Read Only",
    permissions: [
      "account:read",
      "payments:read",
      "checkouts:read",
      "transactions:read",
      "settlements:read",
    ],
  },
  {
    name: "Checkout Integration",
    permissions: ["checkouts:create", "checkouts:read", "transactions:read"],
  },
  {
    name: "Payment Integration",
    permissions: [
      "payments:create",
      "payments:read",
      "refunds:create",
      "refunds:read",
      "transactions:read",
    ],
  },
];

export default function DeveloperApiKeys() {
  const [keys, setKeys] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [secret, setSecret] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({
    name: "",
    environment: "sandbox",
    permissions: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      setSecret(null);
      setShowSecret(false);
    };
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [keysRes, metadataRes] = await Promise.all([
        API.get("/merchant/developer/api-keys"),
        API.get("/merchant/developer/metadata"),
      ]);

      setKeys(Array.isArray(keysRes.data?.data) ? keysRes.data.data : []);
      setPermissions(metadataRes.data?.data?.apiPermissions || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load API keys.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return keys.filter((key) => {
      const matchesSearch =
        !term ||
        [key.name, key.publicKey, key.environment, key.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesEnvironment =
        environment === "all" || key.environment === environment;
      const matchesStatus = status === "all" || key.status === status;

      return matchesSearch && matchesEnvironment && matchesStatus;
    });
  }, [environment, keys, search, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const canCreate = form.name.trim() && form.permissions.length > 0 && !saving;

  async function createKey(event) {
    event.preventDefault();
    setTouched(true);

    if (!form.name.trim()) {
      setError("API key name is required.");
      return;
    }

    if (form.permissions.length === 0) {
      setError("Select at least one permission before creating an API key.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");
      setSecret(null);
      setShowSecret(false);

      const res = await API.post("/merchant/developer/api-keys", form);
      setSecret({
        title: "Secret key created",
        publicKey: res.data?.data?.apiKey?.publicKey,
        secretKey: res.data?.data?.secretKey,
      });
      setNotice("API key created.");
      setForm({
        name: "",
        environment: "sandbox",
        permissions: [],
      });
      setTouched(false);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create API key.");
    } finally {
      setSaving(false);
    }
  }

  async function rotateKey(key) {
    const message =
      (key.permissions || []).length === 0
        ? `Rotate "${key.name}"? The new secret keeps the same permissions. Add permissions by creating a replacement key.`
        : `Rotate "${key.name}"? The old secret will stop working.`;

    if (!window.confirm(message)) {
      return;
    }

    try {
      setError("");
      setNotice("");
      setSecret(null);
      setShowSecret(false);

      const res = await API.patch(`/merchant/developer/api-keys/${key._id}/rotate`);
      setSecret({
        title: "Secret key rotated",
        publicKey: res.data?.data?.apiKey?.publicKey,
        secretKey: res.data?.data?.secretKey,
      });
      setNotice("API key rotated.");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to rotate API key.");
    }
  }

  async function revokeKey(key) {
    if (!window.confirm(`Revoke "${key.name}"? This action disables the key.`)) {
      return;
    }

    try {
      setError("");
      setNotice("");
      await API.patch(`/merchant/developer/api-keys/${key._id}/revoke`);
      setNotice("API key revoked.");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to revoke API key.");
    }
  }

  async function deleteKey(key) {
    if (!window.confirm(`Delete "${key.name}" permanently?`)) {
      return;
    }

    try {
      setError("");
      setNotice("");
      await API.delete(`/merchant/developer/api-keys/${key._id}`);
      setNotice("API key deleted.");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete API key.");
    }
  }

  function replaceLegacyKey(key) {
    setForm({
      name: `${key.name} replacement`,
      environment: key.environment || "sandbox",
      permissions: permissions.filter((permission) =>
        permissionPresets[1].permissions.includes(permission)
      ),
    });
    setTouched(true);
    setNotice("Review permissions, then create a replacement key.");
  }

  function togglePermission(permission) {
    setTouched(true);
    setForm((current) => {
      const exists = current.permissions.includes(permission);
      return {
        ...current,
        permissions: exists
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  }

  function applyPreset(selectedPermissions) {
    setTouched(true);
    setForm((current) => ({
      ...current,
      permissions: permissions.filter((permission) =>
        selectedPermissions.includes(permission)
      ),
    }));
  }

  function selectAll() {
    setTouched(true);
    setForm((current) => ({
      ...current,
      permissions,
    }));
  }

  function clearAll() {
    setTouched(true);
    setForm((current) => ({
      ...current,
      permissions: [],
    }));
  }

  async function copy(value, message) {
    await navigator.clipboard?.writeText(value);
    setNotice(message);
  }

  return (
    <AppShell menu={merchantMenu} title="API Keys">
      <section style={pageHeader}>
        <h1 style={pageTitle}>API Keys</h1>
        <p style={pageSubtitle}>
          Manage sandbox credentials. Secret keys are only displayed immediately
          after creation or rotation.
        </p>
      </section>

      {error && <div style={errorBanner}>{error}</div>}
      {notice && <div style={successBanner}>{notice}</div>}
      {secret && (
        <section style={secretPanel}>
          <div>
            <h2 style={sectionTitle}>{secret.title}</h2>
            <p style={hint}>
              Store this secret securely. It will not be shown again.
            </p>
          </div>
          <SecretRow
            label="Public key"
            value={secret.publicKey}
            visible
            onCopy={copy}
          />
          <SecretRow
            label="Secret key"
            value={secret.secretKey}
            visible={showSecret}
            onCopy={copy}
            onToggle={() => setShowSecret((value) => !value)}
          />
        </section>
      )}

      <section style={layout}>
        <form style={panel} onSubmit={createKey}>
          <h2 style={sectionTitle}>Create API key</h2>
          <div style={formGrid}>
            <label style={label}>
              Key name
              <input
                name="apiKeyName"
                autoComplete="off"
                style={input}
                value={form.name}
                onBlur={() => setTouched(true)}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Checkout service key"
              />
            </label>
            <label style={label}>
              Environment
              <select
                name="apiKeyEnvironment"
                style={input}
                value={form.environment}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    environment: event.target.value,
                  }))
                }
              >
                <option value="sandbox">Sandbox</option>
                <option value="live">Live</option>
              </select>
            </label>
          </div>

          <div style={permissionHeader}>
            <strong>Permissions</strong>
            <span style={hint}>{form.permissions.length} selected</span>
          </div>

          <div style={presetGrid}>
            {permissionPresets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                style={presetButton}
                onClick={() => applyPreset(preset.permissions)}
              >
                {preset.name}
              </button>
            ))}
            <button type="button" style={presetButton} onClick={selectAll}>
              Full Sandbox Access
            </button>
          </div>

          <div style={quickActions}>
            <button type="button" style={smallButton} onClick={selectAll}>
              Select all
            </button>
            <button type="button" style={smallButton} onClick={clearAll}>
              Clear all
            </button>
          </div>

          {touched && form.permissions.length === 0 && (
            <p style={inlineError}>Select at least one permission.</p>
          )}
          {!canCreate && (
            <p style={helperText}>
              Enter a name and select at least one permission to create a usable key.
            </p>
          )}

          <div style={permissionGrid}>
            {permissions.map((permission) => (
              <label key={permission} style={permissionItem}>
                <input
                  name="apiKeyPermissions"
                  type="checkbox"
                  checked={form.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                />
                <span>{permission}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            style={canCreate ? primaryButton : disabledPrimaryButton}
            disabled={!canCreate}
          >
            {saving ? "Creating..." : "Create key"}
          </button>
        </form>

        <section style={panel}>
          <div style={toolbar}>
            <input
              name="apiKeySearch"
              autoComplete="off"
              style={input}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search keys"
            />
            <select
              name="apiKeyEnvironmentFilter"
              style={input}
              value={environment}
              onChange={(event) => {
                setEnvironment(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All environments</option>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
            <select
              name="apiKeyStatusFilter"
              style={input}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>

          {loading ? (
            <div style={emptyState}>Loading API keys...</div>
          ) : pageItems.length === 0 ? (
            <div style={emptyState}>No API keys match the current filters.</div>
          ) : (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Name</th>
                    <th style={th}>Environment</th>
                    <th style={th}>Permissions</th>
                    <th style={th}>Status</th>
                    <th style={th}>Created</th>
                    <th style={th}>Last Used</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((key) => {
                    const keyPermissions = key.permissions || [];
                    return (
                      <tr key={key._id}>
                        <td style={td}>
                          <strong>{key.name}</strong>
                          <div style={mono}>{key.publicKey}</div>
                        </td>
                        <td style={td}>{key.environment}</td>
                        <td style={td}>
                          {keyPermissions.length > 0 ? (
                            <div style={badgeWrap}>
                              {keyPermissions.map((permission) => (
                                <span key={permission} style={permissionBadge}>
                                  {permission}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div style={legacyWarning}>
                              No permissions - API requests will be denied.
                            </div>
                          )}
                        </td>
                        <td style={td}>
                          <Badge value={key.status} />
                        </td>
                        <td style={td}>{formatDate(key.createdAt)}</td>
                        <td style={td}>{formatDate(key.lastUsed)}</td>
                        <td style={td}>
                          <div style={actions}>
                            <ActionButton
                              label="Copy public key"
                              icon="Copy"
                              onClick={() => copy(key.publicKey, "Public key copied.")}
                            />
                            {keyPermissions.length === 0 && (
                              <ActionButton
                                label="Replace legacy key"
                                icon="Replace"
                                onClick={() => replaceLegacyKey(key)}
                              />
                            )}
                            <ActionButton
                              label="Rotate secret"
                              icon="Rotate"
                              onClick={() => rotateKey(key)}
                            />
                            <ActionButton
                              label="Revoke key"
                              icon="Revoke"
                              onClick={() => revokeKey(key)}
                              destructive
                            />
                            <ActionButton
                              label="Delete key"
                              icon="Delete"
                              onClick={() => deleteKey(key)}
                              destructive
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            pageCount={pageCount}
            total={filtered.length}
            onPrev={() => setPage((value) => Math.max(1, value - 1))}
            onNext={() => setPage((value) => Math.min(pageCount, value + 1))}
          />
        </section>
      </section>
    </AppShell>
  );
}

function SecretRow({ label, value, visible, onCopy, onToggle }) {
  const displayValue = visible ? value : maskSecret(value);

  return (
    <div style={secretRow}>
      <span style={secretLabel}>{label}</span>
      <code style={secretValue}>{displayValue}</code>
      <div style={actions}>
        {onToggle && (
          <button
            type="button"
            style={smallButton}
            onClick={onToggle}
            aria-label={`${visible ? "Hide" : "Show"} ${label}`}
            title={`${visible ? "Hide" : "Show"} ${label}`}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
        <button
          type="button"
          style={smallButton}
          onClick={() => onCopy(value, `${label} copied.`)}
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
        >
          Copy
        </button>
      </div>
    </div>
  );
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

function Badge({ value }) {
  const active = value === "active";
  return <span style={active ? activeBadge : revokedBadge}>{value}</span>;
}

function Pagination({ page, pageCount, total, onPrev, onNext }) {
  return (
    <div style={pagination}>
      <span style={hint}>{total} records</span>
      <div style={actions}>
        <button type="button" style={smallButton} disabled={page === 1} onClick={onPrev}>
          Previous
        </button>
        <span style={hint}>
          Page {page} of {pageCount}
        </span>
        <button type="button" style={smallButton} disabled={page === pageCount} onClick={onNext}>
          Next
        </button>
      </div>
    </div>
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

const toolbar = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
  marginBottom: 16,
};

const formGrid = {
  display: "grid",
  gap: 12,
  marginBottom: 16,
};

const label = {
  display: "grid",
  gap: 7,
  color: "#334155",
  fontSize: 13,
  fontWeight: 800,
};

const permissionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  color: "#0F172A",
};

const presetGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
  marginBottom: 10,
};

const quickActions = {
  display: "flex",
  gap: 8,
  marginBottom: 10,
};

const presetButton = {
  border: "1px solid #CBD5E1",
  background: "#F8FAFC",
  color: "#0F172A",
  borderRadius: 8,
  padding: "9px 10px",
  fontWeight: 800,
  cursor: "pointer",
  textAlign: "left",
};

const permissionGrid = {
  display: "grid",
  gap: 8,
  marginBottom: 18,
};

const permissionItem = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#334155",
  fontSize: 14,
};

const inlineError = {
  color: "#B91C1C",
  fontSize: 13,
  fontWeight: 800,
  margin: "0 0 10px",
};

const helperText = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 700,
  margin: "0 0 10px",
};

const sectionTitle = {
  margin: "0 0 12px",
  color: "#0F172A",
};

const hint = {
  color: "#64748B",
  fontSize: 13,
};

const secretPanel = {
  ...panel,
  display: "grid",
  gap: 10,
  marginBottom: 16,
  borderColor: "#93C5FD",
  background: "#EFF6FF",
};

const secretRow = {
  display: "grid",
  gridTemplateColumns: "110px minmax(0, 1fr) auto",
  gap: 10,
  alignItems: "center",
};

const secretLabel = {
  color: "#475569",
  fontWeight: 800,
  fontSize: 13,
};

const secretValue = {
  background: "#FFFFFF",
  border: "1px solid #BFDBFE",
  borderRadius: 8,
  padding: "10px 12px",
  overflowX: "auto",
};

const mono = {
  color: "#64748B",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: 12,
  marginTop: 4,
};

const actions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
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

const smallButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "8px 10px",
  fontWeight: 800,
  cursor: "pointer",
};

const disabledPrimaryButton = {
  ...primaryButton,
  opacity: 0.55,
  cursor: "not-allowed",
};

const badgeWrap = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

const permissionBadge = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "5px 8px",
  background: "#EEF2FF",
  color: "#3730A3",
  fontSize: 12,
  fontWeight: 800,
};

const legacyWarning = {
  color: "#92400E",
  background: "#FEF3C7",
  border: "1px solid #FDE68A",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 800,
};

const activeBadge = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "5px 9px",
  background: "#DCFCE7",
  color: "#166534",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "capitalize",
};

const revokedBadge = {
  ...activeBadge,
  background: "#FEE2E2",
  color: "#991B1B",
};

const pagination = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 16,
};
