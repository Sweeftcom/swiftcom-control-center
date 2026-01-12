import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Phone,
  MessageSquare,
  Ban,
  Star,
  ShoppingBag,
  MapPin,
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

const customers = [
  {
    id: "CUS-001",
    name: "Rahul Sharma",
    phone: "+91-9823456210",
    email: "rahul.s@email.com",
    totalOrders: 47,
    totalSpent: 18450,
    avgOrderValue: 392,
    lastOrder: "2024-01-15",
    status: "active",
    addresses: [
      { label: "Home", address: "42, Ulsoor Lake Road, Bangalore - 560008" },
      { label: "Office", address: "Tech Park, Whitefield, Bangalore - 560066" },
    ],
    recentOrders: [
      { id: "ORD-2847", vendor: "Pizza Hub", amount: 315, date: "2024-01-15" },
      { id: "ORD-2789", vendor: "Kirana Express", amount: 890, date: "2024-01-14" },
      { id: "ORD-2701", vendor: "Fresh Mart", amount: 456, date: "2024-01-12" },
    ],
  },
  {
    id: "CUS-002",
    name: "Priya Menon",
    phone: "+91-9876543210",
    email: "priya.m@email.com",
    totalOrders: 89,
    totalSpent: 34200,
    avgOrderValue: 384,
    lastOrder: "2024-01-15",
    status: "active",
    addresses: [
      { label: "Home", address: "15, Koramangala 4th Block, Bangalore - 560034" },
    ],
    recentOrders: [
      { id: "ORD-2846", vendor: "Kirana Express", amount: 890, date: "2024-01-15" },
      { id: "ORD-2780", vendor: "Pizza Hub", amount: 275, date: "2024-01-14" },
    ],
  },
  {
    id: "CUS-003",
    name: "Vikram Reddy",
    phone: "+91-9901234789",
    email: "vikram.r@email.com",
    totalOrders: 23,
    totalSpent: 156000,
    avgOrderValue: 6782,
    lastOrder: "2024-01-15",
    status: "active",
    addresses: [
      { label: "Home", address: "HSR Layout Sector 2, Bangalore - 560102" },
    ],
    recentOrders: [
      { id: "ORD-2845", vendor: "GadgetWorld", amount: 12500, date: "2024-01-15" },
      { id: "ORD-2650", vendor: "TechZone", amount: 45000, date: "2024-01-08" },
    ],
  },
  {
    id: "CUS-004",
    name: "Sneha Kapoor",
    phone: "+91-9823654321",
    email: "sneha.k@email.com",
    totalOrders: 156,
    totalSpent: 45600,
    avgOrderValue: 292,
    lastOrder: "2024-01-15",
    status: "active",
    addresses: [
      { label: "Home", address: "Indiranagar 100ft Road, Bangalore - 560038" },
      { label: "Parents", address: "JP Nagar 6th Phase, Bangalore - 560078" },
    ],
    recentOrders: [
      { id: "ORD-2844", vendor: "Fresh Mart", amount: 456, date: "2024-01-15" },
      { id: "ORD-2810", vendor: "Biryani House", amount: 520, date: "2024-01-14" },
    ],
  },
  {
    id: "CUS-005",
    name: "Arjun Patel",
    phone: "+91-9812321654",
    email: "arjun.p@email.com",
    totalOrders: 12,
    totalSpent: 4800,
    avgOrderValue: 400,
    lastOrder: "2024-01-15",
    status: "active",
    addresses: [
      { label: "Home", address: "Whitefield Main Road, Bangalore - 560066" },
    ],
    recentOrders: [
      { id: "ORD-2843", vendor: "Pizza Hub", amount: 275, date: "2024-01-15" },
    ],
  },
  {
    id: "CUS-006",
    name: "Meera Nair",
    phone: "+91-9876111222",
    email: "meera.n@email.com",
    totalOrders: 34,
    totalSpent: 12800,
    avgOrderValue: 376,
    lastOrder: "2024-01-15",
    status: "blocked",
    addresses: [
      { label: "Home", address: "JP Nagar 6th Phase, Bangalore - 560078" },
    ],
    recentOrders: [
      { id: "ORD-2842", vendor: "Biryani House", amount: 520, date: "2024-01-15", status: "cancelled" },
    ],
  },
];

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers Management</h1>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="kpi-label">Total Customers</p>
          <p className="kpi-value">12,847</p>
          <p className="text-sm text-success mt-1">+156 this week</p>
        </div>
        <div className="stat-card">
          <p className="kpi-label">Active Today</p>
          <p className="kpi-value text-primary">1,234</p>
        </div>
        <div className="stat-card">
          <p className="kpi-label">Avg Order Value</p>
          <p className="kpi-value">₹312</p>
          <p className="text-sm text-success mt-1">+8% vs last month</p>
        </div>
        <div className="stat-card">
          <p className="kpi-label">Repeat Rate</p>
          <p className="kpi-value">67%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="stat-card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="stat-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-right">Total Orders</th>
                <th className="text-right">Total Spent</th>
                <th className="text-right">Avg Order</th>
                <th>Last Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{customer.id}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm">{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "status-badge",
                        customer.status === "active" ? "status-online" : "status-cancelled"
                      )}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="text-right font-medium">{customer.totalOrders}</td>
                  <td className="text-right font-medium text-primary">₹{customer.totalSpent.toLocaleString()}</td>
                  <td className="text-right text-muted-foreground">₹{customer.avgOrderValue}</td>
                  <td className="text-sm text-muted-foreground">{customer.lastOrder}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedCustomer?.name}
              {selectedCustomer && (
                <span
                  className={cn(
                    "status-badge",
                    selectedCustomer.status === "active" ? "status-online" : "status-cancelled"
                  )}
                >
                  {selectedCustomer.status}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{selectedCustomer.totalOrders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold text-primary">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold">₹{selectedCustomer.avgOrderValue}</p>
                    <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button className="action-button-primary">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button className="action-button-secondary">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  {selectedCustomer.status === "active" ? (
                    <Button className="action-button-danger">
                      <Ban className="h-4 w-4 mr-2" />
                      Block Customer
                    </Button>
                  ) : (
                    <Button className="action-button-success">
                      Unblock Customer
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-4">
                <div className="space-y-2">
                  {selectedCustomer.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <div>
                        <p className="font-mono text-primary">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="addresses" className="mt-4">
                <div className="space-y-3">
                  {selectedCustomer.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border border-border"
                    >
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <Badge variant="outline" className="mb-2">{addr.label}</Badge>
                        <p className="text-sm">{addr.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
