import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  MapPin,
  Phone,
  Bike,
  AlertCircle,
  Clock,
  TrendingUp,
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const pendingDrivers = [
  {
    id: "DRV-P001",
    name: "Rajesh Kumar",
    phone: "+91-9823****210",
    appliedAt: "2024-01-14 11:30",
    vehicleType: "Bike",
    documents: {
      dl: { status: "verified", file: "driving_license.pdf" },
      aadhar: { status: "verified", file: "aadhar_card.jpg" },
      rc: { status: "pending", file: "rc_book.pdf" },
      insurance: { status: "verified", file: "insurance.pdf" },
      fitness: { status: "verified", file: "fitness_cert.pdf" },
    },
  },
  {
    id: "DRV-P002",
    name: "Suresh Patel",
    phone: "+91-9845****321",
    appliedAt: "2024-01-14 09:45",
    vehicleType: "Bike",
    documents: {
      dl: { status: "verified", file: "driving_license.pdf" },
      aadhar: { status: "pending", file: "aadhar_card.jpg" },
      rc: { status: "verified", file: "rc_book.pdf" },
      insurance: { status: "verified", file: "insurance.pdf" },
      fitness: { status: "pending", file: "fitness_cert.pdf" },
    },
  },
  {
    id: "DRV-P003",
    name: "Mohammed Ali",
    phone: "+91-9812****654",
    appliedAt: "2024-01-13 17:20",
    vehicleType: "Scooter",
    documents: {
      dl: { status: "rejected", file: "driving_license.pdf", reason: "Expired license" },
      aadhar: { status: "verified", file: "aadhar_card.jpg" },
      rc: { status: "verified", file: "rc_book.pdf" },
      insurance: { status: "verified", file: "insurance.pdf" },
      fitness: { status: "verified", file: "fitness_cert.pdf" },
    },
  },
  {
    id: "DRV-P004",
    name: "Amit Singh",
    phone: "+91-9867****987",
    appliedAt: "2024-01-13 14:10",
    vehicleType: "Bike",
    documents: {
      dl: { status: "verified", file: "driving_license.pdf" },
      aadhar: { status: "verified", file: "aadhar_card.jpg" },
      rc: { status: "verified", file: "rc_book.pdf" },
      insurance: { status: "verified", file: "insurance.pdf" },
      fitness: { status: "verified", file: "fitness_cert.pdf" },
    },
  },
];

const activeDrivers = [
  {
    id: "DRV-001",
    name: "Raj Patel",
    phone: "+91-9845****123",
    vehicleType: "Bike",
    vehicleNumber: "KA-01-AB-1234",
    ordersToday: 18,
    earningsToday: 890,
    rating: 4.8,
    ratingCount: 1250,
    status: "online",
    currentOrder: "ORD-2846",
    location: "Koramangala 4th Block",
    joinedAt: "2023-05-10",
  },
  {
    id: "DRV-002",
    name: "Amit Kumar",
    phone: "+91-9812****456",
    vehicleType: "Bike",
    vehicleNumber: "KA-02-CD-5678",
    ordersToday: 15,
    earningsToday: 720,
    rating: 4.6,
    ratingCount: 980,
    status: "on_delivery",
    currentOrder: "ORD-2845",
    location: "HSR Layout",
    joinedAt: "2023-07-22",
  },
  {
    id: "DRV-003",
    name: "Ravi Singh",
    phone: "+91-9845****987",
    vehicleType: "Scooter",
    vehicleNumber: "KA-03-EF-9012",
    ordersToday: 12,
    earningsToday: 580,
    rating: 4.5,
    ratingCount: 760,
    status: "online",
    currentOrder: null,
    location: "Indiranagar",
    joinedAt: "2023-09-15",
  },
  {
    id: "DRV-004",
    name: "Kiran B.",
    phone: "+91-9823****222",
    vehicleType: "Bike",
    vehicleNumber: "KA-04-GH-3456",
    ordersToday: 8,
    earningsToday: 420,
    rating: 4.7,
    ratingCount: 540,
    status: "offline",
    currentOrder: null,
    location: "JP Nagar",
    joinedAt: "2023-11-01",
  },
  {
    id: "DRV-005",
    name: "Naveen R.",
    phone: "+91-9856****333",
    vehicleType: "Bike",
    vehicleNumber: "KA-05-IJ-7890",
    ordersToday: 21,
    earningsToday: 1050,
    rating: 4.9,
    ratingCount: 1680,
    status: "online",
    currentOrder: null,
    location: "Whitefield",
    joinedAt: "2023-03-18",
  },
];

const getDocStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="h-4 w-4 text-success" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-warning" />;
    case "rejected":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return null;
  }
};

const getDriverStatusBadge = (status: string) => {
  switch (status) {
    case "online":
      return <span className="status-badge status-online">Online</span>;
    case "on_delivery":
      return <span className="status-badge status-preparing">On Delivery</span>;
    case "offline":
      return <span className="status-badge status-offline">Offline</span>;
    default:
      return null;
  }
};

export default function Drivers() {
  const [selectedPendingDriver, setSelectedPendingDriver] = useState<typeof pendingDrivers[0] | null>(null);
  const [selectedActiveDriver, setSelectedActiveDriver] = useState<typeof activeDrivers[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Drivers Management</h1>
          <p className="text-muted-foreground">Zero fake drivers - Complete verification system</p>
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
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Total Drivers</p>
              <p className="kpi-value">247</p>
            </div>
            <Bike className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Online Now</p>
              <p className="kpi-value text-success">89</p>
            </div>
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
              </span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Pending Verification</p>
              <p className="kpi-value text-warning">{pendingDrivers.length}</p>
            </div>
            <Clock className="h-8 w-8 text-warning" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Avg Rating</p>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-warning fill-warning" />
                <span className="kpi-value">4.7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verification Section */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pending Driver Verification</h2>
            <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">
              {pendingDrivers.length} pending
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Phone</th>
                <th>Vehicle</th>
                <th>Verification Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDrivers.map((driver) => {
                const allVerified = Object.values(driver.documents).every(d => d.status === "verified");
                const hasRejected = Object.values(driver.documents).some(d => d.status === "rejected");
                
                return (
                  <tr key={driver.id}>
                    <td>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{driver.id}</p>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{driver.phone}</td>
                    <td>
                      <Badge variant="outline">{driver.vehicleType}</Badge>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(driver.documents).map(([docType, doc]) => (
                          <div key={docType} className="flex items-center gap-1 text-sm">
                            {getDocStatusIcon(doc.status)}
                            <span className="uppercase text-xs">{docType}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-sm text-muted-foreground">{driver.appliedAt}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPendingDriver(driver)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        {allVerified && (
                          <Button size="sm" className="action-button-success">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        {hasRejected && (
                          <Button size="sm" className="action-button-danger">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Drivers Section */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Active Drivers</h2>
            <Badge variant="secondary">{activeDrivers.length} drivers</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="on_delivery">On Delivery</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Current Order</th>
                <th className="text-right">Orders Today</th>
                <th className="text-right">Earnings</th>
                <th>Rating</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeDrivers.map((driver) => (
                <tr key={driver.id}>
                  <td>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.phone}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <Badge variant="outline">{driver.vehicleType}</Badge>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{driver.vehicleNumber}</p>
                    </div>
                  </td>
                  <td>{getDriverStatusBadge(driver.status)}</td>
                  <td>
                    {driver.currentOrder ? (
                      <span className="font-mono text-primary">{driver.currentOrder}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="text-right font-medium">{driver.ordersToday}</td>
                  <td className="text-right font-medium text-success">₹{driver.earningsToday}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium">{driver.rating}</span>
                      <span className="text-xs text-muted-foreground">({(driver.ratingCount / 1000).toFixed(1)}k)</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {driver.location}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedActiveDriver(driver)}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Phone className="h-4 w-4" />
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

      {/* Pending Driver Review Modal */}
      <Dialog open={!!selectedPendingDriver} onOpenChange={() => setSelectedPendingDriver(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Document Review - {selectedPendingDriver?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedPendingDriver && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground">Driver Name</p>
                  <p className="font-medium">{selectedPendingDriver.name}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedPendingDriver.phone}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground">Vehicle Type</p>
                  <Badge variant="outline">{selectedPendingDriver.vehicleType}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Document Verification</p>
                {Object.entries(selectedPendingDriver.documents).map(([docType, doc]) => (
                  <div
                    key={docType}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      doc.status === "verified"
                        ? "bg-success/5 border-success/30"
                        : doc.status === "pending"
                        ? "bg-warning/5 border-warning/30"
                        : "bg-destructive/5 border-destructive/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium uppercase text-sm">
                          {docType === "dl" ? "Driving License" :
                           docType === "aadhar" ? "Aadhar Card" :
                           docType === "rc" ? "RC Book" :
                           docType === "insurance" ? "Insurance" :
                           docType === "fitness" ? "Fitness Certificate" : docType}
                        </p>
                        <p className="text-xs text-muted-foreground">{doc.file}</p>
                        {"reason" in doc && doc.reason && (
                          <p className="text-xs text-destructive mt-1">{doc.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getDocStatusIcon(doc.status)}
                      <span
                        className={cn(
                          "text-sm font-medium capitalize",
                          doc.status === "verified"
                            ? "text-success"
                            : doc.status === "pending"
                            ? "text-warning"
                            : "text-destructive"
                        )}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rejection Reason (if rejecting)</p>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button className="flex-1 action-button-success">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Driver
                </Button>
                <Button className="flex-1 action-button-danger">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Driver
                </Button>
                <Button variant="outline">Request Re-upload</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Driver Details Modal */}
      <Dialog open={!!selectedActiveDriver} onOpenChange={() => setSelectedActiveDriver(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedActiveDriver?.name} - Driver Details</DialogTitle>
          </DialogHeader>

          {selectedActiveDriver && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedActiveDriver.ordersToday}</p>
                    <p className="text-sm text-muted-foreground">Orders Today</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold text-success">₹{selectedActiveDriver.earningsToday}</p>
                    <p className="text-sm text-muted-foreground">Earnings Today</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="text-2xl font-bold">{selectedActiveDriver.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedActiveDriver.ratingCount.toLocaleString()} reviews</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="font-medium">{selectedActiveDriver.vehicleType}</p>
                    <p className="text-sm font-mono text-muted-foreground">{selectedActiveDriver.vehicleNumber}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="font-medium">{selectedActiveDriver.location}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getDriverStatusBadge(selectedActiveDriver.status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Order</p>
                      {selectedActiveDriver.currentOrder ? (
                        <span className="font-mono text-primary">{selectedActiveDriver.currentOrder}</span>
                      ) : (
                        <span className="text-muted-foreground">No active order</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{selectedActiveDriver.joinedAt}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Weekly Orders</p>
                    <p className="text-3xl font-bold">127</p>
                    <p className="text-sm text-success">+12% vs last week</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Weekly Earnings</p>
                    <p className="text-3xl font-bold text-success">₹6,340</p>
                    <p className="text-sm text-success">+8% vs last week</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Avg Delivery Time</p>
                    <p className="text-3xl font-bold">18 min</p>
                    <p className="text-sm text-muted-foreground">Target: &lt;25 min</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <p className="text-sm text-muted-foreground mb-2">Acceptance Rate</p>
                    <p className="text-3xl font-bold">94%</p>
                    <p className="text-sm text-muted-foreground">Excellent</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
