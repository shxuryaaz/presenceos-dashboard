import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardData } from "@/hooks/useDashboardData";
import { markStudentAttendanceFromQr } from "@/lib/mockApi";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { data } = useDashboardData();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const pendingQrToken = window.localStorage.getItem("presenceos_pending_qr") ?? "";
  const pendingQrOpenedAt = Number(window.localStorage.getItem("presenceos_pending_qr_opened_at") ?? "0");
  const withinGrace = pendingQrOpenedAt > 0 && Date.now() - pendingQrOpenedAt <= 2 * 60_000;
  const shouldShowSessionInactive = !data?.session.active && !withinGrace;

  const student = useMemo(() => {
    if (!user?.studentId) return null;
    return data?.students.find((item) => item.id === user.studentId) ?? null;
  }, [data?.students, user?.studentId]);

  const scanMutation = useMutation({
    mutationFn: () => markStudentAttendanceFromQr(user?.studentId ?? "", pendingQrToken),
    onSuccess: () => {
      setMessage("Attendance marked as Present.");
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      window.localStorage.removeItem("presenceos_pending_qr");
      window.localStorage.removeItem("presenceos_pending_qr_opened_at");
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  useEffect(() => {
    if (pendingQrToken && !pendingQrOpenedAt) {
      window.localStorage.setItem("presenceos_pending_qr_opened_at", Date.now().toString());
    }
  }, [pendingQrOpenedAt, pendingQrToken]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Mark Attendance</h1>
          <button
            onClick={logout}
            className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          {shouldShowSessionInactive
            ? "No active attendance session."
            : "Session is active. Tap Mark to submit attendance."}
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
              student?.attendanceStatus === "Present" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            }`}
          >
            {student?.attendanceStatus === "Present" ? "Present" : "Not Marked"}
          </span>
          <span className="text-sm text-foreground">Student: {user?.name}</span>
        </div>
        <button
          onClick={() => scanMutation.mutate()}
          disabled={!pendingQrToken || scanMutation.isPending || student?.attendanceStatus === "Present"}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
        >
          {scanMutation.isPending ? "Marking..." : "Mark"}
        </button>
        {!pendingQrToken ? (
          <p className="text-xs text-muted-foreground">No QR scan link found. Scan the teacher QR code first.</p>
        ) : null}
        {pendingQrToken && !data?.session.active && withinGrace ? (
          <p className="text-xs text-muted-foreground">Grace period active (2 minutes) to complete attendance.</p>
        ) : null}
        {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      </div>
    </div>
  );
}
