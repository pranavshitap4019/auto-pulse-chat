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
        toast({
          variant: "destructive",
          title: "Health alerts unavailable",
          description: "Could not connect to the API at localhost:3001",
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