import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
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

const colors = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626"];

export default function MerchantAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/merchant-analytics/dashboard");
      setAnalytics(res.data || {});
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Unable to load merchant analytics."
      );
    } finally {
      setLoading(false);
    }
  }

  const derived = useMemo(() => {
    const transactions = analytics?.recentTransactions || [];

    const providerMap = transactions.reduce((map, tx) => {
      const provider = tx.provider || "AuraPay";
      map[provider] = (map[provider] || 0) + 1;
      return map;
    }, {});

    const methodMap = transactions.reduce((map, tx) => {
      const method = tx.paymentType || tx.provider || "unknown";
      map[method] = (map[method] || 0) + 1;
      return map;
    }, {});

    const customers = transactions.reduce((map, tx) => {
      const customer = tx.customerEmail || tx.customerName || "Unknown customer";
      map[customer] = {
        customer,
        volume: (map[customer]?.volume || 0) + Number(tx.amount || 0),
        count: (map[customer]?.count || 0) + 1,
      };
      return map;
    }, {});

    const totalRevenue = Number(analytics?.totalRevenue || 0);
    const totalTransactions = Number(analytics?.totalTransactions || 0);

    return {
      providerSplit: Object.entries(providerMap).map(([name, value]) => ({
        name,
        value,
      })),
      paymentMethods: Object.entries(methodMap).map(([name, value]) => ({
        name,
        value,
      })),
      paymentVolume: transactions
        .slice()
        .reverse()
        .map((tx) => ({
          day: formatShortDate(tx.createdAt),
          amount: Number(tx.amount || 0),
        })),
      topCustomers: Object.values(customers)
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 6),
      averagePayment:
        totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
    };
  }, [analytics]);

  return (
    <AppShell menu={merchantMenu} title="Analytics">
      <section style={header}>
        <div>
          <h1 style={title}>Analytics</h1>
          <p style={subtitle}>
            Revenue, volume, provider performance, and customer activity from
            live AuraPay data.
          </p>
        </div>
      </section>

      {error && <div style={errorBanner}>{error}</div>}

      {loading ? (
        <div style={skeletonGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} style={skeletonPanel} />
          ))}
        </div>
      ) : (
        <>
          <section style={metricGrid}>
            <Metric label="Revenue" value={money(analytics?.totalRevenue)} />
            <Metric label="Payment Volume" value={analytics?.totalTransactions || 0} />
            <Metric label="Success Rate" value={`${analytics?.successRate || 0}%`} />
            <Metric label="Average Payment" value={money(derived.averagePayment)} />
          </section>

          <section style={chartGrid}>
            <ChartPanel title="Revenue over time" empty={!analytics?.revenueHistory?.length}>
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

            <ChartPanel title="Payment volume" empty={!derived.paymentVolume.length}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={derived.paymentVolume}>
                  <CartesianGrid stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip formatter={(value) => money(value)} />
                  <Bar dataKey="amount" fill="#0F172A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>

            <PiePanel title="Payment methods" data={derived.paymentMethods} />
            <PiePanel title="Provider split" data={derived.providerSplit} />
          </section>

          <section style={insightGrid}>
            <ChartPanel title="Top customers" empty={!derived.topCustomers.length}>
              <div style={list}>
                {derived.topCustomers.map((customer) => (
                  <div key={customer.customer} style={listRow}>
                    <span>{customer.customer}</span>
                    <strong>{money(customer.volume)}</strong>
                    <span style={muted}>{customer.count} payments</span>
                  </div>
                ))}
              </div>
            </ChartPanel>

            <ChartPanel title="Recent activity" empty={!analytics?.recentTransactions?.length}>
              <div style={list}>
                {(analytics?.recentTransactions || []).slice(0, 8).map((tx) => (
                  <div key={tx._id} style={listRow}>
                    <span>{tx.customerEmail || tx.providerPaymentId || tx._id}</span>
                    <strong>{money(tx.amount)}</strong>
                    <Badge value={tx.status} />
                  </div>
                ))}
              </div>
            </ChartPanel>
          </section>
        </>
      )}
    </AppShell>
  );
}

function Metric({ label, value }) {
  return (
    <article style={metricCard}>
      <span style={metricLabel}>{label}</span>
      <strong style={metricValue}>{value}</strong>
    </article>
  );
}

function ChartPanel({ title, empty, children }) {
  return (
    <article style={panel}>
      <h2 style={panelTitle}>{title}</h2>
      {empty ? <EmptyState /> : children}
    </article>
  );
}

function PiePanel({ title, data }) {
  return (
    <ChartPanel title={title} empty={!data.length}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={96} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

function EmptyState() {
  return <div style={emptyState}>No live analytics data available yet.</div>;
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

const metricGrid = {
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

const chartGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
  marginBottom: 16,
};

const insightGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
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

const list = {
  display: "grid",
  gap: 8,
};

const listRow = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto auto",
  gap: 12,
  alignItems: "center",
  padding: "11px 0",
  borderBottom: "1px solid #F1F5F9",
};

const muted = {
  color: "#64748B",
  fontSize: 13,
};

const emptyState = {
  minHeight: 220,
  display: "grid",
  placeItems: "center",
  color: "#64748B",
  background: "#F8FAFC",
  border: "1px dashed #CBD5E1",
  borderRadius: 8,
};

const skeletonGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 16,
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
