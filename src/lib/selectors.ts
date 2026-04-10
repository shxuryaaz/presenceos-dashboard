import { getRiskStudents } from "@/lib/scoring";
import type { AttendanceRecord, EngagementData, Student } from "@/types";

function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function getDashboardMetrics(students: Student[]) {
  const total = students.length;
  const present = students.filter((student) => student.attendanceStatus === "Present").length;
  const late = students.filter((student) => student.attendanceStatus === "Late").length;
  const out = students.filter(
    (student) => student.attendanceStatus === "Absent" || student.attendanceStatus === "Not Marked",
  ).length;
  const atRisk = getRiskStudents(students).length;
  return { total, present, late, out, atRisk };
}

export function getAttendanceTrend(students: Student[], tick: number): EngagementData["daily"] {
  const metrics = getDashboardMetrics(students);
  const weekBase = [2, 3, 1, 0, 2];
  return ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
    const drift = weekBase[index] + (tick % 3) - 1;
    const present = clamp(0, metrics.present + drift, students.length);
    const late = clamp(0, metrics.late + Math.floor((2 - drift) / 2), students.length - present);
    const absent = clamp(0, students.length - present - late, students.length);
    return { day, present, late, absent };
  });
}

export function getEngagementDistribution(students: Student[]): EngagementData["distribution"] {
  const high = students.filter((student) => student.engagementScore >= 75).length;
  const medium = students.filter(
    (student) => student.engagementScore >= 40 && student.engagementScore < 75,
  ).length;
  const low = students.length - high - medium;
  return [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ];
}

export function buildAttendanceHistory(records: AttendanceRecord[], students: Student[]) {
  const studentMap = new Map(students.map((student) => [student.id, student]));
  return records
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .map((record) => ({
      ...record,
      studentName: studentMap.get(record.studentId)?.name ?? "Unknown Student",
    }));
}
