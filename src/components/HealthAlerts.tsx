import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, StatusType } from "./StatusBadge";
import { AlertTriangle, Info, AlertCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  type: StatusType;
  system: string;
  message: string;
  timestamp: string;
}

export function HealthAlerts({ vin }: { vin: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/vehicle/alerts?vin=${vin}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error("Failed to fetch health alerts:", err);
        // Use dummy demo data when API fails
        setAlerts([
          {
            id: "1",
            type: "critical",
            system: "Engine",
            message: "Engine temperature above normal range. Immediate attention required.",
            timestamp: "2024-01-15 10:30:00"
          },
          {
            id: "2",
            type: "warning",
            system: "Battery",
            message: "Battery voltage low. Consider charging soon.",
            timestamp: "2024-01-15 09:45:00"
          },
          {
            id: "3",
            type: "info",
            system: "Maintenance",
            message: "Regular service due in 500 miles.",
            timestamp: "2024-01-15 08:15:00"
          },
          {
            id: "4",
            type: "warning",
            system: "Tires",
            message: "Front left tire pressure below recommended level.",
            timestamp: "2024-01-15 07:20:00"
          }
        ]);
        toast({
          variant: "destructive",
          title: "Using demo data",
          description: "Could not connect to API. Showing sample health alerts.",
        });
      }
    };

    if (vin) {
      // Initial fetch
      fetchAlerts();
      
      // Set up continuous fetching every 5 seconds
      const interval = setInterval(() => {
        fetchAlerts();
      }, 5000);

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [vin, toast]);

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