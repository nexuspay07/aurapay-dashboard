export default function MerchantDashboard() {
  return (
    <div style={page}>
      {/* HEADER */}

      <div style={header}>
        <div>
          <div style={eyebrow}>
            AURAPAY MERCHANT
          </div>

          <h1 style={title}>
            Merchant Revenue Center
          </h1>

          <p style={subtitle}>
            Monitor revenue, transactions,
            checkouts and settlements from
            one platform.
          </p>
        </div>

        <button style={actionButton}>
          + Create Checkout
        </button>
      </div>

      {/* METRICS */}

      <div style={metricsGrid}>
        <MetricCard
          title="Revenue Today"
          value="$12,480"
          change="+12.4%"
        />

        <MetricCard
          title="Monthly Revenue"
          value="$104,900"
          change="+8.1%"
        />

        <MetricCard
          title="Transactions"
          value="432"
          change="+18%"
        />

        <MetricCard
          title="Success Rate"
          value="99.2%"
          change="Healthy"
        />
      </div>

      {/* REVENUE CHART */}

      <div style={chartCard}>
        <h2 style={sectionTitle}>
          Revenue Overview
        </h2>

        <div style={chartPlaceholder}>
          Revenue analytics chart will
          appear here.
        </div>
      </div>

      {/* TWO COLUMN */}

      <div style={twoColumn}>
        <div style={panel}>
          <h2 style={sectionTitle}>
            Recent Checkouts
          </h2>

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
        </div>

        <div style={panel}>
          <h2 style={sectionTitle}>
            Settlement Activity
          </h2>

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
        </div>
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