import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: "up" | "down";
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  trend,
  className,
}: KPICardProps) {
  const isPositive = trend === "up" || (change && change > 0);

  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="kpi-label uppercase tracking-wider">{title}</p>
          <p className="kpi-value text-foreground group-hover:text-primary transition-colors">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 mt-2", isPositive ? "kpi-change-positive" : "kpi-change-negative")}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{isPositive ? "+" : ""}{change}%</span>
              {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
