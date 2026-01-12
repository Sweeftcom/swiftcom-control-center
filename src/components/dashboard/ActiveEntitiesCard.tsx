import { Truck, Store } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EntityStatusProps {
  type: "drivers" | "vendors";
  online: number;
  offline: number;
}

export function ActiveEntitiesCard({ type, online, offline }: EntityStatusProps) {
  const total = online + offline;
  const percentage = (online / total) * 100;
  const Icon = type === "drivers" ? Truck : Store;
  const label = type === "drivers" ? "Drivers" : "Vendors";

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="kpi-label uppercase tracking-wider">Active {label}</p>
          <p className="kpi-value text-foreground">
            {online}<span className="text-muted-foreground text-xl">/{total}</span>
          </p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <Progress value={percentage} className="h-2 mb-3" />
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success"></span>
          <span className="text-muted-foreground">Online: {online}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
          <span className="text-muted-foreground">Offline: {offline}</span>
        </div>
      </div>
    </div>
  );
}
