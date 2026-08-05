import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AppShell from "../../layouts/AppShell";
import { merchantMenu } from "../../data/sidebarMenu";
import API from "../../services/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const numberFormatter = new Intl.NumberFormat("en-US");

export default function MerchantDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/merchant-analytics/dashboard");
      setAnalytics(res.data || {});
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }

  const derived = useMemo(() => {
    const transactions = analytics?.recentTransactions || [];
    const settlements = analytics?.recentSettlements || [];
    const checkouts = analytics?.recentCheckouts || [];
    const refunds = transactions.filter(
      (tx) => tx.status === "refunded"
    );
    const payments = transactions.filter(
      (tx) => tx.success || tx.status === "completed"
    );
    const totalRevenue = Number(analytics?.totalRevenue || 0);
    const totalTransactions = Number(
      analytics?.totalTransactions || transactions.length || 0
    );

    return {
      transactions,
      settlements,
      checkouts,
      refunds: refunds.length,
      payments: analytics?.successfulPayments ?? payments.length,
      averagePayment:
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      totalSettled: settlements
        .filter((item) => item.status === "completed")
        .reduce(
          (sum, item) => sum + Number(item.netAmount || item.amount || 0),
          0
        ),
      settlementTrend: settlements.map((item) => ({
        name: formatShortDate(item.createdAt),
        pending: item.status === "pending" ? Number(item.amount || 0) : 0,
        completed:
          item.status === "completed" ? Number(item.amount || 0) : 0,
      })),
      transactionTrend: transactions
        .slice()
        .reverse()
        .map((item) => ({
          name: formatShortDate(item.createdAt),
          count: 1,
          amount: Number(item.amount || 0),
        })),
    };
  }, [analytics]);

  const cards = [
    {
      label: "Today's Revenue",
      value: money(analytics?.revenueToday),
      caption: "Settled and successful activity",
    },
    {
      label: "Monthly Revenue",
      value: money(analytics?.monthlyRevenue),
      caption: "Current month gross volume",
    },
    {
      label: "Total Revenue",
      value: money(analytics?.totalRevenue),
      caption: "All-time successful volume",
    },
    {
      label: "Transactions",
      value: numberFormatter.format(analytics?.totalTransactions || 0),
      caption: "All recorded payments",
    },
    {
      label: "Payments",
      value: numberFormatter.format(derived.payments || 0),
      caption: "Successful payments",
    },
    {
      label: "Refunds",
      value: numberFormatter.format(derived.refunds || 0),
      caption: "Refunded recent payments",
    },
    {
      label: "Pending Settlements",
      value: numberFormatter.format(analytics?.pendingSettlements || 0),
      caption: "Awaiting payout",
    },
    {
      label: "Completed Settlements",
      value: numberFormatter.format(analytics?.completedSettlements || 0),
      caption: money(derived.totalSettled),
    },
    {
      label: "Success Rate",
      value: `${analytics?.successRate || 0}%`,
      caption: "Payment authorization health",
    },
    {
      label: "Failed Payments",
      value: numberFormatter.format(analytics?.failedPayments || 0),
      caption: "Requires review",
    },
    {
      label: "Average Payment",
      value: money(derived.averagePayment),
      caption: "Gross average ticket",
    },
  ];

  return (
    <AppShell menu={merchantMenu} title="Dashboard">
      <section style={hero}>
        <div>
          <p style={eyebrow}>Sandbox Beta</p>
          <h1 style={title}>Merchant Dashboard</h1>
          <p style={subtitle}>
            Monitor revenue, payments, checkouts, and settlements from live
            AuraPay backend data.
          </p>
        </div>

        <div style={actions}>
          <Link to="/merchant/create-checkout" style={primaryButton}>
            Create checkout
          </Link>
          <Link to="/merchant/transactions" style={secondaryButton}>
            View transactions
          </Link>
        </div>
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      <section style={cardGrid}>
        {loading
          ? Array.from({ length: 11 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : cards.map((card) => (
              <MetricCard key={card.label} {...card} />
            ))}
      </section>

      <section style={chartGrid}>
        <ChartPanel title="Revenue History" empty={!analytics?.revenueHistory?.length}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics?.revenueHistory || []}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip formatter={(value) => money(value)} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                fill="#DBEAFE"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Transactions" empty={!derived.transactionTrend.length}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={derived.transactionTrend}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="amount" fill="#0F172A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel title="Settlement Trend" empty={!derived.settlementTrend.length}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={derived.settlementTrend}>
              <CartesianGrid stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip formatter={(value) => money(value)} />
              <Bar dataKey="pending" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="#16A34A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>

      <section style={activityGrid}>
        <ActivityList
          title="Recent Transactions"
          items={derived.transactions}
          renderItem={(item) => (
            <>
              <span>{item.customerEmail || item.providerPaymentId || item._id}</span>
              <strong>{money(item.amount)}</strong>
              <Badge value={item.status} />
            </>
          )}
        />

        <ActivityList
          title="Recent Checkouts"
          items={derived.checkouts}
          renderItem={(item) => (
            <>
              <span>{item.customerEmail || item.sessionId}</span>
              <strong>{money(item.amount)}</strong>
              <Badge value={item.status} />
            </>
          )}
        />
      </section>
    </AppShell>
  );
}

function MetricCard({ label, value, caption }) {
  return (
    <article style={metricCard}>
      <span style={metricLabel}>{label}</span>
      <strong style={metricValue}>{value}</strong>
      <span style={metricCaption}>{caption}</span>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div style={metricCard}>
      <div style={skeletonLine} />
      <div style={{ ...skeletonLine, width: "70%", height: 30 }} />
      <div style={{ ...skeletonLine, width: "55%" }} />
    </div>
  );
}

function ChartPanel({ title, empty, children }) {
  return (
    <article style={panel}>
      <h2 style={panelTitle}>{title}</h2>
      {empty ? <EmptyState message="No live data available yet." /> : children}
    </article>
  );
}

function ActivityList({ title, items, renderItem }) {
  return (
    <article style={panel}>
      <h2 style={panelTitle}>{title}</h2>
      {items.length === 0 ? (
        <EmptyState message="No records found." />
      ) : (
        <div style={list}>
          {items.slice(0, 6).map((item) => (
            <div key={item._id || item.sessionId} style={listRow}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </article>
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

function money(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatShortDate(value) {
  if (!value) return "New";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const hero = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: 24,
};

const eyebrow = {
  margin: "0 0 8px",
  color: "#2563EB",
  fontSize: 13,
  fontWeight: 800,
  textTransform: "uppercase",
};

const title = {
  margin: 0,
  color: "#0F172A",
  fontSize: 34,
  lineHeight: 1.15,
};

const subtitle = {
  color: "#64748B",
  maxWidth: 720,
  margin: "10px 0 0",
};

const actions = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const primaryButton = {
  background: "#0F172A",
  color: "#FFFFFF",
  borderRadius: 8,
  padding: "11px 16px",
  textDecoration: "none",
  fontWeight: 800,
};

const secondaryButton = {
  background: "#FFFFFF",
  color: "#0F172A",
  border: "1px solid #CBD5E1",
  borderRadius: 8,
  padding: "11px 16px",
  textDecoration: "none",
  fontWeight: 800,
};

const errorBanner = {
  background: "#FEF2F2",
  color: "#B91C1C",
  border: "1px solid #FECACA",
  borderRadius: 8,
  padding: 14,
  marginBottom: 18,
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const metricCard = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 18,
  minHeight: 118,
  boxSizing: "border-box",
};

const metricLabel = {
  color: "#64748B",
  fontSize: 13,
  fontWeight: 700,
};

const metricValue = {
  display: "block",
  marginTop: 12,
  color: "#0F172A",
  fontSize: 27,
  lineHeight: 1.1,
};

const metricCaption = {
  display: "block",
  marginTop: 10,
  color: "#64748B",
  fontSize: 13,
};

const skeletonLine = {
  width: "85%",
  height: 14,
  borderRadius: 8,
  background: "#E2E8F0",
  marginBottom: 14,
};

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 16,
  marginBottom: 20,
};

const panel = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 8,
  padding: 20,
  minWidth: 0,
};

const panelTitle = {
  margin: "0 0 16px",
  fontSize: 18,
  color: "#0F172A",
};

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 16,
};

const list = {
  display: "grid",
  gap: 10,
};

const listRow = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto auto",
  gap: 12,
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #F1F5F9",
  color: "#334155",
};

const emptyState = {
  minHeight: 170,
  display: "grid",
  placeItems: "center",
  color: "#64748B",
  background: "#F8FAFC",
  border: "1px dashed #CBD5E1",
  borderRadius: 8,
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
