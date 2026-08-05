import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  name: "",
  description: "",
  website: "",
  logo: "",
  redirectUris: "",
  allowedOrigins: "",
  environment: "sandbox",
  active: true,
};

export default function DeveloperApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [environment, setEnvironment] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankForm);

  const pageSize = 8;

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant/developer/applications");
      setApplications(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load applications.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((app) => {
      const matchesSearch =
        !term ||
        [app.name, app.description, app.website, app.environment]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesEnvironment =
        environment === "all" || app.environment === environment;

      return matchesSearch && matchesEnvironment;
    });
  }, [applications, environment, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function submitApplication(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Application name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      website: form.website.trim(),
      logo: form.logo.trim(),
      redirectUris: toLines(form.redirectUris),
      allowedOrigins: toLines(form.allowedOrigins),
      environment: form.environment,
      active: form.active,
    };

    try {
      setSaving(true);
      setError("");
      setNotice("");

      if (editing) {
        await API.put(`/merchant/developer/applications/${editing._id}`, payload);
        setNotice("Application updated.");
      } else {
        await API.post("/merchant/developer/applications", payload);
        setNotice("Application created.");
      }

      setEditing(null);
      setForm(blankForm);
      await loadApplications();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          `Unable to ${editing ? "update" : "create"} application.`
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(app) {
    setEditing(app);
    setForm({
      name: app.name || "",
      description: app.description || "",
      website: app.website || "",
      logo: app.logo || "",
      redirectUris: (app.redirectUris || []).join("\n"),
      allowedOrigins: (app.allowedOrigins || []).join("\n"),
      environment: app.environment || "sandbox",
      active: app.active !== false,
    });
  }

  async function deleteApplication(app) {
    if (!window.confirm(`Delete "${app.name}"?`)) {
      return;
    }

    try {
      setError("");
      setNotice("");
      await API.delete(`/merchant/developer/applications/${app._id}`);
      setNotice("Application deleted.");
      await loadApplications();
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete application.");
    }
  }

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <AppShell menu={merchantMenu} title="Applications">
      <section style={pageHeader}>
        <h1 style={pageTitle}>Applications</h1>
        <p style={pageSubtitle}>
          Manage client applications, redirect URLs, allowed origins, and
          sandbox integration metadata.
        </p>
      </section>

      {error && <div style={errorBanner}>{error}</div>}
      {notice && <div style={successBanner}>{notice}</div>}

      <section style={layout}>
        <form style={panel} onSubmit={submitApplication}>
          <h2 style={sectionTitle}>{editing ? "Edit application" : "Create application"}</h2>
          <div style={formGrid}>
            <input style={input} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Application name" />
            <input style={input} value={form.website} onChange={(event) => update("website", event.target.value)} placeholder="Website" />
            <input style={input} value={form.logo} onChange={(event) => update("logo", event.target.value)} placeholder="Logo URL" />
            <select style={input} value={form.environment} onChange={(event) => update("environment", event.target.value)}>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
            <textarea style={textarea} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Description" />
            <textarea style={textarea} value={form.redirectUris} onChange={(event) => update("redirectUris", event.target.value)} placeholder="Redirect URLs, one per line" />
            <textarea style={textarea} value={form.allowedOrigins} onChange={(event) => update("allowedOrigins", event.target.value)} placeholder="Allowed origins, one per line" />
            <label style={checkboxRow}>
              <input type="checkbox" checked={form.active} onChange={(event) => update("active", event.target.checked)} />
              Active application
            </label>
          </div>
          <div style={actions}>
            <button type="submit" style={primaryButton} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save application" : "Create application"}
            </button>
            {editing && (
              <button type="button" style={secondaryButton} onClick={() => { setEditing(null); setForm(blankForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <section style={panel}>
          <div style={toolbar}>
            <input style={input} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search applications" />
            <select style={input} value={environment} onChange={(event) => { setEnvironment(event.target.value); setPage(1); }}>
              <option value="all">All environments</option>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </div>

          {loading ? (
            <div style={emptyState}>Loading applications...</div>
          ) : pageItems.length === 0 ? (
            <div style={emptyState}>No applications match the current filters.</div>
          ) : (
            <div style={tableWrap}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Application</th>
                    <th style={th}>Environment</th>
                    <th style={th}>Status</th>
                    <th style={th}>Redirect URLs</th>
                    <th style={th}>Created</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((app) => (
                    <tr key={app._id}>
                      <td style={td}>
                        <strong>{app.name}</strong>
                        <div style={muted}>{app.website || "No website"}</div>
                      </td>
                      <td style={td}>{app.environment}</td>
                      <td style={td}><Badge active={app.active !== false} /></td>
                      <td style={td}>{(app.redirectUris || []).length}</td>
                      <td style={td}>{formatDate(app.createdAt)}</td>
                      <td style={td}>
                        <div style={actions}>
                          <Link style={linkButton} to={`/merchant/developer/applications/${app._id}`}>
                            Details
                          </Link>
                          <button type="button" style={textButton} onClick={() => startEdit(app)}>
                            Edit
                          </button>
                          <button type="button" style={dangerButton} onClick={() => deleteApplication(app)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

function Badge({ active }) {
  return <span style={active ? activeBadge : disabledBadge}>{active ? "active" : "disabled"}</span>;
}

function Pagination({ page, pageCount, total, onPrev, onNext }) {
  return (
    <div style={pagination}>
      <span style={muted}>{total} records</span>
      <div style={actions}>
        <button type="button" style={smallButton} disabled={page === 1} onClick={onPrev}>Previous</button>
        <span style={muted}>Page {page} of {pageCount}</span>
        <button type="button" style={smallButton} disabled={page === pageCount} onClick={onNext}>Next</button>
      </div>
    </div>
  );
}

function toLines(value) {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

const layout = {
  display: "grid",
  gridTemplateColumns: "minmax(300px, 420px) minmax(0, 1fr)",
  gap: 16,
};

const toolbar = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1fr) 170px",
  gap: 10,
  marginBottom: 16,
};

const formGrid = {
  display: "grid",
  gap: 12,
};

const textarea = {
  ...input,
  minHeight: 86,
  resize: "vertical",
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#334155",
  fontWeight: 700,
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

const smallButton = {
  ...secondaryButton,
  padding: "8px 10px",
};

const linkButton = {
  color: "#2563EB",
  fontWeight: 800,
  textDecoration: "none",
};

const dangerButton = {
  ...textButton,
  color: "#DC2626",
};

const muted = {
  color: "#64748B",
  fontSize: 13,
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

const disabledBadge = {
  ...activeBadge,
  background: "#F1F5F9",
  color: "#475569",
};

const pagination = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 16,
};
