import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Cpu, Wifi } from "lucide-react";
import { toast } from "sonner";

interface MetricData {
  timestamp: string;
  value: number;
}

interface LiveGraphsProps {
  vin: string;
}

export function LiveGraphs({ vin }: LiveGraphsProps) {
  const [cpuData, setCpuData] = useState<MetricData[]>([]);
  const [memoryData, setMemoryData] = useState<MetricData[]>([]);
  const [networkData, setNetworkData] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/vehicle/metrics?vin=${vin}`);
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      
      setCpuData(data.cpu || []);
      setMemoryData(data.memory || []);
      setNetworkData(data.network || []);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      toast.error('Failed to fetch live metrics');
      
      // Mock data for demonstration
      const now = new Date();
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(now.getTime() - (9 - i) * 30000).toLocaleTimeString(),
        value: Math.floor(Math.random() * 100)
      }));
      
      setCpuData(mockData);
      setMemoryData(mockData.map(d => ({ ...d, value: Math.floor(Math.random() * 80) + 20 })));
      setNetworkData(mockData.map(d => ({ ...d, value: Math.floor(Math.random() * 50) + 10 })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, [vin]);

  const GraphCard = ({ title, data, icon: Icon, color }: { 
    title: string; 
    data: MetricData[]; 
    icon: any; 
    color: string;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value) => [`${value}%`, title]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-right">
          <span className="text-lg font-semibold">{data[data.length - 1]?.value || 0}%</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Live Performance Metrics</h3>
      {loading ? (
        <div className="text-center py-8">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GraphCard 
            title="CPU Usage" 
            data={cpuData} 
            icon={Cpu} 
            color="#8884d8" 
          />
          <GraphCard 
            title="Memory Usage" 
            data={memoryData} 
            icon={Activity} 
            color="#82ca9d" 
          />
          <GraphCard 
            title="Network Usage" 
            data={networkData} 
            icon={Wifi} 
            color="#ffc658" 
          />
        </div>
      )}
    </div>
  );
}