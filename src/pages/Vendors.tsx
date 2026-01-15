import { useState } from "react";
import { useVendors, useVerifyVendor, useSuspendVendor, useUpdateVendorCommission, useVendorsStats } from "@/hooks/useVendors";
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
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Store,
  Star,
  Percent
} from "lucide-react";
import { format } from "date-fns";

const Vendors = () => {
  const { data: vendors, isLoading, refetch } = useVendors();
  const { data: stats } = useVendorsStats();
  const verifyVendor = useVerifyVendor();
  const suspendVendor = useSuspendVendor();
  const updateCommission = useUpdateVendorCommission();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [newCommission, setNewCommission] = useState<number>(0);

  const filteredVendors = vendors?.filter((vendor) => {
    const matchesSearch = 
      vendor.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "verified") matchesStatus = vendor.is_verified === true;
    if (statusFilter === "pending") matchesStatus = vendor.is_verified === false;
    if (statusFilter === "active") matchesStatus = vendor.is_active === true;
    if (statusFilter === "suspended") matchesStatus = vendor.is_active === false;
    
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (vendorId: string, verify: boolean) => {
    verifyVendor.mutate({ vendorId, isVerified: verify });
  };

  const handleSuspend = (vendorId: string) => {
    suspendVendor.mutate(vendorId);
  };

  const handleUpdateCommission = (vendorId: string) => {
    updateCommission.mutate({ vendorId, commissionRate: newCommission });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage restaurant partners</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-500">{stats?.verified || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-blue-500">{stats?.active || 0}</p>
              </div>
              <Store className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">{stats?.pending || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by store name, phone, or category..."
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
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vendors ({filteredVendors?.length || 0})</CardTitle>
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
                  <TableHead>Store Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors?.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.store_name}</TableCell>
                    <TableCell>{vendor.category || "N/A"}</TableCell>
                    <TableCell>{vendor.phone || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {vendor.rating?.toFixed(1) || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.total_orders || 0}</TableCell>
                    <TableCell>{vendor.commission_rate || 0}%</TableCell>
                    <TableCell>
                      {vendor.is_active === false ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : vendor.is_verified ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVendor(vendor);
                                setNewCommission(vendor.commission_rate || 0);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Vendor Details - {vendor.store_name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Contact</h4>
                                <p>{vendor.phone}</p>
                                <p className="text-sm text-muted-foreground">{vendor.address}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Category</h4>
                                <p>{vendor.category}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Documents</h4>
                                <ul className="text-sm space-y-1">
                                  <li>FSSAI License: {vendor.fssai_license ? "✓" : "✗"}</li>
                                  <li>GST Certificate: {vendor.gst_certificate ? "✓" : "✗"}</li>
                                  <li>PAN Card: {vendor.pan_card ? "✓" : "✗"}</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Performance</h4>
                                <p>Total Orders: {vendor.total_orders}</p>
                                <p>Total Revenue: ₹{vendor.total_revenue?.toLocaleString()}</p>
                                <p>Rating: {vendor.rating?.toFixed(1)}/5</p>
                              </div>
                              <div className="col-span-2">
                                <h4 className="font-semibold mb-2">Commission Rate</h4>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="number"
                                    value={newCommission}
                                    onChange={(e) => setNewCommission(Number(e.target.value))}
                                    className="w-24"
                                    min={0}
                                    max={100}
                                  />
                                  <span>%</span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateCommission(vendor.id)}
                                    disabled={updateCommission.isPending}
                                  >
                                    <Percent className="h-4 w-4 mr-1" />
                                    Update
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {!vendor.is_verified && vendor.is_active !== false && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerify(vendor.id, true)}
                            className="text-green-500 hover:text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {vendor.is_active !== false && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspend(vendor.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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

export default Vendors;
