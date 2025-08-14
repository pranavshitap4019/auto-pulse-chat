import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor } from "lucide-react";

interface SystemInfoProps {
  vin: string;
}

export function SystemInfo({ vin }: SystemInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          System Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">OS Name</p>
            <p className="text-sm text-muted-foreground">Linux Ubuntu</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">OS Version</p>
            <p className="text-sm text-muted-foreground">20.04.6 LTS</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Hardware Arch</p>
            <p className="text-sm text-muted-foreground">x86_64</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">RAM</p>
            <p className="text-sm text-muted-foreground">8GB</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Storage</p>
            <p className="text-sm text-muted-foreground">256GB SSD</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}