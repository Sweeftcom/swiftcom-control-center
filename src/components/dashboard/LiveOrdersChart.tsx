import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "6am", orders: 45 },
  { time: "7am", orders: 89 },
  { time: "8am", orders: 156 },
  { time: "9am", orders: 210 },
  { time: "10am", orders: 178 },
  { time: "11am", orders: 203 },
  { time: "12pm", orders: 387 },
  { time: "1pm", orders: 342 },
  { time: "2pm", orders: 256 },
  { time: "3pm", orders: 198 },
  { time: "4pm", orders: 167 },
  { time: "5pm", orders: 234 },
  { time: "6pm", orders: 298 },
  { time: "7pm", orders: 387 },
  { time: "8pm", orders: 356 },
  { time: "9pm", orders: 278 },
];

export function LiveOrdersChart() {
  return (
    <div className="stat-card h-80">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Orders Today</h3>
          <p className="text-sm text-muted-foreground">Peak: 387 orders at 7-9pm</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs text-muted-foreground">Live updates</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(173 80% 40%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(173 80% 40%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
          <XAxis 
            dataKey="time" 
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222 47% 10%)",
              border: "1px solid hsl(217 33% 17%)",
              borderRadius: "8px",
              color: "hsl(210 40% 98%)",
            }}
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="hsl(173 80% 40%)"
            strokeWidth={2}
            fill="url(#colorOrders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
