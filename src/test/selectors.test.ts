import { describe, expect, it } from "vitest";
import { getAttendanceTrend, getDashboardMetrics } from "@/lib/selectors";
import type { Student } from "@/types";

const makeStudent = (id: string, status: Student["attendanceStatus"]): Student => ({
  id,
  sessionId: "s1",
  name: `Student ${id}`,
  avatar: "ST",
  role: "Student",
  attendanceStatus: status,
  geoVerified: false,
  qrVerified: status === "Present",
  visionVerified: true,
  trustScore: 40,
  engagementScore: 60,
  lastSeenAt: "9:00 am",
});

describe("selectors", () => {
  it("computes dashboard metrics from attendance statuses", () => {
    const students = [
      makeStudent("1", "Present"),
      makeStudent("2", "Present"),
      makeStudent("3", "Late"),
      makeStudent("4", "Absent"),
      makeStudent("5", "Not Marked"),
    ];
    const metrics = getDashboardMetrics(students);
    expect(metrics.total).toBe(5);
    expect(metrics.present).toBe(2);
    expect(metrics.late).toBe(1);
    expect(metrics.out).toBe(2);
  });

  it("builds five-day attendance trend", () => {
    const students = Array.from({ length: 20 }, (_, index) =>
      makeStudent(String(index), index < 12 ? "Present" : "Not Marked"),
    );
    const trend = getAttendanceTrend(students, 2);
    expect(trend).toHaveLength(5);
    expect(trend.every((item) => item.present + item.late + item.absent === 20)).toBe(true);
  });
});
