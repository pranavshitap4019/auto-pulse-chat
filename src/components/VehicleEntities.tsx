import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { toast } from "sonner";

interface EntityItem {
  id: string;
  name: string;
  category: "Area" | "Components" | "Apps" | "Functions";
  status: string;
}

interface VehicleEntitiesProps {
  vin: string;
}

export function VehicleEntities({ vin }: VehicleEntitiesProps) {
  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/vehicle/entities?vin=${vin}`);
      if (!response.ok) throw new Error('Failed to fetch entities');
      const data = await response.json();
      setEntities(data.entities || []);
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      toast.error('Failed to fetch vehicle entities');
      // Mock data for demonstration
      setEntities([
        { id: "1", name: "Engine Control", category: "Components", status: "Active" },
        { id: "2", name: "Passenger Area", category: "Area", status: "Normal" },
        { id: "3", name: "Navigation App", category: "Apps", status: "Running" },
        { id: "4", name: "Climate Control", category: "Functions", status: "Active" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
    const interval = setInterval(fetchEntities, 10000);
    return () => clearInterval(interval);
  }, [vin]);

  const categorizeEntities = () => {
    return {
      Area: entities.filter(e => e.category === "Area"),
      Components: entities.filter(e => e.category === "Components"),
      Apps: entities.filter(e => e.category === "Apps"),
      Functions: entities.filter(e => e.category === "Functions"),
    };
  };

  const categorizedEntities = categorizeEntities();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Vehicle Entities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading entities...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(categorizedEntities).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">{category}</h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="outline" className="text-xs">{item.status}</Badge>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground">No {category.toLowerCase()} found</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}