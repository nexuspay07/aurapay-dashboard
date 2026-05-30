export default function MerchantDashboard() {
  return (
    <div
      style={{
        padding: 32,
      }}
    >
      <h1
        style={{
          fontSize: 38,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        Merchant Revenue Center
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <RevenueCard
          title="Today's Revenue"
          value="$0"
        />

        <RevenueCard
          title="Monthly Revenue"
          value="$0"
        />

        <RevenueCard
          title="Transactions"
          value="0"
        />

        <RevenueCard
          title="Success Rate"
          value="0%"
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 24,
          border:
            "1px solid #e5e7eb",
        }}
      >
        <h2>
          Recent Transactions
        </h2>

        <p>
          Merchant transaction feed
          will appear here.
        </p>
      </div>
    </div>
  );
}

function RevenueCard({
  title,
  value,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        border:
          "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          color: "#6b7280",
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}