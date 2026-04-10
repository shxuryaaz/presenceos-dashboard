import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
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
import { startAttendanceSession } from "@/lib/mockApi";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { logout } = useAuth();
  const { data } = useDashboardData();
  const queryClient = useQueryClient();
  const [qrOpen, setQrOpen] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());
  const students = data?.students ?? [];
  const riskStudents = getRiskStudents(students);
  const session = data?.session;

  const startSessionMutation = useMutation({
    mutationFn: startAttendanceSession,
    onSuccess: () => {
      setQrOpen(true);
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const secondsLeft = useMemo(() => {
    if (!session?.expiresAt || !session.active) return 0;
    return Math.max(0, Math.ceil((new Date(session.expiresAt).getTime() - nowMs) / 1000));
  }, [nowMs, session?.active, session?.expiresAt]);

  const scanLink = useMemo(() => {
    if (!session?.qrToken) return "";
    const base = window.location.origin;
    return `${base}/login?role=Student&qr=${encodeURIComponent(session.qrToken)}`;
  }, [session?.qrToken]);

  const qrImageUrl = useMemo(() => {
    if (!scanLink) return "";
    const encoded = encodeURIComponent(scanLink);
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;
  }, [scanLink]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          session={data?.session}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => startSessionMutation.mutate()}
                className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium"
              >
                Take Attendance
              </button>
              <button
                onClick={() => setQrOpen(true)}
                disabled={!session?.active}
                className="px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground disabled:opacity-50"
              >
                Show QR
              </button>
              <Link
                to="/camera-feed"
                className="px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground"
              >
                View Camera Feed
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          }
        />
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

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance QR</DialogTitle>
            <DialogDescription>
              Share this QR token with students. It rotates every 60 seconds.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted border border-border rounded-md p-4">
            {qrImageUrl ? (
              <div className="mb-3 flex justify-center">
                <img src={qrImageUrl} alt="Attendance QR code" className="w-[180px] h-[180px] rounded-md border border-border bg-white p-2" />
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground mb-2">Current token</p>
            <p className="text-sm font-mono break-all text-foreground">{session?.qrToken ?? "No active token"}</p>
            <p className="text-xs text-muted-foreground mt-3 mb-2">Scan link</p>
            <p className="text-xs break-all text-foreground">{scanLink || "No active link"}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Expires in: {secondsLeft}s
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
