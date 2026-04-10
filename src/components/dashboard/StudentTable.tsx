const students = [
  { name: "Emma Wilson", status: "Present", trust: 92, engagement: 95, avatar: "EW" },
  { name: "Liam Chen", status: "Present", trust: 88, engagement: 91, avatar: "LC" },
  { name: "Sofia Garcia", status: "Late", trust: 74, engagement: 82, avatar: "SG" },
  { name: "Marcus Rivera", status: "Present", trust: 32, engagement: 45, avatar: "MR" },
  { name: "Aisha Khan", status: "Present", trust: 45, engagement: 38, avatar: "AK" },
  { name: "Tyler Brooks", status: "Absent", trust: 51, engagement: 0, avatar: "TB" },
  { name: "Priya Sharma", status: "Late", trust: 38, engagement: 52, avatar: "PS" },
  { name: "Devon Lee", status: "Present", trust: 55, engagement: 61, avatar: "DL" },
  { name: "Olivia Martin", status: "Present", trust: 96, engagement: 98, avatar: "OM" },
  { name: "Noah Kim", status: "Present", trust: 89, engagement: 87, avatar: "NK" },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Present: "bg-success/10 text-success",
    Late: "bg-warning/10 text-warning",
    Absent: "bg-destructive/10 text-destructive",
  };
  return styles[status] || "";
};

const trustColor = (score: number) => {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
};

const trustLabel = (score: number) => {
  if (score >= 80) return "Trusted";
  if (score >= 60) return "Review";
  return "At Risk";
};

const trustLabelColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};

export default function StudentTable() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Students
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search students..."
            className="text-sm border border-border rounded-md px-3 py-1.5 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-52"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Trust Score
              </th>
              <th className="text-left px-5 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((s) => (
              <tr
                key={s.name}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                      {s.avatar}
                    </div>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                      s.status
                    )}`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${trustColor(s.trust)}`}
                        style={{ width: `${s.trust}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-7">{s.trust}</span>
                    <span className={`text-xs font-medium ${trustLabelColor(s.trust)}`}>
                      {trustLabel(s.trust)}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${trustColor(s.engagement)}`}
                        style={{ width: `${s.engagement}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{s.engagement}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
