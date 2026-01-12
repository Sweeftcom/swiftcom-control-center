import { ShoppingCart, IndianRupee, Clock, Ban, CreditCard } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveOrdersChart } from "@/components/dashboard/LiveOrdersChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActiveEntitiesCard } from "@/components/dashboard/ActiveEntitiesCard";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";

export default function Dashboard() {
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
        <KPICard
          title="Orders Today"
          value="2,847"
          change={32}
          changeLabel="vs yesterday"
          icon={<ShoppingCart className="h-5 w-5" />}
          trend="up"
        />
        <KPICard
          title="Revenue Today"
          value="₹8.7L"
          change={26}
          changeLabel="vs yesterday"
          icon={<IndianRupee className="h-5 w-5" />}
          trend="up"
        />
        <KPICard
          title="Avg Delivery Time"
          value="19 min"
          subtitle="Target: <25 min"
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Cancellation Rate"
          value="2.1%"
          subtitle="Target: <5%"
          icon={<Ban className="h-5 w-5" />}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ActiveEntitiesCard type="drivers" online={89} offline={158} />
        <ActiveEntitiesCard type="vendors" online={47} offline={142} />
        <KPICard
          title="Avg Order Value"
          value="₹312"
          change={8}
          changeLabel="vs last week"
          trend="up"
        />
        <KPICard
          title="Payouts Pending"
          value="34"
          subtitle="Total: ₹3.8L"
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <QuickActions />
      </div>

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
