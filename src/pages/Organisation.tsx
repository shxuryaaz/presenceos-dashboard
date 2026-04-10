import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchOrganisationModuleData } from "@/lib/mockApi";

export default function OrganisationPage() {
  const { data } = useQuery({
    queryKey: ["organisation-module"],
    queryFn: fetchOrganisationModuleData,
  });

  return (
    <TeacherLayout>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-3">Class Groups</h3>
          <div className="space-y-2">
            {data?.groups.map((group) => (
              <div key={group.name} className="flex items-center justify-between text-sm border-b border-border pb-2">
                <span className="text-foreground">{group.name}</span>
                <span className="text-muted-foreground">{group.students} students</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-3">Staff</h3>
          <div className="space-y-2">
            {data?.admins.map((name) => (
              <p key={name} className="text-sm text-foreground border-b border-border pb-2">
                {name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
