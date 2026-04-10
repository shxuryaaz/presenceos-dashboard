import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import MetricsRow from "@/components/dashboard/MetricsRow";
import AlertBanner from "@/components/dashboard/AlertBanner";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import EngagementChart from "@/components/dashboard/EngagementChart";
import ActivityPanel from "@/components/dashboard/ActivityPanel";
import WhosInPanel from "@/components/dashboard/WhosInPanel";
import StudentTable from "@/components/dashboard/StudentTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import { getRiskStudents } from "@/lib/scoring";

export default function Index() {
  const { data } = useDashboardData();
  const students = data?.students ?? [];
  const riskStudents = getRiskStudents(students);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar session={data?.session} />
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-5 space-y-4">
            <AlertBanner riskStudents={riskStudents} />
            <MetricsRow students={students} engagement={data?.engagement} />
            <UpcomingReminders reminders={data?.reminders ?? []} />
            <div className="grid grid-cols-2 gap-4">
              <AttendanceChart dailyAttendance={data?.engagement.daily ?? []} />
              <EngagementChart engagement={data?.engagement} />
            </div>
            <ActivityPanel riskStudents={riskStudents} />
            <StudentTable students={students} />
          </main>

          {/* Right sidebar - Who's in */}
          <aside className="w-[280px] border-l border-border overflow-y-auto flex-shrink-0">
            <WhosInPanel students={students} />
          </aside>
        </div>
      </div>
    </div>
  );
}
