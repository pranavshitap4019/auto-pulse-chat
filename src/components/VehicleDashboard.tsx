import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleMetricCard } from "./VehicleMetricCard";
import { StatusBadge } from "./StatusBadge";
import { Battery, Thermometer, Disc, Gauge, Wifi, Clock, AlertCircle } from "lucide-react";
import vehicleHeroImage from "@/assets/vehicle-dashboard-hero.jpg";
import { useToast } from "@/hooks/use-toast";

interface VehicleData {
  batteryLevel: number;
  batteryTemp: number;
  engineTemp: number;
  oilPressure: number;
  brakeSystem: number;
  tirePressure: number;
  lastUpdate: string;
  isConnected: boolean;
}

export function VehicleDashboard({ vin }: { vin: string }) {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    batteryLevel: 0,
    batteryTemp: 0,
    engineTemp: 0,
    oilPressure: 0,
    brakeSystem: 0,
    tirePressure: 0,
    lastUpdate: "Loading...",
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // API endpoints for vehicle data
  const API_BASE_URL = 'http://localhost:3001/api';
  
  const fetchVehicleData = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/vehicle/status?vin=${encodeURIComponent(vin)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setVehicleData({
        batteryLevel: data.battery?.level || 0,
        batteryTemp: data.battery?.temperature || 0,
        engineTemp: data.engine?.temperature || 0,
        oilPressure: data.engine?.oilPressure || 0,
        brakeSystem: data.brakes?.fluidLevel || 0,
        tirePressure: data.tires?.pressure || 0,
        lastUpdate: new Date().toLocaleTimeString(),
        isConnected: true,
      });
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch vehicle data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setVehicleData(prev => ({ ...prev, isConnected: false }));
      
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to vehicle API. Please check if the server is running on localhost:3001",
      });
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and set up real-time updates every 10 seconds
  useEffect(() => {
    fetchVehicleData();
    
    const interval = setInterval(() => {
      fetchVehicleData();
    }, 10000);

    return () => clearInterval(interval);
  }, [vin]);

  const getStatusForMetric = (value: number, thresholds: { healthy: number; warning: number }) => {
    if (value >= thresholds.healthy) return "healthy";
    if (value >= thresholds.warning) return "warning";
    return "critical";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">VIN: {vin}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <StatusBadge status={vehicleData.isConnected ? "healthy" : "critical"}>
              {vehicleData.isConnected ? "Connected" : "Disconnected"}
            </StatusBadge>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">Last Update: {vehicleData.lastUpdate}</span>
          </div>
        </div>
      </div>


      {/* System Status Overview */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Gauge className="h-6 w-6" />
          System Status Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <VehicleMetricCard
            title="Battery Level"
            value={vehicleData.batteryLevel.toString()}
            unit="%"
            status={getStatusForMetric(vehicleData.batteryLevel, { healthy: 60, warning: 30 })}
            icon={<Battery className="h-5 w-5" />}
            progress={vehicleData.batteryLevel}
            subtitle={`Temperature: ${vehicleData.batteryTemp}°C`}
          />
          
          <VehicleMetricCard
            title="Engine Temperature"
            value={vehicleData.engineTemp.toString()}
            unit="°F"
            status={getStatusForMetric(210 - vehicleData.engineTemp, { healthy: 0, warning: -5 })}
            icon={<Thermometer className="h-5 w-5" />}
            progress={((vehicleData.engineTemp - 180) / 40) * 100}
            subtitle={`Oil Pressure: ${vehicleData.oilPressure} PSI`}
          />
          
          <VehicleMetricCard
            title="Brake System"
            value={vehicleData.brakeSystem.toString()}
            unit="%"
            status={getStatusForMetric(vehicleData.brakeSystem, { healthy: 70, warning: 30 })}
            icon={<Disc className="h-5 w-5" />}
            progress={vehicleData.brakeSystem}
            subtitle="Fluid Level: 85%"
          />
          
          <VehicleMetricCard
            title="Tire Pressure"
            value={vehicleData.tirePressure.toString()}
            unit="PSI"
            status={getStatusForMetric(vehicleData.tirePressure, { healthy: 30, warning: 28 })}
            icon={<Gauge className="h-5 w-5" />}
            progress={((vehicleData.tirePressure - 25) / 10) * 100}
            subtitle="Tread Depth: 7/32&quot;"
          />
        </div>
      </div>
    </div>
  );
}