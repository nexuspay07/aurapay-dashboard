import { useEffect, useMemo, useState } from "react";

import AppShell from "../layouts/AppShell";
import { merchantMenu } from "../data/sidebarMenu";
import API from "../services/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function MerchantSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettlements();
  }, []);

  async function loadSettlements() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant-analytics/settlements");
      setSettlements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load merchant settlements."
      );
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(() => {
    const pending = settlements.filter((item) => item.status === "pending");
    const completed = settlements.filter((item) => item.status === "completed");
    const totalSettled = completed.reduce(
      (sum, item) => sum + Number(item.netAmount || item.amount || 0),
      0
    );
    const nextPayout = pending
      .slice()
      .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))[0];

    return {
      pending: pending.length,
      completed: completed.length,
      totalSettled,
      nextPayout: nextPayout ? money(nextPayout.netAmount || nextPayout.amount) : "Not scheduled",
    };
  }, [settlements]);

  return (
    <AppShell menu={merchantMenu} title="Settlements">
      <section style={header}>
        <div>
          <h1 style={title}>Settlements</h1>
          <p style={subtitle}>
            Track pending payouts, completed settlements, and net funds due.
          </p>
        </div>
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      <section style={cardGrid}>
        <MetricCard label="Pending" value={summary.pending} />
        <MetricCard label="Completed" value={summary.completed} />
        <MetricCard label="Total Settled" value={money(summary.totalSettled)} />
        <MetricCard label="Next Payout" value={summary.nextPayout} />
      </section>

      <section style={tableCard}>
        {loading ? (
          <TableSkeleton />
        ) : settlements.length === 0 ? (
          <EmptyState message="No settlements have been generated yet." />
        ) : (
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <Th>Settlement ID</Th>
                  <Th>Amount</Th>
                  <Th>Fees</Th>
                  <Th>Net</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Transactions Included</Th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement) => {
                  const amount = Number(settlement.amount || 0);
                  const net = Number(settlement.netAmount || amount);
                  const fees = Math.max(0, amount - net);

                  return (
                    <tr key={settlement._id}>
                      <Td mono>{shortId(settlement._id)}</Td>
                      <Td>{money(amount)}</Td>
                      <Td>{money(fees)}</Td>
                      <Td>{money(net)}</Td>
                      <Td><Badge value={settlement.status} /></Td>
                      <Td>{formatDate(settlement.settlementDate || settlement.createdAt)}</Td>
                      <Td>{settlement.transactionCount || 1}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

function MetricCard({ label, value }) {
  return (
    <article style={metricCard}>
      <span style={metricLabel}>{label}</span>
      <strong style={metricValue}>{value}</strong>
    </article>
  );
}

function TableSkeleton() {
  return (
    <div style={skeletonStack}>
      {Array.from({ length: 7 }).map((_, index) => (
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
    normalized === "completed"
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
  return text.length > 16 ? `${text.slice(0, 8)}...${text.slice(-4)}` : text;
}

function formatDate(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString();
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
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
  marginBottom: 18,
};

const metricCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 18,
};

const metricLabel = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 800,
};

const metricValue = {
  display: "block",
  marginTop: 10,
  color: "#0F172A",
  fontSize: 27,
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
  minWidth: 900,
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
};

const monoText = {
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};

const emptyState = {
  minHeight: 260,
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
