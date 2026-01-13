import { ShoppingCart, IndianRupee, Clock, Ban, CreditCard, AlertTriangle } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveOrdersChart } from "@/components/dashboard/LiveOrdersChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActiveEntitiesCard } from "@/components/dashboard/ActiveEntitiesCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { SystemHealthMonitor } from "@/components/dashboard/SystemHealthMonitor";
import { FinancialDashboard } from "@/components/dashboard/FinancialDashboard";
import { useTodayOrdersStats } from "@/hooks/useOrders";
import { useDriversStats } from "@/hooks/useDrivers";
import { useVendorsStats } from "@/hooks/useVendors";
import { Skeleton } from "@/components/ui/skeleton";

const formatCurrency = (value: number) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value}`;
};

export default function Dashboard() {
  const { data: orderStats, isLoading: ordersLoading } = useTodayOrdersStats();
  const { data: driverStats, isLoading: driversLoading } = useDriversStats();
  const { data: vendorStats, isLoading: vendorsLoading } = useVendorsStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time ecosystem overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-mono text-foreground">
            {new Date().toLocaleTimeString("en-IN")}
          </p>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ordersLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <KPICard
              title="Orders Today"
              value={orderStats?.totalOrders?.toLocaleString() || "0"}
              subtitle={`${orderStats?.pendingCount || 0} pending`}
              icon={<ShoppingCart className="h-5 w-5" />}
            />
            <KPICard
              title="Revenue Today"
              value={formatCurrency(orderStats?.revenue || 0)}
              subtitle={`${orderStats?.deliveredCount || 0} delivered`}
              icon={<IndianRupee className="h-5 w-5" />}
            />
            <KPICard
              title="Platform Fees"
              value={formatCurrency(orderStats?.platformFees || 0)}
              subtitle="Today's earnings"
              icon={<CreditCard className="h-5 w-5" />}
            />
            <KPICard
              title="Cancellation Rate"
              value={`${orderStats?.cancellationRate || 0}%`}
              subtitle="Target: <5%"
              icon={<Ban className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {driversLoading || vendorsLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <ActiveEntitiesCard
              type="drivers"
              online={driverStats?.online || 0}
              offline={driverStats?.offline || 0}
            />
            <ActiveEntitiesCard
              type="vendors"
              online={vendorStats?.active || 0}
              offline={vendorStats?.inactive || 0}
            />
            <KPICard
              title="Driver Payouts"
              value={formatCurrency(orderStats?.driverPayouts || 0)}
              subtitle="Today's total"
              icon={<CreditCard className="h-5 w-5" />}
            />
            <KPICard
              title="Pending Verification"
              value={`${(driverStats?.pending || 0) + (vendorStats?.pending || 0)}`}
              subtitle={`${driverStats?.pending || 0} drivers, ${vendorStats?.pending || 0} vendors`}
              icon={<AlertTriangle className="h-5 w-5" />}
            />
          </>
        )}
      </div>

      {/* System Health Monitor */}
      <SystemHealthMonitor />

      {/* Quick Actions */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <QuickActions />
      </div>

      {/* Live Map */}
      <LiveMap />

      {/* Financial Dashboard */}
      <FinancialDashboard />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOrdersChart />
        <RevenueChart />
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />
    </div>
  );
}
