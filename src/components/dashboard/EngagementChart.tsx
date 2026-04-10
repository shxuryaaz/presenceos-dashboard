import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { EngagementData } from "@/types";

interface EngagementChartProps {
  engagement?: EngagementData;
}

const pieColors = {
  High: "hsl(142 71% 45%)",
  Medium: "hsl(38 92% 50%)",
  Low: "hsl(0 72% 51%)",
};

export default function EngagementChart({ engagement }: EngagementChartProps) {
  const data = engagement?.distribution ?? [];

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="dashboard-section-title mb-4">
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
                <Cell key={i} fill={pieColors[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          <div className="text-center mb-2">
            <p className="text-xl font-semibold text-foreground">
              {engagement?.averageEngagement ?? 0}%
            </p>
            <p className="text-xs text-muted-foreground">avg engagement</p>
          </div>
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: pieColors[d.name] }}
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
