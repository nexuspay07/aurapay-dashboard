import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import StatCard from "../../components/ui/StatCard";
import { merchantMenu } from "../../data/sidebarMenu";
import AppShell from "../../layouts/AppShell";
import API from "../../services/api";
import "./merchantDashboard.css";

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
      setError(err?.response?.data?.error || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const derived = useMemo(() => {
    const transactions = array(analytics?.recentTransactions);
    const settlements = array(analytics?.recentSettlements);
    const checkouts = array(analytics?.recentCheckouts);
    const activityByDay = new Map();

    transactions.slice().reverse().forEach((item) => {
      const day = formatShortDate(item.createdAt);
      const current = activityByDay.get(day) || { day, transactions: 0, successful: 0 };
      current.transactions += 1;
      if (item.success === true) {
        current.successful += 1;
      }
      activityByDay.set(day, current);
    });

    return {
      transactions,
      settlements,
      checkouts,
      transactionActivity: [...activityByDay.values()],
    };
  }, [analytics]);

  const metrics = [
    {
      title: "Successful payments",
      value: numberFormatter.format(Number(analytics?.successfulPayments || 0)),
      subtitle: "Successful sandbox transactions",
      icon: <MetricIcon name="volume" />,
    },
    {
      title: "Transactions",
      value: numberFormatter.format(Number(analytics?.totalTransactions || 0)),
      subtitle: `${numberFormatter.format(Number(analytics?.successfulPayments || 0))} successful · ${numberFormatter.format(Number(analytics?.failedPayments || 0))} failed`,
      icon: <MetricIcon name="transactions" />,
    },
    {
      title: "Success rate",
      value: `${Number(analytics?.successRate || 0).toFixed(1)}%`,
      subtitle: "Successful sandbox transactions",
      icon: <MetricIcon name="rate" />,
    },
    {
      title: "Checkout sessions",
      value: numberFormatter.format(Number(analytics?.totalCheckouts || 0)),
      subtitle: `${numberFormatter.format(Number(analytics?.paidCheckouts || 0))} paid · ${numberFormatter.format(Number(analytics?.pendingCheckouts || 0))} pending`,
      icon: <MetricIcon name="checkout" />,
    },
  ];

  const activitySummary = derived.transactionActivity.length
    ? derived.transactionActivity
      .map(({ day, transactions, successful }) => `${day}: ${transactions} transactions, ${successful} successful`)
      .join("; ")
    : "No recent sandbox transaction activity was returned.";

  return (
    <AppShell menu={merchantMenu} title="Overview">
      <div className="merchant-dashboard" aria-busy={loading}>
        <p className="merchant-sr-only" role="status" aria-live="polite">
          {loading ? "Loading merchant dashboard data." : error ? "Merchant dashboard data could not be loaded." : "Merchant dashboard data loaded."}
        </p>
        <section className="merchant-dashboard-hero" aria-labelledby="merchant-dashboard-title">
          <div>
            <p className="merchant-dashboard-eyebrow">Sandbox payment operations</p>
            <h1 id="merchant-dashboard-title">Your payment workspace</h1>
            <p>
              Monitor authorized sandbox activity, checkout sessions, and settlement
              status. No real funds are processed.
            </p>
          </div>
          <div className="merchant-dashboard-actions" aria-label="Quick dashboard actions">
            <Link className="merchant-button merchant-button--primary" to="/merchant/create-checkout">
              Create checkout
            </Link>
            <Link className="merchant-button merchant-button--secondary" to="/merchant/transactions">
              View transactions
            </Link>
          </div>
        </section>

        {error && (
          <div className="merchant-dashboard-error" role="alert">
            <div><strong>Dashboard unavailable</strong><span>{error}</span></div>
            <button type="button" onClick={loadDashboard}>Try again</button>
          </div>
        )}

        {!error && <section className="merchant-kpi-grid" aria-label="Payment overview">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <MetricSkeleton key={index} />)
            : metrics.map((metric) => <StatCard key={metric.title} {...metric} />)}
        </section>}

        {!error && <section className="merchant-dashboard-primary-grid">
          <DashboardPanel
            title="Transaction activity"
            subtitle="Recent merchant-scoped records"
            action={<Link to="/merchant/transactions">View all</Link>}
          >
            {loading ? (
              <ChartSkeleton />
            ) : derived.transactionActivity.length ? (
              <div className="merchant-chart" role="img" aria-label={`Recent transaction activity. ${activitySummary}`}>
                <div aria-hidden="true">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={derived.transactionActivity} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
                      <CartesianGrid stroke="#E4EAF3" vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#64748B" fontSize={12} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} stroke="#64748B" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="transactions" name="Transactions" fill="#7254E8" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="successful" name="Successful" fill="#10A68B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="merchant-sr-only">{activitySummary}</p>
              </div>
            ) : (
              <EmptyState title="No transaction activity" detail={activitySummary} />
            )}
          </DashboardPanel>
        </section>}

        {!error && <section className="merchant-dashboard-secondary-grid">
          <DashboardPanel
            className="merchant-dashboard-transactions"
            title="Recent transactions"
            subtitle="Newest authorized sandbox activity"
            action={<Link to="/merchant/transactions">View all transactions</Link>}
          >
            {loading ? (
              <ListSkeleton />
            ) : derived.transactions.length ? (
              <div className="merchant-transaction-table-wrap">
                <table className="merchant-transaction-table">
                  <caption className="merchant-sr-only">Recent sandbox transactions</caption>
                  <thead>
                    <tr><th>Transaction</th><th>Status</th><th>Amount</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {derived.transactions.slice(0, 6).map((item) => {
                      const inspectorId = typeof item._id === "string" ? item._id.trim() : "";
                      const transactionName = item.customerEmail || item.paymentId || item.providerPaymentId || "Transaction";
                      const transactionIdentity = (
                        <>
                          <strong>{transactionName}</strong>
                          <span>{item.provider || "Sandbox payment"}</span>
                        </>
                      );

                      return (
                        <tr key={item._id || item.paymentId || item.providerPaymentId}>
                          <td>
                            {inspectorId ? (
                              <Link
                                className="merchant-transaction-link"
                                to={`/merchant/transactions/${encodeURIComponent(inspectorId)}`}
                                aria-label={`Inspect payment ${item.providerPaymentId || item.transactionId || inspectorId}`}
                              >
                                {transactionIdentity}
                              </Link>
                            ) : transactionIdentity}
                          </td>
                          <td><StatusBadge value={item.status} /></td>
                          <td>{item.currency ? money(item.amount, item.currency) : "Currency unavailable"}</td>
                          <td>{formatDate(item.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No transactions yet" detail="Create a sandbox checkout to begin testing." />
            )}
          </DashboardPanel>

          <div className="merchant-dashboard-side-stack">
            <DashboardPanel
              title="Settlement snapshot"
              subtitle="Current sandbox settlement counts"
              action={<Link to="/merchant/settlements">View settlements</Link>}
            >
              {loading ? <ListSkeleton compact /> : (
                <div className="merchant-settlement-summary">
                  <SummaryRow label="Pending" value={analytics?.pendingSettlements} tone="warning" />
                  <SummaryRow label="Completed" value={analytics?.completedSettlements} tone="success" />
                  <SummaryRow label="Recent records" value={derived.settlements.length} />
                </div>
              )}
            </DashboardPanel>

            <DashboardPanel title="Quick actions" subtitle="Continue common merchant tasks">
              <div className="merchant-quick-actions">
                <QuickAction to="/merchant/create-checkout" icon="plus" label="Create checkout" />
                <QuickAction to="/merchant/checkouts" icon="checkout" label="Manage checkouts" />
                <QuickAction to="/merchant/developer/api-keys" icon="key" label="API keys" />
                <QuickAction to="/merchant/developer/documentation" icon="docs" label="Documentation" />
              </div>
            </DashboardPanel>
          </div>
        </section>}
      </div>
    </AppShell>
  );
}
function DashboardPanel({ title, subtitle, action, className = "", children }) {
  return (
    <article className={`merchant-dashboard-panel ${className}`.trim()}>
      <header>
        <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
        {action && <div className="merchant-dashboard-panel-action">{action}</div>}
      </header>
      {children}
    </article>
  );
}

function MetricSkeleton() {
  return <div className="merchant-metric-skeleton" aria-hidden="true"><span /><strong /><span /></div>;
}

function ChartSkeleton() {
  return <div className="merchant-chart-skeleton" aria-hidden="true"><span /><span /><span /><span /><span /></div>;
}

function ListSkeleton({ compact = false }) {
  return <div className={`merchant-list-skeleton${compact ? " is-compact" : ""}`} aria-hidden="true">
    {Array.from({ length: compact ? 3 : 5 }).map((_, index) => <span key={index} />)}
  </div>;
}

function EmptyState({ title, detail }) {
  return <div className="merchant-empty-state"><MetricIcon name="empty" /><strong>{title}</strong><span>{detail}</span></div>;
}

function StatusBadge({ value }) {
  const status = String(value || "unknown").toLowerCase();
  const tone = ["completed", "paid", "succeeded", "success"].includes(status)
    ? "success"
    : ["failed", "declined", "refunded"].includes(status)
      ? "danger"
      : "warning";
  return <span className={`merchant-status merchant-status--${tone}`}>{status}</span>;
}

function SummaryRow({ label, value, tone = "neutral" }) {
  return <div><span><i className={`merchant-summary-dot merchant-summary-dot--${tone}`} />{label}</span><strong>{numberFormatter.format(Number(value || 0))}</strong></div>;
}

function QuickAction({ to, icon, label }) {
  return <Link to={to}><MetricIcon name={icon} /><span>{label}</span><b aria-hidden="true">→</b></Link>;
}

function MetricIcon({ name }) {
  const paths = {
    volume: "M4 7h16v10H4V7Zm3 3h4m6 0h.01M7 14h10",
    transactions: "M7 7h13l-4-4m4 4-4 4M17 17H4l4 4m-4-4 4-4",
    rate: "M5 19V9m7 10V5m7 14v-7",
    checkout: "M5 6h16l-2 9H8L5 6m3 3h9M9 19h.01M18 19h.01",
    plus: "M12 5v14M5 12h14",
    key: "M15 7a4 4 0 1 0-3.5 4L4 18.5V21h2.5l1-1H10v-2.5l5-5A4 4 0 0 0 15 7Z",
    docs: "M6 3h9l3 3v15H6V3Zm8 0v4h4M9 11h6m-6 4h6",
    empty: "M5 7h14v12H5V7Zm3-3h8M8 11h8m-8 4h5",
  };
  return <svg className="merchant-metric-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={paths[name] || paths.transactions} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function array(value) {
  return Array.isArray(value) ? value : [];
}

function money(value, currency) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency).toUpperCase(),
    }).format(Number(value || 0));
  } catch {
    return `${Number(value || 0).toLocaleString("en-US")} ${String(currency || "").toUpperCase()}`.trim();
  }
}

function formatShortDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
