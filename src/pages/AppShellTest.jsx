import AppShell from "../layouts/AppShell";
import { merchantMenu } from "../data/sidebarMenu";

import StatCard from "../components/ui/StatCard";

export default function AppShellTest() {
  return (
    <AppShell
      menu={merchantMenu}
      title="Dashboard"
    >
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",

          gap: 24,

          marginBottom: 30,
        }}
      >
        <StatCard
          icon="💳"
          title="Wallet"
          value="$18,420"
          subtitle="Available"
          trend="+12%"
        />

        <StatCard
          icon="📈"
          title="Revenue"
          value="$42,890"
          subtitle="Today"
          trend="+18%"
        />

        <StatCard
          icon="⚡"
          title="Transactions"
          value="2,384"
          subtitle="Processed"
          trend="+294"
        />

        <StatCard
          icon="🏦"
          title="Settlements"
          value="96"
          subtitle="Completed"
          trend="100%"
        />
      </div>

      <div
        style={{
          height: 500,

          background: "#FFFFFF",

          borderRadius: 20,

          border:
            "1px solid #E2E8F0",

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          fontSize: 30,

          fontWeight: 700,

          color: "#64748B",
        }}
      >
        Dashboard Content Area
      </div>
    </AppShell>
  );
}