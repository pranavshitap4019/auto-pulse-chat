import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { VEHICLE_DATA } from "@/data/vehicleData";

interface VehicleResult {
  vin: string;
  label?: string;
}

const VIN_LIST: VehicleResult[] = VEHICLE_DATA.map(vehicle => ({
  vin: vehicle.vin,
  label: vehicle.label
}));

export function VinSearch({ onSelectVin }: { onSelectVin: (vin: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VehicleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!showResults) {
      setResults([]);
      setLoading(false);
      return;
    }

    const handler = setTimeout(() => {
      setLoading(true);
      const q = query.trim().toLowerCase();
      const filtered = q 
        ? VIN_LIST.filter(v =>
            v.vin.toLowerCase().includes(q) || v.label?.toLowerCase().includes(q)
          ).slice(0, 10)
        : VIN_LIST.slice(0, 10);
      setResults(filtered);
      setLoading(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [query, showResults]);

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
