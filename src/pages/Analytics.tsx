import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchAnalyticsModuleData } from "@/lib/mockApi";

export default function AnalyticsPage() {
  const { data } = useQuery({
    queryKey: ["analytics-module"],
    queryFn: fetchAnalyticsModuleData,
  });

  return (
    <TeacherLayout>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-2">Attendance Summary</h3>
          <p className="text-sm text-foreground">Present: {data?.metrics.present ?? 0}</p>
          <p className="text-sm text-foreground">Late: {data?.metrics.late ?? 0}</p>
          <p className="text-sm text-foreground">Out: {data?.metrics.out ?? 0}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-2">Engagement</h3>
          <p className="text-sm text-foreground">Average: {data?.engagement.averageEngagement ?? 0}%</p>
          <p className="text-sm text-muted-foreground">
            Trend: {data?.engagement.trendDelta ? data.engagement.trendDelta.toFixed(1) : "0.0"}%
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-2">Risk Signals</h3>
          <p className="text-sm text-foreground">{data?.risk.length ?? 0} active flags</p>
        </div>
      </div>
    </TeacherLayout>
  );
}
