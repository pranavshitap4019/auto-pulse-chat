import { cn } from "@/lib/utils";

export type StatusType = "healthy" | "warning" | "critical" | "info" | "confirmed" ;

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

const statusStyles = {
  healthy: "bg-status-healthy text-status-healthy-foreground",
  warning: "bg-status-warning text-status-warning-foreground",
  critical: "bg-status-critical text-status-critical-foreground",
  info: "bg-primary text-primary-foreground",
  confirmed: "bg-status-confirmed text-status-confirmed-foreground"
};

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}
