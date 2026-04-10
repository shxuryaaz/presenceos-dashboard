import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchActivitiesProjectsModuleData } from "@/lib/mockApi";

export default function ActivitiesProjectsPage() {
  const { data } = useQuery({
    queryKey: ["activities-projects-module"],
    queryFn: fetchActivitiesProjectsModuleData,
  });

  return (
    <TeacherLayout>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="dashboard-section-title mb-3">Activities & Projects</h3>
        <div className="space-y-2">
          {data?.activities.map((activity) => (
            <div key={activity.name} className="grid grid-cols-3 text-sm border-b border-border pb-2">
              <span className="text-foreground">{activity.name}</span>
              <span className="text-muted-foreground">{activity.status}</span>
              <span className="text-foreground">{activity.participation} participants</span>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
