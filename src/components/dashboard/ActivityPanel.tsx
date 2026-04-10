import { Eye, MapPin, QrCode } from "lucide-react";
import type { Student } from "@/types";

interface ActivityPanelProps {
  riskStudents: Student[];
}

const statusColor = (score: number) => {
  if (score < 40) return "text-destructive";
  if (score < 60) return "text-warning";
  return "text-success";
};

function getReason(student: Student): "GPS mismatch" | "QR not scanned" | "Low engagement" {
  if (!student.geoVerified) return "GPS mismatch";
  if (!student.qrVerified) return "QR not scanned";
  return "Low engagement";
}

function getIcon(reason: string) {
  if (reason === "GPS mismatch") return MapPin;
  if (reason === "QR not scanned") return QrCode;
  return Eye;
}

export default function ActivityPanel({ riskStudents }: ActivityPanelProps) {
  const flaggedStudents = riskStudents.slice(0, 5).map((student) => {
    const reason = getReason(student);
    return {
      id: student.id,
      name: student.name,
      score: Math.min(student.trustScore, student.engagementScore),
      reason,
      icon: getIcon(reason),
      time: student.lastSeenAt,
    };
  });

  const criticalCount = flaggedStudents.filter((student) => student.score < 40).length;
  const warningCount = flaggedStudents.filter((student) => student.score >= 40 && student.score < 60).length;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="dashboard-section-title">
            Flagged Students
          </h3>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-destructive">
              {criticalCount}
              <span className="text-muted-foreground font-normal ml-1">Critical</span>
            </span>
            <span className="text-warning">
              {warningCount}
              <span className="text-muted-foreground font-normal ml-1">Warning</span>
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {flaggedStudents.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {s.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <s.icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{s.reason}</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${statusColor(s.score)}`}>{s.score}</p>
              <p className="text-[10px] text-muted-foreground">{s.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
