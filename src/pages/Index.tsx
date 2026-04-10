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

export default function Index() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-5 space-y-4">
            <AlertBanner />
            <MetricsRow />
            <UpcomingReminders />
            <div className="grid grid-cols-2 gap-4">
              <AttendanceChart />
              <EngagementChart />
            </div>
            <ActivityPanel />
            <StudentTable />
          </main>

          {/* Right sidebar - Who's in */}
          <aside className="w-[280px] border-l border-border overflow-y-auto flex-shrink-0">
            <WhosInPanel />
          </aside>
        </div>
      </div>
    </div>
  );
}
