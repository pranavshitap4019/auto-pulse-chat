import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VehicleFault {
  entity: string;
  code: string;
  description: string;
  status: "Active" | "Resolved" | "Pending";
}

interface VehicleFaultsProps {
  vin: string;
}

export function VehicleFaults({ vin }: VehicleFaultsProps) {
  const [faults, setFaults] = useState<VehicleFault[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFaults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/vehicle/faults?vin=${vin}`);
      if (!response.ok) throw new Error('Failed to fetch faults');
      const data = await response.json();
      setFaults(data.faults || []);
    } catch (error) {
      console.error('Failed to fetch faults:', error);
      toast.error('Failed to fetch vehicle faults');
      
      // Mock data for demonstration
      setFaults([
        { entity: "Engine", code: "P0300", description: "Random/Multiple Cylinder Misfire Detected", status: "Active" },
        { entity: "ABS", code: "C1234", description: "ABS Speed Sensor Malfunction", status: "Resolved" },
        { entity: "Transmission", code: "P0700", description: "Transmission Control System Malfunction", status: "Pending" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaults();
    const interval = setInterval(fetchFaults, 10000);
    return () => clearInterval(interval);
  }, [vin]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active": return "destructive";
      case "Resolved": return "default";
      case "Pending": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Vehicle Faults
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading faults...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entity</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faults.map((fault, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{fault.entity}</TableCell>
                  <TableCell className="font-mono">{fault.code}</TableCell>
                  <TableCell>{fault.description}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(fault.status)}>
                      {fault.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {faults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No faults detected
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}