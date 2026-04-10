import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchAttendanceModuleData } from "@/lib/mockApi";

export default function AttendancePage() {
  const { data } = useQuery({
    queryKey: ["attendance-module"],
    queryFn: fetchAttendanceModuleData,
  });

  return (
    <TeacherLayout>
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="dashboard-section-title mb-3">Attendance Roster</h3>
        <div className="space-y-2 max-h-[520px] overflow-y-auto">
          {data?.roster.map((student) => (
            <div key={student.id} className="flex items-center justify-between border-b border-border pb-2 text-sm">
              <span className="text-foreground">{student.name}</span>
              <span
                className={
                  student.attendanceStatus === "Present"
                    ? "text-success"
                    : student.attendanceStatus === "Late"
                      ? "text-warning"
                      : "text-muted-foreground"
                }
              >
                {student.attendanceStatus}
              </span>
              <span className="text-muted-foreground">Trust {student.trustScore}</span>
            </div>
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
