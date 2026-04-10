import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchSchedulesModuleData } from "@/lib/mockApi";

export default function SchedulesPage() {
  const { data } = useQuery({
    queryKey: ["schedules-module"],
    queryFn: fetchSchedulesModuleData,
  });

  return (
    <TeacherLayout>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="dashboard-section-title mb-3">Weekly Schedules</h3>
        <div className="space-y-2">
          {data?.week.map((slot) => (
            <div key={slot.day} className="grid grid-cols-4 text-sm border-b border-border pb-2">
              <span className="text-foreground">{slot.day}</span>
              <span className="text-foreground">{slot.subject}</span>
              <span className="text-muted-foreground">{slot.room}</span>
              <span className="text-muted-foreground">{slot.time}</span>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
