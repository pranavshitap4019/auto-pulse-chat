import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Car, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

interface FleetSummaryData {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
}

export function FleetSummary() {
  const [summary, setSummary] = useState<FleetSummaryData>({ total: 0, healthy: 0, warning: 0, critical: 0 });
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/fleet/summary`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const warning =
          (data.warning ?? ((data.total ?? 0) - (data.healthy ?? 0) - (data.critical ?? 0))) || 0;
        setSummary({
          total: data.total ?? 0,
          healthy: data.healthy ?? 0,
          warning,
          critical: data.critical ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch fleet summary:", err);
        toast({
          variant: "destructive",
          title: "Fleet summary unavailable",
          description: "Could not connect to the API at localhost:3001",
        });
      }
    };

    fetchSummary();
  }, [toast]);

  return (
    <section aria-labelledby="fleet-summary">
      <h2 id="fleet-summary" className="sr-only">Fleet Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-status-healthy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.healthy}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertCircle className="h-4 w-4 text-status-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.warning ?? Math.max(0, summary.total - summary.healthy - summary.critical)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.critical}</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
