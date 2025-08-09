import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge, StatusType } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface VehicleMetricCardProps {
  title: string;
  value: string;
  unit?: string;
  status: StatusType;
  icon: React.ReactNode;
  progress?: number;
  subtitle?: string;
  className?: string;
}

export function VehicleMetricCard({
  title,
  value,
  unit,
  status,
  icon,
  progress,
  subtitle,
  className,
}: VehicleMetricCardProps) {
  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="text-primary">{icon}</div>
            <h3 className="font-medium text-muted-foreground">{title}</h3>
          </div>
          <StatusBadge status={status}>
            {status === "healthy" ? "HEALTHY" : status === "warning" ? "WARNING" : status === "critical" ? "CRITICAL" : "INFO"}
          </StatusBadge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    status === "healthy" && "bg-status-healthy",
                    status === "warning" && "bg-status-warning",
                    status === "critical" && "bg-status-critical",
                    status === "info" && "bg-primary"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}