import { Fragment, useEffect, useMemo, useState } from "react";

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
  table,
  tableWrap,
  td,
  th,
} from "./developerStyles";

const pageSize = 10;

export default function DeveloperApiLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [environment, setEnvironment] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant/developer/api-logs");
      setLogs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to load API logs.");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return logs.filter((log) => {
      const statusFamily = `${Math.floor(Number(log.status || 0) / 100)}xx`;
      const matchesSearch =
        !term ||
        [
          log.endpoint,
          log.method,
          log.ip,
          log.environment,
          log.apiKey?.name,
          log.apiKey?.publicKey,
          log.requestId,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchesMethod = method === "all" || log.method === method;
      const matchesStatus = status === "all" || statusFamily === status;
      const matchesEnvironment =
        environment === "all" || log.environment === environment;

      return matchesSearch && matchesMethod && matchesStatus && matchesEnvironment;
    });
  }, [environment, logs, method, search, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AppShell menu={merchantMenu} title="API Logs">
      <section style={pageHeader}>
        <h1 style={pageTitle}>API Logs</h1>
        <p style={pageSubtitle}>
          Inspect sanitized request history, latency, status codes, and API key
          usage without exposing sensitive payloads.
        </p>
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      <section style={panel}>
        <div style={toolbar}>
          <input
            name="apiLogSearch"
            autoComplete="off"
            style={input}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search endpoint, API key, IP, request ID"
          />
          <select name="apiLogMethod" style={input} value={method} onChange={(event) => { setMethod(event.target.value); setPage(1); }}>
            <option value="all">All methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select name="apiLogStatus" style={input} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="2xx">2xx</option>
            <option value="3xx">3xx</option>
            <option value="4xx">4xx</option>
            <option value="5xx">5xx</option>
          </select>
          <select name="apiLogEnvironment" style={input} value={environment} onChange={(event) => { setEnvironment(event.target.value); setPage(1); }}>
            <option value="all">All envs</option>
            <option value="sandbox">Sandbox</option>
            <option value="live">Live</option>
          </select>
        </div>

        {loading ? (
          <div style={emptyState}>Loading API logs...</div>
        ) : pageItems.length === 0 ? (
          <div style={emptyState}>No API logs match the current filters.</div>
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Time</th>
                  <th style={th}>Endpoint</th>
                  <th style={th}>Method</th>
                  <th style={th}>Status</th>
                  <th style={th}>Latency</th>
                  <th style={th}>API Key</th>
                  <th style={th}>IP</th>
                  <th style={th}>Environment</th>
                  <th style={th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((log) => (
                  <Fragment key={log._id}>
                    <tr>
                      <td style={td}>{formatDate(log.createdAt)}</td>
                      <td style={td}>{log.endpoint}</td>
                      <td style={td}><code style={methodBadge}>{log.method}</code></td>
                      <td style={td}><Status value={log.status} /></td>
                      <td style={td}>{log.latencyMs || 0} ms</td>
                      <td style={td}>{log.apiKey?.name || "Unknown key"}</td>
                      <td style={td}>{log.ip || "Not captured"}</td>
                      <td style={td}>{log.environment}</td>
                      <td style={td}>
                        <button
                          type="button"
                          style={iconButton}
                          onClick={() => setExpanded(expanded === log._id ? null : log._id)}
                          aria-label={expanded === log._id ? "Hide API log details" : "View API log details"}
                          title={expanded === log._id ? "Hide API log details" : "View API log details"}
                        >
                          {expanded === log._id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expanded === log._id && (
                      <tr>
                        <td style={detailCell} colSpan="9">
                          <div style={detailGrid}>
                            <Detail title="Request" data={log.sanitizedRequest} />
                            <Detail title="Response" data={log.sanitizedResponse} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
    </AppShell>
  );
}

function Status({ value }) {
  const code = Number(value || 0);
  const style = code >= 500 ? dangerStatus : code >= 400 ? warningStatus : successStatus;
  return <span style={style}>{code}</span>;
}

function Detail({ title, data }) {
  const permissionMessage =
    data?.code === "forbidden" && data?.requiredPermission
      ? `Permission denied. This API key does not include ${data.requiredPermission}.`
      : "";

  return (
    <div>
      <strong>{title}</strong>
      {permissionMessage && <p style={permissionNotice}>{permissionMessage}</p>}
      <pre style={pre}>{JSON.stringify(data || {}, null, 2)}</pre>
    </div>
  );
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

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

const toolbar = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
  marginBottom: 16,
};

const methodBadge = {
  background: "#F8FAFC",
  border: "1px solid #E2E8F0",
  borderRadius: 6,
  padding: "4px 7px",
};

const statusBase = {
  display: "inline-flex",
  borderRadius: 999,
  padding: "5px 9px",
  fontSize: 12,
  fontWeight: 800,
};

const successStatus = {
  ...statusBase,
  background: "#DCFCE7",
  color: "#166534",
};

const warningStatus = {
  ...statusBase,
  background: "#FEF3C7",
  color: "#92400E",
};

const dangerStatus = {
  ...statusBase,
  background: "#FEE2E2",
  color: "#991B1B",
};

const detailCell = {
  padding: 16,
  borderTop: "1px solid #E2E8F0",
  background: "#F8FAFC",
};

const detailGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
};

const pre = {
  margin: "8px 0 0",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 12,
  overflowX: "auto",
  fontSize: 12,
};

const pagination = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  marginTop: 16,
};

const actions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  alignItems: "center",
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

const muted = {
  color: "#64748B",
  fontSize: 13,
};

const iconButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "8px 10px",
  fontWeight: 800,
  cursor: "pointer",
};

const permissionNotice = {
  margin: "8px 0 0",
  color: "#92400E",
  background: "#FEF3C7",
  border: "1px solid #FDE68A",
  borderRadius: 8,
  padding: "9px 10px",
  fontSize: 13,
  fontWeight: 800,
};
