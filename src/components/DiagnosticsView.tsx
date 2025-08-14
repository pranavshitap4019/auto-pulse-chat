import { useState } from "react";
import { VinSearch } from "@/components/VinSearch";
import { SystemInfo } from "@/components/SystemInfo";
import { VehicleEntities } from "@/components/VehicleEntities";
import { LiveGraphs } from "@/components/LiveGraphs";
import { DataParameters } from "@/components/DataParameters";
import { VehicleFaults } from "@/components/VehicleFaults";
import { RunningApplications } from "@/components/RunningApplications";
import { Card, CardContent } from "@/components/ui/card";

export function DiagnosticsView() {
  const [selectedVin, setSelectedVin] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Vehicle Diagnostics</h2>
        <VinSearch onSelectVin={(vin) => setSelectedVin(vin)} />
      </div>

      {selectedVin ? (
        <div className="space-y-6">
          {/* Section 1: System Information */}
          <SystemInfo vin={selectedVin} />

          {/* Section 2: Vehicle Entities */}
          <VehicleEntities vin={selectedVin} />

          {/* Section 3: Live Graphs */}
          <LiveGraphs vin={selectedVin} />

          {/* Section 4: Data Parameters */}
          <DataParameters vin={selectedVin} />

          {/* Section 5: Vehicle Faults */}
          <VehicleFaults vin={selectedVin} />

          {/* Section 6: Running Applications */}
          <RunningApplications vin={selectedVin} />
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Select a vehicle for diagnostics</h3>
            <p className="text-muted-foreground">
              Search and select a VIN to view detailed diagnostic information including system status, performance metrics, and running applications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}