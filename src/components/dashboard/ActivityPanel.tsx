import { AlertTriangle, Clock, MapPin, QrCode, Eye } from "lucide-react";

const flaggedStudents = [
  { name: "Marcus Rivera", score: 32, reason: "GPS mismatch", icon: MapPin, time: "9:12 am" },
  { name: "Aisha Khan", score: 45, reason: "Low engagement", icon: Eye, time: "9:28 am" },
  { name: "Tyler Brooks", score: 51, reason: "QR not scanned", icon: QrCode, time: "9:35 am" },
  { name: "Priya Sharma", score: 38, reason: "Late + GPS issue", icon: MapPin, time: "9:41 am" },
  { name: "Devon Lee", score: 55, reason: "Engagement drop", icon: Eye, time: "10:02 am" },
];

const statusColor = (score: number) => {
  if (score < 40) return "text-destructive";
  if (score < 60) return "text-warning";
  return "text-success";
};

const bgColor = (score: number) => {
  if (score < 40) return "bg-destructive";
  if (score < 60) return "bg-warning";
  return "bg-success";
};

export default function ActivityPanel() {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Flagged Students
          </h3>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="text-destructive">
              {flaggedStudents.filter((s) => s.score < 40).length}
              <span className="text-muted-foreground font-normal ml-1">Critical</span>
            </span>
            <span className="text-warning">
              {flaggedStudents.filter((s) => s.score >= 40 && s.score < 60).length}
              <span className="text-muted-foreground font-normal ml-1">Warning</span>
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {flaggedStudents.map((s) => (
          <div
            key={s.name}
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
