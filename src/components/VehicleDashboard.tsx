import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleMetricCard } from "./VehicleMetricCard";
import { StatusBadge } from "./StatusBadge";
import { Battery, Thermometer, Disc, Gauge, Wifi, Clock } from "lucide-react";
import vehicleHeroImage from "@/assets/vehicle-dashboard-hero.jpg";

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

export function VehicleDashboard() {
  const [vehicleData, setVehicleData] = useState<VehicleData>({
    batteryLevel: 87,
    batteryTemp: 32,
    engineTemp: 195,
    oilPressure: 45,
    brakeSystem: 15,
    tirePressure: 31,
    lastUpdate: "Now",
    isConnected: true,
  });

  // Simulate real-time data updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicleData(prev => ({
        ...prev,
        batteryLevel: Math.max(10, Math.min(100, prev.batteryLevel + (Math.random() - 0.5) * 2)),
        batteryTemp: Math.max(20, Math.min(45, prev.batteryTemp + (Math.random() - 0.5) * 2)),
        engineTemp: Math.max(180, Math.min(220, prev.engineTemp + (Math.random() - 0.5) * 5)),
        oilPressure: Math.max(30, Math.min(60, prev.oilPressure + (Math.random() - 0.5) * 3)),
        brakeSystem: Math.max(5, Math.min(100, prev.brakeSystem + (Math.random() - 0.5) * 1)),
        tirePressure: Math.max(25, Math.min(35, prev.tirePressure + (Math.random() - 0.5) * 1)),
        lastUpdate: "Now",
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
          <h1 className="text-3xl font-bold text-foreground">Vehicle Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring and diagnostics</p>
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

      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div 
          className="h-64 bg-gradient-to-r from-primary to-accent flex items-center justify-start px-8"
          style={{
            backgroundImage: `url(${vehicleHeroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="text-white space-y-2 max-w-lg">
            <h2 className="text-4xl font-bold">Advanced Vehicle Monitoring</h2>
            <p className="text-lg opacity-90">
              Real-time health status, predictive maintenance alerts, and AI-powered assistance
            </p>
          </div>
        </div>
      </Card>

      {/* System Status Overview */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Gauge className="h-6 w-6" />
          System Status Overview
        </h2>
        <p className="text-muted-foreground mb-6">Monitor all critical vehicle systems in real-time</p>
        
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