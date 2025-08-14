import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleDashboard } from "@/components/VehicleDashboard";
import { HealthAlerts } from "@/components/HealthAlerts";
import { ChatBot } from "@/components/ChatBot";
import { PredictiveAnalytics } from "@/components/PredictiveAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Settings, BarChart3, Home, Bot, Stethoscope } from "lucide-react";
import { FleetSummary } from "@/components/FleetSummary";
import { VinSearch } from "@/components/VinSearch";
import { DiagnosticsView } from "@/components/DiagnosticsView";
import vehicleHeroImage from "@/assets/vehicle-dashboard-hero.jpg";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedVin, setSelectedVin] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Diagnostics
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Predictive Analytics
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Hero: Advanced Vehicle Monitoring */}
            <Card className="relative overflow-hidden">
              <div
                className="relative h-56 md:h-64 flex items-center justify-start px-8"
                style={{
                  backgroundImage: `url(${vehicleHeroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/10" aria-hidden="true" />
                <div className="relative z-10 space-y-2 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Advanced Vehicle Monitoring</h2>
                  <p className="text-base md:text-lg text-muted-foreground">
                    Real-time system diagnostics, predictive insights, and AI assistance.
                  </p>
                </div>
              </div>
            </Card>
            <FleetSummary />
            <div>
              <VinSearch onSelectVin={(vin) => setSelectedVin(vin)} />
            </div>

            {selectedVin ? (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3">
                  <VehicleDashboard vin={selectedVin} />
                </div>
                <div className="xl:col-span-1">
                  <HealthAlerts vin={selectedVin} />
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Select a vehicle</h3>
                  <p className="text-muted-foreground">
                    Search and select a VIN to view system status and health alerts.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="diagnostics">
            <DiagnosticsView />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalytics />
          </TabsContent>

          <TabsContent value="assistant">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">AI Vehicle Assistant</h2>
                <p className="text-muted-foreground">
                  Get instant answers about your vehicle's health, maintenance recommendations, and diagnostic help.
                </p>
              </div>
              <ChatBot />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Settings</h2>
                <p className="text-muted-foreground">
                  Configure your dashboard preferences and vehicle settings.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Dashboard Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auto-refresh interval</span>
                        <span className="text-sm text-muted-foreground">10 seconds</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Real-time alerts</span>
                        <span className="text-sm text-status-healthy">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data retention</span>
                        <span className="text-sm text-muted-foreground">30 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Vehicle Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Make & Model</span>
                        <span className="text-sm text-muted-foreground">Tesla Model 3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Year</span>
                        <span className="text-sm text-muted-foreground">2023</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Mileage</span>
                        <span className="text-sm text-muted-foreground">15,750 miles</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical alerts</span>
                        <span className="text-sm text-status-healthy">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintenance reminders</span>
                        <span className="text-sm text-status-healthy">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Performance reports</span>
                        <span className="text-sm text-muted-foreground">Weekly</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">API Configuration</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Connection status</span>
                        <span className="text-sm text-status-healthy">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data source</span>
                        <span className="text-sm text-muted-foreground">OBD-II Port</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Update frequency</span>
                        <span className="text-sm text-muted-foreground">Real-time</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}