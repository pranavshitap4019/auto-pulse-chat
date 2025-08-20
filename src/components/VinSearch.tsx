import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { VEHICLE_DATA } from "@/data/vehicleData";

interface VehicleResult {
  vin: string;
  label?: string;
  status?: 'healthy' | 'warning' | 'critical';
}

const VIN_LIST: VehicleResult[] = VEHICLE_DATA.map(vehicle => ({
  vin: vehicle.vin,
  label: vehicle.label,
  status: vehicle.status
}));

type StatusFilter = 'all' | 'healthy' | 'warning' | 'critical';

export function VinSearch({ onSelectVin }: { onSelectVin: (vin: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VehicleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    if (!showResults) {
      setResults([]);
      setLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      setLoading(true);
      const q = query.trim().toLowerCase();
      
      let filtered = VIN_LIST;
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(v => v.status === statusFilter);
      }
      
      // Apply search query filter
      if (q) {
        filtered = filtered.filter(v =>
          v.vin.toLowerCase().includes(q) || v.label?.toLowerCase().includes(q)
        );
      }
      
      setResults(filtered.slice(0, 10));
      setLoading(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [query, showResults, statusFilter]);

  const handleSelect = (vin: string) => {
    onSelectVin(vin);
    setQuery(vin);
    setShowResults(false);
  };

  return (
    <section aria-labelledby="vin-search" className="space-y-2">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <h3 id="vin-search" className="text-sm font-medium">Search by VIN</h3>
      </div>
      
      <div className="flex gap-2 mb-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
          className="hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'healthy' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('healthy')}
          className="gap-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <CheckCircle2 className="h-3 w-3" />
          Healthy
        </Button>
        <Button
          variant={statusFilter === 'warning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('warning')}
          className="gap-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <AlertCircle className="h-3 w-3" />
          Warning
        </Button>
        <Button
          variant={statusFilter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('critical')}
          className="gap-1 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Button>
      </div>
      
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          placeholder="Enter VIN or click to browse"
          aria-label="VIN search"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Loading…</div>
        )}

        {results.length > 0 && (
          <Card className="absolute z-10 mt-2 w-full">
            <CardContent className="p-0">
              <ul className="max-h-60 overflow-auto divide-y">
                {results.map((r) => (
                  <li key={r.vin}>
                    <button
                      type="button"
                      onClick={() => handleSelect(r.vin)}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="font-medium">{r.vin}</div>
                      {r.label && <div className="text-xs text-muted-foreground">{r.label}</div>}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
