import { useEffect, useMemo, useState } from "react";

import AppShell from "../layouts/AppShell";
import { merchantMenu } from "../data/sidebarMenu";
import API from "../services/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function MerchantCheckouts() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState("createdAt");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/checkout-ops/sessions");
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load checkout sessions."
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return sessions
      .filter((session) => {
        const matchesSearch =
          !term ||
          [
            session.sessionId,
            session.customerName,
            session.customerEmail,
            session.currency,
            session.status,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term));

        const matchesStatus = status === "all" || session.status === status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortKey === "amount") {
          return Number(b.amount || 0) - Number(a.amount || 0);
        }

        if (sortKey === "status") {
          return String(a.status || "").localeCompare(String(b.status || ""));
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [search, sessions, sortKey, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function copyLink(session) {
    const link = `${window.location.origin}/pay/${session.sessionId}`;
    await navigator.clipboard?.writeText(link);
    setNotice("Checkout link copied.");
  }

  async function archiveSession(session) {
    try {
      setNotice("");
      await API.patch(`/checkout-ops/sessions/${session._id}/archive`);
      await loadSessions();
      setNotice("Checkout archived.");
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to archive checkout.");
    }
  }

  async function deleteSession(session) {
    try {
      setNotice("");
      await API.delete(`/checkout-ops/sessions/${session._id}`);
      await loadSessions();
      setNotice("Checkout deleted.");
    } catch (err) {
      setError(err?.response?.data?.error || "Unable to delete checkout.");
    }
  }

  return (
    <AppShell menu={merchantMenu} title="Checkouts">
      <section style={header}>
        <div>
          <h1 style={title}>Checkout Management</h1>
          <p style={subtitle}>
            Manage hosted checkout links, customer sessions, and payment status.
          </p>
        </div>
      </section>

      {error && <div style={errorBanner}>{error}</div>}
      {notice && <div style={successBanner}>{notice}</div>}

      <section style={toolbar}>
        <input
          style={input}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search checkout ID, customer, email, currency..."
        />

        <select
          style={select}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">All statuses</option>
          <option value="created">Created</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="expired">Archived</option>
        </select>

        <select
          style={select}
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value)}
        >
          <option value="createdAt">Newest first</option>
          <option value="amount">Amount</option>
          <option value="status">Status</option>
        </select>
      </section>

      <section style={tableCard}>
        {loading ? (
          <TableSkeleton />
        ) : pageItems.length === 0 ? (
          <EmptyState message="No checkout sessions match the current filters." />
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <Th>Checkout ID</Th>
                  <Th>Customer</Th>
                  <Th>Email</Th>
                  <Th>Amount</Th>
                  <Th>Currency</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((session) => (
                  <tr key={session._id}>
                    <Td mono>{session.sessionId}</Td>
                    <Td>{session.customerName || "Customer"}</Td>
                    <Td>{session.customerEmail || "No email"}</Td>
                    <Td>{money(session.amount)}</Td>
                    <Td>{String(session.currency || "USD").toUpperCase()}</Td>
                    <Td><Badge value={session.status} /></Td>
                    <Td>{formatDate(session.createdAt)}</Td>
                    <Td>
                      <div style={actionGroup}>
                        <button type="button" style={textButton} onClick={() => copyLink(session)}>
                          Copy
                        </button>
                        <a
                          style={textLink}
                          href={`/pay/${session.sessionId}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                        <button type="button" style={textButton} onClick={() => archiveSession(session)}>
                          Archive
                        </button>
                        <button type="button" style={dangerButton} onClick={() => deleteSession(session)}>
                          Delete
                        </button>
                      </div>
                    </Td>
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
    </AppShell>
  );
}

function Pagination({ page, pageCount, total, onPrev, onNext }) {
  return (
    <div style={pagination}>
      <span style={muted}>{total} records</span>
      <div style={pagerControls}>
        <button type="button" style={secondaryButton} onClick={onPrev} disabled={page === 1}>
          Previous
        </button>
        <span style={pageIndicator}>Page {page} of {pageCount}</span>
        <button type="button" style={secondaryButton} onClick={onNext} disabled={page === pageCount}>
          Next
        </button>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div style={skeletonStack}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} style={skeletonRow} />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return <div style={emptyState}>{message}</div>;
}

function Badge({ value }) {
  const normalized = String(value || "unknown").toLowerCase();
  const tone =
    normalized === "paid"
      ? successBadge
      : normalized === "failed" || normalized === "expired"
      ? dangerBadge
      : warningBadge;

  return <span style={{ ...badge, ...tone }}>{normalized}</span>;
}

function Th({ children }) {
  return <th style={th}>{children}</th>;
}

function Td({ children, mono = false }) {
  return <td style={{ ...td, ...(mono ? monoText : {}) }}>{children}</td>;
}

function money(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
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
};

const toolbar = {
  display: "grid",
  gridTemplateColumns: "minmax(260px, 1fr) 180px 180px",
  gap: 12,
  marginBottom: 16,
};

const input = {
  width: "100%",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  padding: "11px 12px",
  boxSizing: "border-box",
};

const select = {
  ...input,
  background: "#FFFFFF",
};

const tableCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  overflow: "hidden",
};

const tableWrap = {
  overflowX: "auto",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1020,
};

const th = {
  textAlign: "left",
  padding: "13px 16px",
  background: "#F8FAFC",
  color: "#475569",
  fontSize: 12,
  textTransform: "uppercase",
};

const td = {
  padding: "15px 16px",
  borderTop: "1px solid #E2E8F0",
  color: "#334155",
  verticalAlign: "middle",
};

const monoText = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const actionGroup = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

const textButton = {
  border: "none",
  background: "transparent",
  color: "#2563EB",
  fontWeight: 800,
  cursor: "pointer",
};

const textLink = {
  color: "#2563EB",
  fontWeight: 800,
  textDecoration: "none",
};

const dangerButton = {
  ...textButton,
  color: "#DC2626",
};

const pagination = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 16,
  borderTop: "1px solid #E2E8F0",
};

const pagerControls = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const pageIndicator = {
  color: "#475569",
  fontSize: 13,
};

const secondaryButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "9px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const muted = {
  color: "#64748B",
  fontSize: 13,
};

const emptyState = {
  minHeight: 240,
  display: "grid",
  placeItems: "center",
  color: "#64748B",
};

const skeletonStack = {
  padding: 16,
  display: "grid",
  gap: 12,
};

const skeletonRow = {
  height: 44,
  borderRadius: 8,
  background: "#E2E8F0",
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

const badge = {
  borderRadius: 999,
  padding: "5px 9px",
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
