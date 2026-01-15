import { useState } from "react";
import { useOrders, useUpdateOrderStatus, useAssignDriver } from "@/hooks/useOrders";
import { useOnlineDrivers } from "@/hooks/useDrivers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Filter, Eye, UserPlus, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
  accepted: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  preparing: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  ready: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30",
  picked_up: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30",
  delivered: "bg-green-500/20 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
};

const Orders = () => {
  const { data: orders, isLoading, refetch } = useOrders();
  const { data: onlineDrivers } = useOnlineDrivers();
  const updateStatus = useUpdateOrderStatus();
  const assignDriver = useAssignDriver();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor?.store_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate({ orderId, status: newStatus as any });
  };

  const handleAssignDriver = (orderId: string, driverId: string) => {
    assignDriver.mutate({ orderId, driverId });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage and track all orders</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order #, customer, or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="picked_up">Picked Up</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{order.customer?.full_name || "N/A"}</TableCell>
                    <TableCell>{order.vendor?.store_name || "N/A"}</TableCell>
                    <TableCell>
                      {order.driver?.full_name || (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <UserPlus className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Driver</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              {onlineDrivers?.map((driver) => (
                                <Button
                                  key={driver.id}
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => handleAssignDriver(order.id, driver.id)}
                                >
                                  {driver.full_name} - {driver.vehicle_number}
                                </Button>
                              ))}
                              {!onlineDrivers?.length && (
                                <p className="text-muted-foreground text-center py-4">
                                  No online drivers available
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={statusColors[order.status]}>
                            {order.status.replace("_", " ")}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="picked_up">Picked Up</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>₹{order.total_amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "MMM dd, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Order Details - {order.order_number}</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Customer</h4>
                              <p>{order.customer?.full_name}</p>
                              <p className="text-sm text-muted-foreground">{order.customer?.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Vendor</h4>
                              <p>{order.vendor?.store_name}</p>
                              <p className="text-sm text-muted-foreground">{order.vendor?.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Delivery Address</h4>
                              <p className="text-sm">{order.delivery_address}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Payment</h4>
                              <p>{order.payment_method} - {order.payment_status}</p>
                            </div>
                            <div className="col-span-2">
                              <h4 className="font-semibold mb-2">Financial Breakdown</h4>
                              <div className="grid grid-cols-4 gap-2 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Subtotal</p>
                                  <p>₹{order.subtotal}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Delivery Fee</p>
                                  <p>₹{order.delivery_fee}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Platform Fee</p>
                                  <p>₹{order.platform_fee}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-semibold">₹{order.total_amount}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
