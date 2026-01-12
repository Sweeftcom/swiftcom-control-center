import { useState } from "react";
import {
  Save,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Percent,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="commission" className="gap-2">
            <Percent className="h-4 w-4" />
            Commission
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="stat-card space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="SWEeftCOM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" defaultValue="support@sweeftcom.in" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input id="supportPhone" defaultValue="+91-1800-XXX-XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="Asia/Kolkata (IST)" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" defaultValue="06:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" defaultValue="23:59" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">24/7 Operations</p>
                    <p className="text-sm text-muted-foreground">Enable round-the-clock service</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="commission" className="space-y-6">
          <div className="stat-card space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Default Commission Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="foodComm">Food & Restaurant (%)</Label>
                  <Input id="foodComm" type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groceryComm">Grocery (%)</Label>
                  <Input id="groceryComm" type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shoppingComm">Shopping (%)</Label>
                  <Input id="shoppingComm" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacyComm">Pharmacy (%)</Label>
                  <Input id="pharmacyComm" type="number" defaultValue="12" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Driver Earnings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="baseRate">Base Rate per Delivery (₹)</Label>
                  <Input id="baseRate" type="number" defaultValue="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perKm">Per Kilometer Rate (₹)</Label>
                  <Input id="perKm" type="number" defaultValue="7" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peakMultiplier">Peak Hour Multiplier</Label>
                  <Input id="peakMultiplier" type="number" step="0.1" defaultValue="1.5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rainBonus">Rain Bonus (₹)</Label>
                  <Input id="rainBonus" type="number" defaultValue="15" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="stat-card space-y-4">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">New Order Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified for every new order</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Vendor Registration</p>
                  <p className="text-sm text-muted-foreground">Alert when new vendor applies</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Driver Registration</p>
                  <p className="text-sm text-muted-foreground">Alert when new driver applies</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Order Cancellations</p>
                  <p className="text-sm text-muted-foreground">Alert on order cancellations</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Low Driver Availability</p>
                  <p className="text-sm text-muted-foreground">Alert when online drivers drop below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Daily Summary Email</p>
                  <p className="text-sm text-muted-foreground">Receive daily performance summary</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="stat-card space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Admin Access</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Super Admin</p>
                      <p className="text-sm text-muted-foreground">admin@sweeftcom.in</p>
                    </div>
                  </div>
                  <span className="status-badge status-online">Active</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Session Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="font-medium">Persistent Sessions</p>
                    <p className="text-sm text-muted-foreground">Sessions never expire automatically</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="font-medium">Activity Audit Logs</p>
                    <p className="text-sm text-muted-foreground">Track all admin actions with IP/timestamp</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <p className="font-medium">IP Whitelisting</p>
                    <p className="text-sm text-muted-foreground">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="stat-card space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Gateway</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="razorpayKey">Razorpay Key ID</Label>
                  <Input id="razorpayKey" type="password" defaultValue="rzp_live_xxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                  <Input id="razorpaySecret" type="password" defaultValue="************" />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Payout Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minPayout">Minimum Payout Amount (₹)</Label>
                  <Input id="minPayout" type="number" defaultValue="100" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutCycle">Payout Cycle</Label>
                  <Input id="payoutCycle" defaultValue="Daily" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="font-medium">Instant Payouts</p>
                  <p className="text-sm text-muted-foreground">Enable instant withdrawals for drivers</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
