import { useAdminAlerts, useResolveAlert } from "@/hooks/useAdminAlerts";
import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export function SystemHealthMonitor() {
  const { data: alerts, isLoading } = useAdminAlerts();
  const resolveAlert = useResolveAlert();

  const unresolvedAlerts = alerts?.filter(a => !a.is_resolved) || [];

  if (isLoading) {
    return (
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold">System Health Monitor</h3>
        </div>
        <p className="text-muted-foreground">Loading alerts...</p>
      </div>
    );
  }

  if (unresolvedAlerts.length === 0) {
    return (
      <div className="stat-card border-success/30 bg-success/5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-success">All Systems Operational</h3>
            <p className="text-sm text-muted-foreground">No pending alerts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card border-warning/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-lg font-semibold">System Health Monitor</h3>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            {unresolvedAlerts.length} Active
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {unresolvedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start justify-between p-3 rounded-lg border ${
              alert.severity === "error"
                ? "bg-destructive/10 border-destructive/30"
                : alert.severity === "warning"
                ? "bg-warning/10 border-warning/30"
                : "bg-muted/50 border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                alert.severity === "error"
                  ? "bg-destructive/20"
                  : "bg-warning/20"
              }`}>
                {alert.severity === "error" ? (
                  <X className="h-4 w-4 text-destructive" />
                ) : (
                  <Clock className="h-4 w-4 text-warning" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{alert.title}</p>
                {alert.message && (
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => resolveAlert.mutate(alert.id)}
              disabled={resolveAlert.isPending}
            >
              Resolve
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
