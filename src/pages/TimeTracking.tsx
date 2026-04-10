import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchTimeTrackingModuleData } from "@/lib/mockApi";

export default function TimeTrackingPage() {
  const { data } = useQuery({
    queryKey: ["time-tracking-module"],
    queryFn: fetchTimeTrackingModuleData,
  });

  return (
    <TeacherLayout>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="dashboard-section-title mb-3">Time Tracking</h3>
        <div className="space-y-2 max-h-[520px] overflow-y-auto">
          {data?.entries.map((entry) => (
            <div key={entry.studentId} className="grid grid-cols-4 text-sm border-b border-border pb-2">
              <span className="text-foreground">{entry.name}</span>
              <span className="text-muted-foreground">In: {entry.inTime}</span>
              <span className="text-muted-foreground">Out: {entry.outTime}</span>
              <span className="text-foreground">{entry.trackedMinutes} mins</span>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
