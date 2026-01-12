import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  FileText,
  Star,
  TrendingUp,
  AlertCircle,
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

const pendingVendors = [
  {
    id: "VND-P001",
    name: "Pizza Palace",
    category: "Food",
    phone: "+91-9823****456",
    appliedAt: "2024-01-14 10:30",
    documents: {
      fssai: { status: "verified", file: "fssai_license.pdf" },
      gst: { status: "verified", file: "gst_certificate.pdf" },
      pan: { status: "pending", file: "pan_card.jpg" },
    },
  },
  {
    id: "VND-P002",
    name: "Fresh Mart",
    category: "Grocery",
    phone: "+91-9845****789",
    appliedAt: "2024-01-14 09:15",
    documents: {
      gst: { status: "verified", file: "gst_certificate.pdf" },
      shopAct: { status: "verified", file: "shop_act.pdf" },
    },
  },
  {
    id: "VND-P003",
    name: "TechZone Electronics",
    category: "Shopping",
    phone: "+91-9812****321",
    appliedAt: "2024-01-13 16:45",
    documents: {
      gst: { status: "verified", file: "gst_certificate.pdf" },
      invoice: { status: "rejected", file: "invoice_sample.pdf", reason: "Suspected fake document" },
    },
  },
];

const activeVendors = [
  {
    id: "VND-001",
    name: "Pizza Hub",
    category: "Food",
    phone: "+91-9823****123",
    ordersToday: 67,
    revenueToday: 21340,
    rating: 4.7,
    ratingCount: 2300,
    status: "online",
    commission: 20,
    joinedAt: "2023-06-15",
  },
  {
    id: "VND-002",
    name: "Kirana Express",
    category: "Grocery",
    phone: "+91-9845****456",
    ordersToday: 34,
    revenueToday: 10780,
    rating: 4.5,
    ratingCount: 1100,
    status: "online",
    commission: 15,
    joinedAt: "2023-08-22",
  },
  {
    id: "VND-003",
    name: "GadgetWorld",
    category: "Shopping",
    phone: "+91-9812****789",
    ordersToday: 12,
    revenueToday: 56400,
    rating: 4.6,
    ratingCount: 890,
    status: "online",
    commission: 10,
    joinedAt: "2023-09-10",
  },
  {
    id: "VND-004",
    name: "Biryani House",
    category: "Food",
    phone: "+91-9876****234",
    ordersToday: 45,
    revenueToday: 18900,
    rating: 4.8,
    ratingCount: 1850,
    status: "offline",
    commission: 20,
    joinedAt: "2023-04-05",
  },
  {
    id: "VND-005",
    name: "Medicine Plus",
    category: "Pharmacy",
    phone: "+91-9823****567",
    ordersToday: 28,
    revenueToday: 8450,
    rating: 4.4,
    ratingCount: 650,
    status: "paused",
    commission: 12,
    joinedAt: "2023-11-18",
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

export default function Vendors() {
  const [selectedPendingVendor, setSelectedPendingVendor] = useState<typeof pendingVendors[0] | null>(null);
  const [selectedActiveVendor, setSelectedActiveVendor] = useState<typeof activeVendors[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendors Management</h1>
          <p className="text-muted-foreground">Full lifecycle vendor control & verification</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Pending Verification Section */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Pending Verification</h2>
            <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">
              {pendingVendors.length} pending
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Category</th>
                <th>Document Status</th>
                <th>Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{vendor.id}</p>
                    </div>
                  </td>
                  <td>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(vendor.documents).map(([docType, doc]) => (
                        <div key={docType} className="flex items-center gap-1 text-sm">
                          {getDocStatusIcon(doc.status)}
                          <span className="uppercase text-xs">{docType}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="text-sm text-muted-foreground">{vendor.appliedAt}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPendingVendor(vendor)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      {Object.values(vendor.documents).every(d => d.status === "verified") && (
                        <Button size="sm" className="action-button-success">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {Object.values(vendor.documents).some(d => d.status === "rejected") && (
                        <Button size="sm" className="action-button-danger">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Vendors Section */}
      <div className="stat-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Active Vendors</h2>
            <Badge variant="secondary">{activeVendors.length} vendors</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="grocery">Grocery</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-right">Orders Today</th>
                <th className="text-right">Revenue Today</th>
                <th>Rating</th>
                <th>Commission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{vendor.id}</p>
                    </div>
                  </td>
                  <td>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "status-badge",
                        vendor.status === "online"
                          ? "status-online"
                          : vendor.status === "paused"
                          ? "status-pending"
                          : "status-offline"
                      )}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td className="text-right font-medium">{vendor.ordersToday}</td>
                  <td className="text-right font-medium">₹{vendor.revenueToday.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-xs text-muted-foreground">({(vendor.ratingCount / 1000).toFixed(1)}k)</span>
                    </div>
                  </td>
                  <td className="text-primary font-medium">{vendor.commission}%</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedActiveVendor(vendor)}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {vendor.status === "online" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Vendor Review Modal */}
      <Dialog open={!!selectedPendingVendor} onOpenChange={() => setSelectedPendingVendor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Document Review - {selectedPendingVendor?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedPendingVendor && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground">Store Name</p>
                  <p className="font-medium">{selectedPendingVendor.name}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{selectedPendingVendor.category}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Documents</p>
                {Object.entries(selectedPendingVendor.documents).map(([docType, doc]) => (
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
                        <p className="font-medium uppercase text-sm">{docType}</p>
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
                  Approve Vendor
                </Button>
                <Button className="flex-1 action-button-danger">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Vendor
                </Button>
                <Button variant="outline">Request Re-upload</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Vendor Analytics Modal */}
      <Dialog open={!!selectedActiveVendor} onOpenChange={() => setSelectedActiveVendor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedActiveVendor?.name} - Analytics</DialogTitle>
          </DialogHeader>

          {selectedActiveVendor && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold text-foreground">{selectedActiveVendor.ordersToday}</p>
                    <p className="text-sm text-muted-foreground">Orders Today</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <p className="text-2xl font-bold text-primary">₹{selectedActiveVendor.revenueToday.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Revenue Today</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-5 w-5 text-warning fill-warning" />
                      <span className="text-2xl font-bold">{selectedActiveVendor.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedActiveVendor.ratingCount.toLocaleString()} reviews</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Commission Rate</p>
                      <p className="text-xl font-bold text-primary">{selectedActiveVendor.commission}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">{selectedActiveVendor.joinedAt}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span
                        className={cn(
                          "status-badge",
                          selectedActiveVendor.status === "online" ? "status-online" : "status-offline"
                        )}
                      >
                        {selectedActiveVendor.status}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Commission Override</p>
                        <p className="text-sm text-muted-foreground">Custom commission rate for this vendor</p>
                      </div>
                      <Input type="number" className="w-24" defaultValue={selectedActiveVendor.commission} />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pause Account</p>
                        <p className="text-sm text-muted-foreground">Temporarily disable this vendor</p>
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Deactivate Vendor</p>
                        <p className="text-sm text-muted-foreground">Permanently remove this vendor</p>
                      </div>
                      <Button variant="destructive" className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Deactivate
                      </Button>
                    </div>
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
