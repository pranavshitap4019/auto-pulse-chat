import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Square, RotateCcw, Monitor } from "lucide-react";
import { toast } from "sonner";

interface Application {
  name: string;
  tag: string;
  creationDate: string;
  size: string;
  status: "Running" | "Stopped" | "Error";
}

interface RunningApplicationsProps {
  vin: string;
}

export function RunningApplications({ vin }: RunningApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/vehicle/applications?vin=${vin}`);
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to fetch running applications');
      
      // Mock data for demonstration
      setApplications([
        { name: "Navigation System", tag: "nav-v2.1", creationDate: "2024-01-15", size: "145MB", status: "Running" },
        { name: "Climate Control", tag: "climate-v1.3", creationDate: "2024-01-10", size: "32MB", status: "Running" },
        { name: "Entertainment Hub", tag: "entertainment-v3.0", creationDate: "2024-01-20", size: "256MB", status: "Stopped" },
        { name: "Diagnostics Tool", tag: "diag-v1.0", creationDate: "2024-01-05", size: "78MB", status: "Running" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, [vin]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Running": return "default";
      case "Stopped": return "secondary";
      case "Error": return "destructive";
      default: return "outline";
    }
  };

  const handleAction = (appName: string, action: string) => {
    toast.success(`${action} action triggered for ${appName}`);
  };

  const renderActionButton = (app: Application) => {
    switch (app.status) {
      case "Running":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(app.name, "Stop")}
            className="h-7 px-2"
          >
            <Square className="h-3 w-3" />
          </Button>
        );
      case "Stopped":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(app.name, "Start")}
            className="h-7 px-2"
          >
            <Play className="h-3 w-3" />
          </Button>
        );
      case "Error":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction(app.name, "Restart")}
            className="h-7 px-2"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Running Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading applications...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell className="font-mono text-sm">{app.tag}</TableCell>
                  <TableCell>{app.creationDate}</TableCell>
                  <TableCell>{app.size}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(app.status)}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {renderActionButton(app)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}