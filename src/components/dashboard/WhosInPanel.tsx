import { Search } from "lucide-react";

const people = [
  { name: "Emma Wilson", time: "8:45 am", status: "in" },
  { name: "Liam Chen", time: "8:50 am", status: "in" },
  { name: "Sofia Garcia", time: "9:15 am", status: "late" },
  { name: "Marcus Rivera", time: "9:12 am", status: "flagged" },
  { name: "Olivia Martin", time: "8:42 am", status: "in" },
  { name: "Noah Kim", time: "8:48 am", status: "in" },
  { name: "Aisha Khan", time: "9:28 am", status: "flagged" },
  { name: "Devon Lee", time: "8:55 am", status: "in" },
];

const statusDot = (status: string) => {
  const colors: Record<string, string> = {
    in: "bg-success",
    late: "bg-warning",
    flagged: "bg-destructive",
  };
  return colors[status] || "bg-chart-gray";
};

export default function WhosInPanel() {
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground text-center">Who's in/out</h3>
        <div className="flex items-center justify-center gap-4 mt-2 text-center">
          <div>
            <p className="text-lg font-bold text-success">231</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">In</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">3</p>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Late</p>
          </div>
          <div>
            <p className="text-lg font-bold text-destructive">14</p>
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
            key={p.name}
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
