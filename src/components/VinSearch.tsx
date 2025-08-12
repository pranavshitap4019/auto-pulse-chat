import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

interface VehicleResult {
  vin: string;
  label?: string;
}

export function VinSearch({ onSelectVin }: { onSelectVin: (vin: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VehicleResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setLoading(true);
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const res = await fetch(`${API_BASE_URL}/vehicles/search?q=${encodeURIComponent(query)}` , { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Accept either array of strings or objects
        const list: VehicleResult[] = Array.isArray(data)
          ? data.map((item: any) => (typeof item === 'string' ? { vin: item } : { vin: item.vin, label: item.label }))
          : [];
        setResults(list);
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          console.error('VIN search failed:', err);
          toast({
            variant: "destructive",
            title: "Search failed",
            description: "Could not reach the API at localhost:3001",
          });
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, toast]);

  const handleSelect = (vin: string) => {
    onSelectVin(vin);
    setQuery(vin);
    setResults([]);
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
          placeholder="Enter VIN (min 3 characters)"
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
