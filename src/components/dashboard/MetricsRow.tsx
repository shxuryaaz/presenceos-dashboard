import { Users, UserCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { getRiskStudents } from "@/lib/scoring";
import type { EngagementData, Student } from "@/types";

interface MetricsRowProps {
  students: Student[];
  engagement?: EngagementData;
}

export default function MetricsRow({ students, engagement }: MetricsRowProps) {
  const presentCount = students.filter((student) => student.attendanceStatus === "Present").length;
  const riskCount = getRiskStudents(students).length;
  const presentPct = students.length ? ((presentCount / students.length) * 100).toFixed(1) : "0.0";
  const riskPct = students.length ? ((riskCount / students.length) * 100).toFixed(1) : "0.0";

  const metrics = [
    {
      label: "Total Students",
      value: students.length.toString(),
      change: "Class roster",
      icon: Users,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      label: "Present Today",
      value: presentCount.toString(),
      change: `${presentPct}% attendance`,
      icon: UserCheck,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    {
      label: "Engagement",
      value: `${engagement?.averageEngagement ?? 0}%`,
      change: `${(engagement?.trendDelta ?? 0) >= 0 ? "+" : ""}${(engagement?.trendDelta ?? 0).toFixed(
        1,
      )}% vs last refresh`,
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "At-Risk Students",
      value: riskCount.toString(),
      change: `${riskPct}% of class`,
      icon: AlertTriangle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {m.label}
              </p>
              <p className="text-2xl font-semibold text-foreground mt-1">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
            </div>
            <div className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center`}>
              <m.icon className={`w-4.5 h-4.5 ${m.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
