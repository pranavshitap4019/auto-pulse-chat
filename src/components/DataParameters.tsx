import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database } from "lucide-react";
import { toast } from "sonner";

interface DataParameter {
  name: string;
  entity: string;
  value: string;
  unit: string;
}

interface DataParametersProps {
  vin: string;
}

export function DataParameters({ vin }: DataParametersProps) {
  const [parameters, setParameters] = useState<DataParameter[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/vehicle/data-parameters?vin=${vin}`);
      if (!response.ok) throw new Error('Failed to fetch data parameters');
      const data = await response.json();
      setParameters(data.parameters || []);
    } catch (error) {
      console.error('Failed to fetch data parameters:', error);
      toast.error('Failed to fetch data parameters');
      
      // Mock data for demonstration
      setParameters([
        { name: "Engine Temperature", entity: "Engine", value: "92", unit: "°C" },
        { name: "Battery Voltage", entity: "Battery", value: "12.6", unit: "V" },
        { name: "Speed", entity: "Vehicle", value: "65", unit: "km/h" },
        { name: "Fuel Level", entity: "Tank", value: "75", unit: "%" },
        { name: "Oil Pressure", entity: "Engine", value: "45", unit: "PSI" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
    const interval = setInterval(fetchParameters, 10000);
    return () => clearInterval(interval);
  }, [vin]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading parameters...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{param.name}</TableCell>
                  <TableCell>{param.entity}</TableCell>
                  <TableCell>{param.value}</TableCell>
                  <TableCell>{param.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}