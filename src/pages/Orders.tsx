import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  MapPin,
  Phone,
  MessageSquare,
  UserPlus,
  Ban,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-2847",
    customer: { name: "Rahul Sharma", phone: "+91-9823****210", address: "Ulsoor Lake Road, Bangalore" },
    vendor: { name: "Pizza Hub", category: "Food" },
    driver: { name: "Raj Patel", phone: "+91-9845****123" },
    status: "delivered",
    amount: 315,
    driverEarn: 42.50,
    vendorComm: 63,
    distance: 2.5,
    payment: "PhonePe",
    items: [
      { name: "Margherita Pizza", qty: 1, price: 250 },
      { name: "Coca Cola", qty: 2, price: 60 },
      { name: "Garlic Bread", qty: 1, price: 65 },
    ],
    time: "2 min ago",
    createdAt: "2024-01-15 14:32:18",
  },
  {
    id: "ORD-2846",
    customer: { name: "Priya Menon", phone: "+91-9876****543", address: "Koramangala 4th Block" },
    vendor: { name: "Kirana Express", category: "Grocery" },
    driver: { name: "Amit Kumar", phone: "+91-9812****456" },
    status: "pickedup",
    amount: 890,
    driverEarn: 55.00,
    vendorComm: 89,
    distance: 3.2,
    payment: "GPay",
    items: [
      { name: "Rice 5kg", qty: 1, price: 450 },
      { name: "Cooking Oil 1L", qty: 2, price: 240 },
      { name: "Atta 5kg", qty: 1, price: 200 },
    ],
    time: "5 min ago",
    createdAt: "2024-01-15 14:28:45",
  },
  {
    id: "ORD-2845",
    customer: { name: "Vikram Reddy", phone: "+91-9901****789", address: "HSR Layout Sector 2" },
    vendor: { name: "GadgetWorld", category: "Electronics" },
    driver: null,
    status: "ready",
    amount: 12500,
    driverEarn: 0,
    vendorComm: 1250,
    distance: 5.8,
    payment: "Card",
    items: [{ name: "Wireless Earbuds", qty: 1, price: 12500 }],
    time: "8 min ago",
    createdAt: "2024-01-15 14:24:12",
  },
  {
    id: "ORD-2844",
    customer: { name: "Sneha Kapoor", phone: "+91-9823****654", address: "Indiranagar 100ft Road" },
    vendor: { name: "Fresh Mart", category: "Grocery" },
    driver: { name: "Ravi Singh", phone: "+91-9845****987" },
    status: "preparing",
    amount: 456,
    driverEarn: 38.00,
    vendorComm: 45.60,
    distance: 1.8,
    payment: "COD",
    items: [
      { name: "Milk 1L", qty: 2, price: 110 },
      { name: "Bread", qty: 1, price: 45 },
      { name: "Eggs (12)", qty: 1, price: 96 },
      { name: "Butter", qty: 1, price: 205 },
    ],
    time: "12 min ago",
    createdAt: "2024-01-15 14:20:33",
  },
  {
    id: "ORD-2843",
    customer: { name: "Arjun Patel", phone: "+91-9812****321", address: "Whitefield Main Road" },
    vendor: { name: "Pizza Hub", category: "Food" },
    driver: null,
    status: "new",
    amount: 275,
    driverEarn: 0,
    vendorComm: 55,
    distance: 4.2,
    payment: "Paytm",
    items: [
      { name: "Veg Supreme Pizza", qty: 1, price: 275 },
    ],
    time: "14 min ago",
    createdAt: "2024-01-15 14:18:05",
  },
  {
    id: "ORD-2842",
    customer: { name: "Meera Nair", phone: "+91-9876****111", address: "JP Nagar 6th Phase" },
    vendor: { name: "Biryani House", category: "Food" },
    driver: { name: "Kiran B.", phone: "+91-9823****222" },
    status: "cancelled",
    amount: 520,
    driverEarn: 0,
    vendorComm: 0,
    distance: 2.9,
    payment: "PhonePe",
    items: [
      { name: "Chicken Biryani", qty: 2, price: 520 },
    ],
    time: "18 min ago",
    createdAt: "2024-01-15 14:14:22",
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

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders Control</h1>
          <p className="text-muted-foreground">Real-time order management with instant updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="stat-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Order ID, Customer, or Vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="pickedup">Picked Up</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Bulk Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground mr-2">Bulk Actions:</span>
          <Button size="sm" className="action-button-primary">
            <UserPlus className="h-4 w-4 mr-1" />
            Assign Drivers
          </Button>
          <Button size="sm" className="action-button-danger">
            <Ban className="h-4 w-4 mr-1" />
            Cancel Orders
          </Button>
          <Button size="sm" className="action-button-secondary">
            <MessageSquare className="h-4 w-4 mr-1" />
            SMS Customers
          </Button>
          <Button size="sm" className="action-button-secondary">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Priority Rush
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="stat-card p-0 overflow-hidden">
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
                <th className="text-right">Distance</th>
                <th className="text-right">Driver ₹</th>
                <th className="text-right">Comm ₹</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="animate-fade-in">
                  <td className="font-mono text-primary font-medium">{order.id}</td>
                  <td>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{order.vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{order.vendor.category}</p>
                    </div>
                  </td>
                  <td>
                    {order.driver ? (
                      <div>
                        <p className="font-medium">{order.driver.name}</p>
                        <p className="text-xs text-muted-foreground">{order.driver.phone}</p>
                      </div>
                    ) : (
                      <span className="text-warning font-medium">Pending</span>
                    )}
                  </td>
                  <td>
                    <span className={cn("status-badge", statusConfig[order.status].className)}>
                      {statusConfig[order.status].label}
                    </span>
                  </td>
                  <td className="text-right font-medium">₹{order.amount.toLocaleString()}</td>
                  <td className="text-right text-muted-foreground">{order.distance} km</td>
                  <td className="text-right text-success">₹{order.driverEarn.toFixed(2)}</td>
                  <td className="text-right text-primary">₹{order.vendorComm.toFixed(2)}</td>
                  <td className="text-muted-foreground text-sm">{order.time}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-primary">{selectedOrder?.id}</span>
              {selectedOrder && (
                <span className={cn("status-badge", statusConfig[selectedOrder.status].className)}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Customer */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Customer</p>
                    <p className="font-medium">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">{selectedOrder.customer.address}</p>
                  </div>

                  {/* Vendor */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Vendor</p>
                    <p className="font-medium">{selectedOrder.vendor.name}</p>
                    <Badge variant="secondary" className="mt-1">{selectedOrder.vendor.category}</Badge>
                  </div>

                  {/* Driver */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Driver</p>
                    {selectedOrder.driver ? (
                      <>
                        <p className="font-medium">{selectedOrder.driver.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.driver.phone}</p>
                      </>
                    ) : (
                      <p className="text-warning font-medium">Not Assigned</p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Payment</p>
                    <p className="font-medium">₹{selectedOrder.amount.toLocaleString()}</p>
                    <Badge variant="outline" className="mt-1">{selectedOrder.payment}</Badge>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-3">Financial Summary</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{selectedOrder.distance} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Driver Earnings</p>
                      <p className="font-medium text-success">₹{selectedOrder.driverEarn.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vendor Commission</p>
                      <p className="font-medium text-primary">₹{selectedOrder.vendorComm.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {!selectedOrder.driver && (
                    <Button className="action-button-primary">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Driver
                    </Button>
                  )}
                  <Button className="action-button-success">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Force Complete
                  </Button>
                  <Button className="action-button-secondary">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                  <Button className="action-button-danger">
                    <Ban className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Live Track
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="items" className="mt-4">
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">x{item.qty}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">₹{selectedOrder.amount}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-success"></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                    <div>
                      <p className="font-medium">Payment Confirmed</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.payment} - ₹{selectedOrder.amount}</p>
                    </div>
                  </div>
                  {selectedOrder.driver && (
                    <div className="flex items-start gap-3">
                      <div className="h-2 w-2 mt-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium">Driver Assigned</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.driver.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
