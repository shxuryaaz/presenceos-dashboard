import { AlertCircle } from "lucide-react";

export default function AlertBanner() {
  return (
    <div className="bg-card border border-border rounded-lg divide-y divide-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            3 students flagged for low trust score this week
          </span>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Review Students
        </button>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            5 attendance anomalies detected in Period 3
          </span>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}
