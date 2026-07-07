import StatCard from "../components/ui/StatCard";

export default function StatCardTest() {
  return (
    <div
      style={{
        padding: 40,

        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",

        gap: 24,
      }}
    >
      <StatCard
        icon="💳"
        title="Wallet Balance"
        value="$18,420"
        subtitle="Available Balance"
        trend="+12.5%"
      />

      <StatCard
        icon="📈"
        title="Revenue"
        value="$42,890"
        subtitle="Today's Revenue"
        trend="+18%"
      />

      <StatCard
        icon="⚡"
        title="Transactions"
        value="2,384"
        subtitle="Processed Today"
        trend="+294"
      />

      <StatCard
        icon="🏦"
        title="Settlements"
        value="96"
        subtitle="Completed"
        trend="100%"
      />

      <StatCard
        icon="👥"
        title="Customers"
        value="18,239"
        subtitle="Active Users"
        trend="+320"
      />

      <StatCard
        icon="🛡"
        title="Fraud Score"
        value="0.02%"
        subtitle="Platform Risk"
        trend="Excellent"
      />
    </div>
  );
}