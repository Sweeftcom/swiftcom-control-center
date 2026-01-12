import { Eye, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-2847",
    customer: "Rahul S.",
    vendor: "Pizza Hub",
    driver: "Raj Patel",
    status: "delivered",
    amount: 315,
    time: "2 min ago",
  },
  {
    id: "ORD-2846",
    customer: "Priya M.",
    vendor: "Kirana Express",
    driver: "Amit Kumar",
    status: "pickedup",
    amount: 890,
    time: "5 min ago",
  },
  {
    id: "ORD-2845",
    customer: "Vikram R.",
    vendor: "GadgetWorld",
    driver: "Pending",
    status: "ready",
    amount: 12500,
    time: "8 min ago",
  },
  {
    id: "ORD-2844",
    customer: "Sneha K.",
    vendor: "Fresh Mart",
    driver: "Ravi S.",
    status: "preparing",
    amount: 456,
    time: "12 min ago",
  },
  {
    id: "ORD-2843",
    customer: "Arjun P.",
    vendor: "Pizza Hub",
    driver: "Pending",
    status: "new",
    amount: 275,
    time: "14 min ago",
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "status-new" },
  preparing: { label: "Preparing", className: "status-preparing" },
  ready: { label: "Ready", className: "status-ready" },
  pickedup: { label: "Picked Up", className: "status-preparing" },
  delivered: { label: "Delivered", className: "status-delivered" },
  cancelled: { label: "Cancelled", className: "status-cancelled" },
};

export function RecentOrdersTable() {
  return (
    <div className="stat-card p-0 overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Orders</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            View All
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Vendor</th>
              <th>Driver</th>
              <th>Status</th>
              <th className="text-right">Amount</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="animate-fade-in">
                <td className="font-mono text-primary">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.vendor}</td>
                <td>
                  {order.driver === "Pending" ? (
                    <span className="text-warning">Pending</span>
                  ) : (
                    order.driver
                  )}
                </td>
                <td>
                  <span className={cn("status-badge", statusConfig[order.status].className)}>
                    {statusConfig[order.status].label}
                  </span>
                </td>
                <td className="text-right font-medium">₹{order.amount.toLocaleString()}</td>
                <td className="text-muted-foreground text-sm">{order.time}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
