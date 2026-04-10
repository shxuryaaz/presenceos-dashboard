import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { day: "Mon", present: 228, late: 12, absent: 8 },
  { day: "Tue", present: 235, late: 8, absent: 5 },
  { day: "Wed", present: 220, late: 15, absent: 13 },
  { day: "Thu", present: 231, late: 10, absent: 7 },
  { day: "Fri", present: 218, late: 18, absent: 12 },
];

export default function AttendanceChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Attendance This Week
        </h3>
        <span className="text-lg font-semibold text-foreground">231 avg/day</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "hsl(220 10% 54%)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(220 10% 54%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid hsl(220 13% 91%)",
              fontSize: 13,
            }}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="present" name="Present" fill="hsl(142 71% 45%)" radius={[3, 3, 0, 0]} stackId="a" />
          <Bar dataKey="late" name="Late" fill="hsl(38 92% 50%)" radius={[0, 0, 0, 0]} stackId="a" />
          <Bar dataKey="absent" name="Absent" fill="hsl(0 72% 51%)" radius={[3, 3, 0, 0]} stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
