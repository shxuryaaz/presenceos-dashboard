import { Search } from "lucide-react";
import type { Student } from "@/types";

interface WhosInPanelProps {
  students: Student[];
}

const statusDot = (status: string) => {
  const colors: Record<string, string> = {
    in: "bg-success",
    late: "bg-warning",
    flagged: "bg-destructive",
  };
  return colors[status] || "bg-chart-gray";
};

export default function WhosInPanel({ students }: WhosInPanelProps) {
  const inCount = students.filter((student) => student.attendanceStatus === "Present").length;
  const lateCount = students.filter((student) => student.attendanceStatus === "Late").length;
  const outCount = students.filter((student) => student.attendanceStatus === "Absent").length;
  const people = students.slice(0, 18).map((student) => ({
    id: student.id,
    name: student.name,
    time: student.lastSeenAt,
    status:
      student.attendanceStatus === "Present"
        ? "in"
        : student.attendanceStatus === "Late"
          ? "late"
          : "flagged",
  }));

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="dashboard-panel-title text-center">Who's in/out</h3>
        <div className="flex items-center justify-center gap-4 mt-2 text-center">
          <div>
            <p className="text-lg font-bold text-success">{inCount}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">In</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">{lateCount}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Late</p>
          </div>
          <div>
            <p className="text-lg font-bold text-destructive">{outCount}</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Out</p>
          </div>
        </div>
      </div>

      <div className="px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2 bg-muted rounded-md px-2.5 py-1.5">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students"
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="divide-y divide-border max-h-[360px] overflow-y-auto">
        {people.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {p.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.time}</p>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${statusDot(p.status)}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
