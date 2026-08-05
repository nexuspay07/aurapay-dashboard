import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueChart({
  data = [],
}) {
  return (
    <ResponsiveContainer
      width="100%"
      height={320}
    >
      <AreaChart data={data}>

        <defs>

          <linearGradient
            id="colorRevenue"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >

            <stop
              offset="5%"
              stopColor="#2563EB"
              stopOpacity={0.35}
            />

            <stop
              offset="95%"
              stopColor="#2563EB"
              stopOpacity={0}
            />

          </linearGradient>

        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
        />

        <XAxis dataKey="day" />

        <YAxis />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#2563EB"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />

      </AreaChart>
    </ResponsiveContainer>
  );
}