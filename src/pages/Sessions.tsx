import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchSessionsModuleData, startAttendanceSession } from "@/lib/mockApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function SessionsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["sessions-module"],
    queryFn: fetchSessionsModuleData,
  });

  const startMutation = useMutation({
    mutationFn: startAttendanceSession,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["sessions-module"] });
    },
  });

  return (
    <TeacherLayout>
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="dashboard-section-title mb-2">Attendance Session</h3>
            <p className="text-sm text-foreground">
              {data?.activeSession.active ? "Session running" : "No active attendance session"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => startMutation.mutate()}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            >
              Start Session
            </button>
            <Link
              to="/camera-feed"
              className="px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground"
            >
              View Camera Feed
            </Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="dashboard-section-title mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {data?.pastSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between text-sm border-b border-border pb-2">
                <span className="text-foreground">{session.id}</span>
                <span className="text-muted-foreground">{session.date}</span>
                <span className="text-success">{session.present} present</span>
                <span className="text-destructive">{session.absent} absent</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
