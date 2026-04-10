import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchLiveLocationsModuleData } from "@/lib/mockApi";
import { Link } from "react-router-dom";

export default function LiveLocationsPage() {
  const { data } = useQuery({
    queryKey: ["live-locations-module"],
    queryFn: fetchLiveLocationsModuleData,
  });

  return (
    <TeacherLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title">Live Locations</h3>
          <Link to="/camera-feed" className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
            View Camera Feed
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {data?.branches.map((branch) => (
            <div key={branch.name} className="bg-card border border-border rounded-lg p-4">
              <p className="text-sm font-medium text-foreground">{branch.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{branch.inCount} students present</p>
              <p className="text-xs text-destructive mt-1">{branch.alerts} alerts</p>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
