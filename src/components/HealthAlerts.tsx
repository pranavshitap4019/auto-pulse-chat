import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, StatusType } from "./StatusBadge";
import { AlertTriangle, Info, AlertCircle, Bell, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Alert {
  id: string;
  type: StatusType;
  system: string;
  message: string;
  timestamp: string;
}

export function HealthAlerts({ vin }: { vin: string }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [recommendations, setRecommendations] = useState<Record<string, string>>({});
  const [loadingRecommendations, setLoadingRecommendations] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const API_BASE_URL = 'https://sovdserver.pagekite.me';//  http://localhost:3001/api

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/functions/GetSystemAlerts`);// vehicle/alerts?vin=${vin}
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
            system: "Camera",
            message: "BA200 - Faulty Lens reported. ADAS system is not able to recieve video stream correctly. Immediate attention required.",
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

  const fetchAIRecommendation = async (alertId: string, alertMessage: string) => {
    setLoadingRecommendations(prev => new Set([...prev, alertId]));
    try {
      const res = await fetch(`${API_BASE_URL}/ai/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, message: alertMessage, vin })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecommendations(prev => ({ ...prev, [alertId]: data.recommendation }));
    } catch (err) {
      console.error("Failed to fetch AI recommendation:", err);
      // Use dummy recommendation when API fails
      setRecommendations(prev => ({ 
        ...prev, 
        [alertId]: "Based on the alert analysis, we recommend immediate inspection by a qualified technician. Monitor system performance closely and schedule maintenance as needed. Consider checking related components for preventive measures."
      }));
    } finally {
      setLoadingRecommendations(prev => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };

  const handleAIClick = async (alert: Alert) => {
    const isExpanded = expandedAlerts.has(alert.id);
    
    if (isExpanded) {
      // Collapse
      setExpandedAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alert.id);
        return newSet;
      });
    } else {
      // Expand
      setExpandedAlerts(prev => new Set([...prev, alert.id]));
      
      // Fetch recommendation if not already fetched
      if (!recommendations[alert.id]) {
        await fetchAIRecommendation(alert.id, alert.message);
      }
    }
  };

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
            <Collapsible key={alert.id} open={expandedAlerts.has(alert.id)}>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
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
                  
                  <CollapsibleContent className="mt-3">
                    <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
                      <div className="flex items-start gap-2">
                        <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-1">AI Recommendation</h4>
                          {loadingRecommendations.has(alert.id) ? (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="animate-spin h-3 w-3 border border-muted-foreground border-t-transparent rounded-full"></div>
                              Analyzing alert...
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {recommendations[alert.id] || "No recommendation available."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
                
                <CollapsibleTrigger asChild>
                  <button
                    onClick={() => handleAIClick(alert)}
                    className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
                    aria-label="Get AI recommendation"
                  >
                    <Bot className={`h-4 w-4 transition-colors ${
                      expandedAlerts.has(alert.id) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`} />
                  </button>
                </CollapsibleTrigger>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
