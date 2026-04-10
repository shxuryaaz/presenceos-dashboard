import { AlertCircle } from "lucide-react";
import type { Student } from "@/types";

interface AlertBannerProps {
  riskStudents: Student[];
}

export default function AlertBanner({ riskStudents }: AlertBannerProps) {
  const criticalCount = riskStudents.filter(
    (student) => student.trustScore < 40 || student.engagementScore < 30,
  ).length;
  const warningCount = Math.max(0, riskStudents.length - criticalCount);

  return (
    <div className="bg-card border border-border rounded-lg divide-y divide-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {riskStudents.length} students flagged for low trust or engagement
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
            {criticalCount} critical and {warningCount} warning risk indicators
          </span>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          View Details
        </button>
      </div>
    </div>
  );
}
