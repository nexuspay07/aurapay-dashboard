import { useEffect, useMemo, useState } from "react";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function MerchantTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [provider, setProvider] = useState("all");
  const [page, setPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/merchant-analytics/transactions");
      setTransactions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load merchant transactions."
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      const matchesSearch =
        !term ||
        [
          tx.providerPaymentId,
          tx.transactionId,
          tx.customerName,
          tx.customerEmail,
          tx.provider,
          tx.status,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));

      const matchesStatus = status === "all" || tx.status === status;
      const matchesProvider =
        provider === "all" ||
        String(tx.provider || "").toLowerCase() === provider;

      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [provider, search, status, transactions]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function exportCsv() {
    const headers = [
      "Payment ID",
      "Customer",
      "Email",
      "Amount",
      "Currency",
      "Provider",
      "Status",
      "Fees",
      "Net Amount",
      "Created",
    ];

    const rows = filtered.map((tx) => [
      tx.providerPaymentId || tx.transactionId || tx._id,
      tx.customerName || "",
      tx.customerEmail || "",
      tx.amount || 0,
      tx.currency || "",
      tx.provider || "",
      tx.status || "",
      tx.merchantFee || tx.estimatedFee || 0,
      tx.merchantNet || tx.estimatedNet || 0,
      tx.createdAt || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aurapay-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell menu={merchantMenu} title="Transactions">
      <Header
        title="Transactions"
        subtitle="Search, filter, export, and reconcile live payment activity."
        action={
          <button type="button" onClick={exportCsv} style={primaryButton}>
            Export CSV
          </button>
        }
      />

      {error && <div style={errorBanner}>{error}</div>}

      <section style={toolbar}>
        <input
          style={input}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search payment ID, customer, email, provider..."
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
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          style={select}
          value={provider}
          onChange={(event) => {
            setProvider(event.target.value);
            setPage(1);
          }}
        >
          <option value="all">All providers</option>
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="internal">Internal</option>
          <option value="test">Test</option>
        </select>
      </section>

      <section style={tableCard}>
        {loading ? (
          <TableSkeleton />
        ) : pageItems.length === 0 ? (
          <EmptyState message="No transactions match the current filters." />
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <Th>Payment ID</Th>
                  <Th>Customer</Th>
                  <Th>Amount</Th>
                  <Th>Currency</Th>
                  <Th>Provider</Th>
                  <Th>Status</Th>
                  <Th>Fees</Th>
                  <Th>Net Amount</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((tx) => (
                  <tr key={tx._id}>
                    <Td mono>{shortId(tx.providerPaymentId || tx.transactionId || tx._id)}</Td>
                    <Td>
                      <strong>{tx.customerName || "Customer"}</strong>
                      <div style={muted}>{tx.customerEmail || "No email"}</div>
                    </Td>
                    <Td>{money(tx.amount)}</Td>
                    <Td>{String(tx.currency || "USD").toUpperCase()}</Td>
                    <Td>{tx.provider || "AuraPay"}</Td>
                    <Td><Badge value={tx.status} /></Td>
                    <Td>{money(tx.merchantFee || tx.estimatedFee)}</Td>
                    <Td>{money(tx.merchantNet || tx.estimatedNet || tx.amount)}</Td>
                    <Td>{formatDate(tx.createdAt)}</Td>
                    <Td>
                      <button
                        type="button"
                        style={textButton}
                        onClick={() => navigator.clipboard?.writeText(tx.providerPaymentId || tx.transactionId || tx._id)}
                      >
                        Copy ID
                      </button>
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

function Header({ title, subtitle, action }) {
  return (
    <section style={header}>
      <div>
        <h1 style={pageTitle}>{title}</h1>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>
      {action}
    </section>
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
    normalized === "completed" || normalized === "paid"
      ? successBadge
      : normalized === "failed" || normalized === "refunded"
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

function shortId(value) {
  const text = String(value || "");
  return text.length > 18 ? `${text.slice(0, 10)}...${text.slice(-4)}` : text;
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
  flexWrap: "wrap",
  marginBottom: 20,
};

const pageTitle = {
  margin: 0,
  color: "#0F172A",
  fontSize: 32,
};

const subtitleStyle = {
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

const muted = {
  color: "#64748B",
  fontSize: 13,
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

const secondaryButton = {
  border: "1px solid #CBD5E1",
  background: "#FFFFFF",
  color: "#0F172A",
  borderRadius: 8,
  padding: "9px 12px",
  fontWeight: 700,
  cursor: "pointer",
};

const textButton = {
  border: "none",
  background: "transparent",
  color: "#2563EB",
  fontWeight: 800,
  cursor: "pointer",
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
