import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, StatusType } from "./StatusBadge";
import { AlertTriangle, Info, AlertCircle, Bell } from "lucide-react";

interface Alert {
  id: string;
  type: StatusType;
  system: string;
  message: string;
  timestamp: string;
}

export function HealthAlerts({ vin }: { vin: string }) {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      system: "Battery System",
      message: "Battery temperature slightly elevated",
      timestamp: "2024-01-15 14:30:00",
    },
    {
      id: "2",
      type: "info",
      system: "Engine",
      message: "Engine oil pressure within normal range",
      timestamp: "2024-01-15 14:25:00",
    },
    {
      id: "3",
      type: "critical",
      system: "Brake System",
      message: "Brake pad wear detected - service required",
      timestamp: "2024-01-15 14:20:00",
    },
  ];

  const getIcon = (type: StatusType) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Health Alerts
          <span className="text-sm font-normal bg-muted px-2 py-1 rounded-full">
            {alerts.length} Total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="mt-0.5">{getIcon(alert.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={alert.type}>
                    {alert.type.toUpperCase()}
                  </StatusBadge>
                  <span className="font-medium text-sm">{alert.system}</span>
                </div>
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}