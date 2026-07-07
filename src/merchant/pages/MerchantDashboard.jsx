import { Link }
from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import API from
  "../../services/api";

  import AppShell
from "../../layouts/AppShell";

import {
  merchantMenu,
} from "../../data/sidebarMenu";

import StatCard
from "../../components/ui/StatCard";

import Card
from "../../components/ui/Card";

export default function MerchantDashboard() {

  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res =
        await API.get(
          "/merchant-analytics/dashboard"
        );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
  <AppShell
    menu={merchantMenu}
    title="Dashboard"
  >
    <div style={page}>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 36,
    gap: 20,
    flexWrap: "wrap",
  }}
>
  <div>
    <h1
      style={{
        margin: 0,
        fontSize: 36,
        fontWeight: 800,
      }}
    >
      Dashboard
    </h1>

    <p
      style={{
        marginTop: 8,
        color: "#64748B",
      }}
    >
      Welcome back, Blaise 👋
    </p>
  </div>

  <div
    style={{
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
    }}
  >
    <Link
      to="/merchant/create-checkout"
      style={actionButton}
    >
      + Create Checkout
    </Link>

    <Link
      to="/merchant/checkouts"
      style={secondaryButton}
    >
      Checkouts
    </Link>

    <Link
      to="/merchant/transactions"
      style={secondaryButton}
    >
      Transactions
    </Link>

    <Link
      to="/merchant/settlements"
      style={secondaryButton}
    >
      Settlements
    </Link>
  </div>
</div>

      

      {/* METRICS */}

      <div style={metricsGrid}>

<StatCard
  icon="💰"
  title="Revenue Today"
  value={
    stats
      ? `$${stats.revenueToday}`
      : "..."
  }
  subtitle="Today's earnings"
  trend="+12.4%"
/>

<StatCard
  icon="📈"
  title="Monthly Revenue"
  value={
    stats
      ? `$${stats.monthlyRevenue}`
      : "..."
  }
  subtitle="This Month"
  trend="+8.1%"
/>

<StatCard
  icon="✅"
  title="Successful Payments"
  value="428"
  subtitle="Completed"
  trend="+12%"
/>

<StatCard
  icon="❌"
  title="Failed Payments"
  value="4"
  subtitle="Requires attention"
  trend="Low Risk"
  trendColor="warning"
/>

<StatCard
  icon="⚡"
  title="Transactions"
  value={
    stats
      ? stats.transactions
      : "..."
  }
  subtitle="Processed"
  trend="+18%"
/>

<StatCard
  icon="🏦"
  title="Pending Settlements"
  value="$3,200"
  subtitle="Awaiting payout"
  trend="2 Pending"
  trendColor="warning"
/>

<StatCard
  icon="💵"
  title="Completed Settlements"
  value="$14,500"
  subtitle="Paid Out"
  trend="Healthy"
/>

<StatCard
  icon="🛡"
  title="Success Rate"
  value={
    stats
      ? `${stats.successRate}%`
      : "..."
  }
  subtitle="Platform Performance"
  trend="Healthy"
/>

</div>

      {/* REVENUE CHART */}

      <Card
  title="Revenue Overview"
  subtitle="Daily revenue performance"
  style={{
    marginBottom: 24,
  }}
>
  <div style={chartPlaceholder}>
    Revenue analytics chart
    will appear here.
  </div>
</Card>

      {/* TWO COLUMN */}

      <div style={twoColumn}>

<Card
  title="Recent Checkouts"
>

  <CheckoutRow
    id="CHK_1780366892009"
    amount="$10"
    status="Created"
  />

  <CheckoutRow
    id="CHK_1780366892010"
    amount="$120"
    status="Paid"
  />

  <CheckoutRow
    id="CHK_1780366892011"
    amount="$50"
    status="Pending"
  />

</Card>

<Card
  title="Settlement Activity"
>

  <SettlementRow
    amount="$2,450"
    status="Completed"
  />

  <SettlementRow
    amount="$1,120"
    status="Pending"
  />

  <SettlementRow
    amount="$870"
    status="Completed"
  />

</Card>

</div>

      {/* TRANSACTIONS */}

      <div style={transactionsCard}>
        <h2 style={sectionTitle}>
          Recent Transactions
        </h2>

        <TransactionRow
          customer="John Smith"
          amount="$120"
          status="Paid"
        />

        <TransactionRow
          customer="Emma Brown"
          amount="$85"
          status="Paid"
        />

        <TransactionRow
          customer="David Wilson"
          amount="$250"
          status="Pending"
        />
      </div>
        </div>
  </AppShell>
);
}

/* ===================================== */

function MetricCard({
  title,
  value,
  change,
}) {
  return (
    <div style={metricCard}>
      <div style={metricLabel}>
        {title}
      </div>

      <div style={metricValue}>
        {value}
      </div>

      <div style={metricChange}>
        {change}
      </div>
    </div>
  );
}

function CheckoutRow({
  id,
  amount,
  status,
}) {
  return (
    <div style={row}>
      <div>
        <strong>{id}</strong>
      </div>

      <div>
        {amount} • {status}
      </div>
    </div>
  );
}

function SettlementRow({
  amount,
  status,
}) {
  return (
    <div style={row}>
      <div>{amount}</div>

      <div>{status}</div>
    </div>
  );
}

function TransactionRow({
  customer,
  amount,
  status,
}) {
  return (
    <div style={row}>
      <div>{customer}</div>

      <div>
        {amount} • {status}
      </div>
    </div>
  );
}

/* ===================================== */

const page = {
  background: "#F8FAFC",
  minHeight: "100vh",
  padding: 32,
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32,
};

const eyebrow = {
  color: "#2563EB",
  fontWeight: 700,
  marginBottom: 8,
};

const title = {
  fontSize: 42,
  margin: 0,
};

const subtitle = {
  color: "#64748B",
};

const actionButton = {
  border: "none",
  background: "#0F172A",
  color: "#fff",
  padding: "14px 22px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const secondaryButton = {
  textDecoration: "none",
  background: "#FFFFFF",
  color: "#0F172A",
  padding: "14px 22px",
  borderRadius: 14,
  border: "1px solid #CBD5E1",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const metricsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const metricCard = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #E2E8F0",
  boxShadow:
    "0 10px 30px rgba(15,23,42,0.05)",
};

const metricLabel = {
  color: "#64748B",
  marginBottom: 12,
};

const metricValue = {
  fontSize: 34,
  fontWeight: 800,
};

const metricChange = {
  color: "#10B981",
  marginTop: 10,
};

const chartCard = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #E2E8F0",
  marginBottom: 24,
};

const chartPlaceholder = {
  height: 260,
  borderRadius: 14,
  background: "#F1F5F9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const twoColumn = {
  display: "grid",
  gridTemplateColumns:
    "1fr 1fr",
  gap: 24,
  marginBottom: 24,
};

const panel = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #E2E8F0",
};

const transactionsCard = {
  background: "#fff",
  borderRadius: 20,
  padding: 24,
  border: "1px solid #E2E8F0",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: 20,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 0",
  borderBottom:
    "1px solid #E2E8F0",
};