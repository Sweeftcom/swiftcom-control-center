import { useState } from "react";
import { useDrivers, useVerifyDriver, useSuspendDriver, useDriversStats } from "@/hooks/useDrivers";
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
  Truck,
  Star,
  MapPin
} from "lucide-react";
import { format } from "date-fns";

const Drivers = () => {
  const { data: drivers, isLoading, refetch } = useDrivers();
  const { data: stats } = useDriversStats();
  const verifyDriver = useVerifyDriver();
  const suspendDriver = useSuspendDriver();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const filteredDrivers = drivers?.filter((driver) => {
    const matchesSearch = 
      driver.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === "verified") matchesStatus = driver.is_verified === true;
    if (statusFilter === "pending") matchesStatus = driver.is_verified === false;
    if (statusFilter === "online") matchesStatus = driver.is_online === true;
    if (statusFilter === "offline") matchesStatus = driver.is_online === false;
    if (statusFilter === "suspended") matchesStatus = driver.is_active === false;
    
    return matchesSearch && matchesStatus;
  });

  const handleVerify = (driverId: string, verify: boolean) => {
    verifyDriver.mutate({ driverId, isVerified: verify });
  };

  const handleSuspend = (driverId: string) => {
    suspendDriver.mutate(driverId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
          <p className="text-muted-foreground">Manage delivery partners</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <Truck className="h-8 w-8 text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-blue-500">{stats?.online || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-gray-500">{stats?.offline || 0}</p>
              </div>
              <MapPin className="h-8 w-8 text-gray-500" />
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
                placeholder="Search by name, phone, or vehicle number..."
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
                <SelectItem value="all">All Drivers</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Drivers ({filteredDrivers?.length || 0})</CardTitle>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Deliveries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Online</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers?.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">{driver.full_name}</TableCell>
                    <TableCell>{driver.phone || "N/A"}</TableCell>
                    <TableCell>
                      <div>
                        <p>{driver.vehicle_type}</p>
                        <p className="text-xs text-muted-foreground">{driver.vehicle_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {driver.rating?.toFixed(1) || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{driver.total_deliveries || 0}</TableCell>
                    <TableCell>
                      {driver.is_active === false ? (
                        <Badge variant="destructive">Suspended</Badge>
                      ) : driver.is_verified ? (
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
                      <Badge 
                        className={driver.is_online 
                          ? "bg-green-500/20 text-green-500" 
                          : "bg-gray-500/20 text-gray-500"
                        }
                      >
                        {driver.is_online ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDriver(driver)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Driver Details - {driver.full_name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Contact</h4>
                                <p>{driver.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Vehicle</h4>
                                <p>{driver.vehicle_type} - {driver.vehicle_number}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Documents</h4>
                                <ul className="text-sm space-y-1">
                                  <li>Driving License: {driver.driving_license ? "✓" : "✗"}</li>
                                  <li>Aadhar Card: {driver.aadhar_card ? "✓" : "✗"}</li>
                                  <li>RC Book: {driver.rc_book ? "✓" : "✗"}</li>
                                  <li>Insurance: {driver.insurance ? "✓" : "✗"}</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Performance</h4>
                                <p>Total Deliveries: {driver.total_deliveries}</p>
                                <p>Total Earnings: ₹{driver.total_earnings?.toLocaleString()}</p>
                                <p>Rating: {driver.rating?.toFixed(1)}/5</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {!driver.is_verified && driver.is_active !== false && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerify(driver.id, true)}
                            className="text-green-500 hover:text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {driver.is_active !== false && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuspend(driver.id)}
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

export default Drivers;
