import { useOrders, useTodayOrdersStats } from "@/hooks/useOrders";
import { useDriversStats } from "@/hooks/useDrivers";
import { useVendorsStats } from "@/hooks/useVendors";
import { KPICard } from "@/components/dashboard/KPICard";
import { LiveOrdersChart } from "@/components/dashboard/LiveOrdersChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { ActiveEntitiesCard } from "@/components/dashboard/ActiveEntitiesCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { SystemHealthMonitor } from "@/components/dashboard/SystemHealthMonitor";
import { FinancialDashboard } from "@/components/dashboard/FinancialDashboard";
import { 
  ShoppingCart, 
  Truck, 
  Store, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const { data: todayStats, isLoading: statsLoading } = useTodayOrdersStats();
  const { data: driverStats } = useDriversStats();
  const { data: vendorStats } = useVendorsStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview of your delivery operations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Today's Orders"
          value={todayStats?.totalOrders || 0}
          icon={<ShoppingCart className="h-5 w-5" />}
          change={12}
          changeLabel="vs yesterday"
          trend="up"
        />
        <KPICard
          title="Today's Revenue"
          value={`₹${todayStats?.revenue?.toLocaleString() || 0}`}
          icon={<DollarSign className="h-5 w-5" />}
          change={8}
          changeLabel="vs yesterday"
          trend="up"
        />
        <KPICard
          title="Active Drivers"
          value={driverStats?.online || 0}
          icon={<Truck className="h-5 w-5" />}
          subtitle={`${driverStats?.total || 0} total drivers`}
        />
        <KPICard
          title="Active Vendors"
          value={vendorStats?.active || 0}
          icon={<Store className="h-5 w-5" />}
          subtitle={`${vendorStats?.total || 0} total vendors`}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Pending Orders"
          value={todayStats?.pendingCount || 0}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Delivered Today"
          value={todayStats?.deliveredCount || 0}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Platform Fees"
          value={`₹${todayStats?.platformFees?.toLocaleString() || 0}`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="Cancellation Rate"
          value={`${todayStats?.cancellationRate || 0}%`}
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      {/* Financial Dashboard */}
      <FinancialDashboard />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOrdersChart />
        <RevenueChart />
      </div>

      {/* Map and Active Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveMap />
        </div>
        <div className="space-y-6">
          <ActiveEntitiesCard 
            type="drivers" 
            online={driverStats?.online || 0} 
            offline={driverStats?.offline || 0} 
          />
          <QuickActions />
        </div>
      </div>

      {/* System Health and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <SystemHealthMonitor />
      </div>
    </div>
  );
};

export default Dashboard;
