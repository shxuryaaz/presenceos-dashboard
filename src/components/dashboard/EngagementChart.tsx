import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "High", value: 156, color: "hsl(142 71% 45%)" },
  { name: "Medium", value: 64, color: "hsl(38 92% 50%)" },
  { name: "Low", value: 28, color: "hsl(0 72% 51%)" },
];

export default function EngagementChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Engagement Distribution
      </h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          <div className="text-center mb-2">
            <p className="text-xl font-semibold text-foreground">87.4%</p>
            <p className="text-xs text-muted-foreground">avg engagement</p>
          </div>
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
