import { useTodayOrdersStats, useOrders } from "@/hooks/useOrders";
import { IndianRupee, TrendingUp, Wallet, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(0)}`;
};

export function FinancialDashboard() {
  const { data: todayStats } = useTodayOrdersStats();
  const { data: orders } = useOrders();

  const weeklyStats = useMemo(() => {
    if (!orders) return { revenue: 0, platformFees: 0, driverPayouts: 0, vendorPayouts: 0 };

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekOrders = orders.filter(
      (o) => new Date(o.created_at) >= weekAgo && o.status === "delivered"
    );

    return {
      revenue: weekOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
      platformFees: weekOrders.reduce((sum, o) => sum + (o.platform_fee || 0), 0),
      driverPayouts: weekOrders.reduce((sum, o) => sum + (o.driver_earnings || 0), 0),
      vendorPayouts: weekOrders.reduce((sum, o) => sum + (o.vendor_payout || 0), 0),
    };
  }, [orders]);

  const stats = [
    {
      title: "Total Revenue",
      today: todayStats?.revenue || 0,
      weekly: weeklyStats.revenue,
      icon: IndianRupee,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Platform Fees",
      today: todayStats?.platformFees || 0,
      weekly: weeklyStats.platformFees,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Driver Payouts",
      today: todayStats?.driverPayouts || 0,
      weekly: weeklyStats.driverPayouts,
      icon: Wallet,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Vendor Payouts",
      today: 0,
      weekly: weeklyStats.vendorPayouts,
      icon: CreditCard,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {formatCurrency(stat.weekly)}
                </p>
                <p className="text-xs text-muted-foreground">
                  This week • Today: {formatCurrency(stat.today)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
