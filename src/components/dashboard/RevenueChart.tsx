import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", revenue: 580000, orders: 1890 },
  { day: "Tue", revenue: 620000, orders: 2010 },
  { day: "Wed", revenue: 710000, orders: 2340 },
  { day: "Thu", revenue: 690000, orders: 2180 },
  { day: "Fri", revenue: 820000, orders: 2670 },
  { day: "Sat", revenue: 950000, orders: 3120 },
  { day: "Sun", revenue: 870000, orders: 2847 },
];

const formatRevenue = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  return `₹${(value / 1000).toFixed(0)}K`;
};

export function RevenueChart() {
  return (
    <div className="stat-card h-80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Weekly Revenue</h3>
          <p className="text-sm text-muted-foreground">Total: ₹52.4L this week</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="hsl(215 20% 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(215 20% 55%)" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatRevenue}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222 47% 10%)",
              border: "1px solid hsl(217 33% 17%)",
              borderRadius: "8px",
              color: "hsl(210 40% 98%)",
            }}
            formatter={(value: number, name: string) => [
              name === "revenue" ? formatRevenue(value) : value,
              name === "revenue" ? "Revenue" : "Orders"
            ]}
          />
          <Bar 
            dataKey="revenue" 
            fill="hsl(173 80% 40%)" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
