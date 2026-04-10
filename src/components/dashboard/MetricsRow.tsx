import { Users, UserCheck, TrendingUp, AlertTriangle } from "lucide-react";

const metrics = [
  {
    label: "Total Students",
    value: "248",
    change: "+12 this week",
    icon: Users,
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
  {
    label: "Present Today",
    value: "231",
    change: "93.1%",
    icon: UserCheck,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    label: "Engagement",
    value: "87.4%",
    change: "+2.1% vs last week",
    icon: TrendingUp,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "At-Risk Students",
    value: "14",
    change: "5.6% of total",
    icon: AlertTriangle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
];

export default function MetricsRow() {
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
