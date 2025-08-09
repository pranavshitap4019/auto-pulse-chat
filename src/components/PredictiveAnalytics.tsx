import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Battery, TrendingDown, TrendingUp, Calendar } from "lucide-react";

interface PredictionData {
  date: string;
  batteryHealth: number;
  predicted: number;
  confidence: number;
}

export function PredictiveAnalytics() {
  const [batteryPrediction, setBatteryPrediction] = useState({
    currentHealth: 87,
    predictedHealthIn30Days: 82,
    predictedHealthIn60Days: 78,
    predictedHealthIn90Days: 74,
    confidenceLevel: 85,
    remainingLifeCycles: 1250,
    recommendedAction: "Monitor closely - consider replacement in 6 months",
  });

  const [chartData, setChartData] = useState<PredictionData[]>([]);

  useEffect(() => {
    // Generate sample prediction data
    const generateData = () => {
      const data: PredictionData[] = [];
      const baseHealth = batteryPrediction.currentHealth;
      
      for (let i = 0; i <= 90; i += 10) {
        const degradation = (i / 90) * (baseHealth - 65); // Predict degradation to 65%
        data.push({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          batteryHealth: Math.round(baseHealth - degradation),
          predicted: Math.round(baseHealth - degradation + (Math.random() - 0.5) * 2),
          confidence: Math.round(batteryPrediction.confidenceLevel + (Math.random() - 0.5) * 10),
        });
      }
      return data;
    };

    setChartData(generateData());
  }, [batteryPrediction.currentHealth, batteryPrediction.confidenceLevel]);

  const getHealthStatus = (health: number) => {
    if (health >= 80) return { status: "Excellent", color: "bg-status-healthy" };
    if (health >= 60) return { status: "Good", color: "bg-status-warning" };
    return { status: "Poor", color: "bg-status-critical" };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Predictive Analytics</h2>
        <p className="text-muted-foreground">
          AI-powered predictions for vehicle component health and maintenance needs
        </p>
      </div>

      {/* Battery Health Prediction */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              Battery Health Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[60, 90]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}%`,
                      name === "batteryHealth" ? "Predicted Health" : "Confidence Level"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="batteryHealth"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="hsl(var(--accent))"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Battery Health</span>
                  <span className="text-sm font-medium">{batteryPrediction.currentHealth}%</span>
                </div>
                <Progress value={batteryPrediction.currentHealth} className="h-2" />
                <Badge className={getHealthStatus(batteryPrediction.currentHealth).color}>
                  {getHealthStatus(batteryPrediction.currentHealth).status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Confidence Level</span>
                  <span className="text-sm font-medium">{batteryPrediction.confidenceLevel}%</span>
                </div>
                <Progress value={batteryPrediction.confidenceLevel} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="text-muted-foreground">Remaining cycles:</span>
                  <span className="font-medium">{batteryPrediction.remainingLifeCycles}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">30 days</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{batteryPrediction.predictedHealthIn30Days}%</span>
                    <TrendingDown className="h-4 w-4 text-status-warning" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">60 days</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{batteryPrediction.predictedHealthIn60Days}%</span>
                    <TrendingDown className="h-4 w-4 text-status-warning" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">90 days</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{batteryPrediction.predictedHealthIn90Days}%</span>
                    <TrendingDown className="h-4 w-4 text-status-critical" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Battery Health Recommendation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {batteryPrediction.recommendedAction}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Schedule maintenance</Badge>
                <Badge variant="outline">Monitor temperature</Badge>
                <Badge variant="outline">Check charging cycles</Badge>
              </div>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Predictive Maintenance Schedule</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Battery inspection: Next month</li>
                <li>• Brake pad replacement: Within 2 weeks (URGENT)</li>
                <li>• Oil change: 2,000 miles</li>
                <li>• Tire rotation: 5,000 miles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}