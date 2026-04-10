import { calculateTrustScore, getRiskStudents } from "@/lib/scoring";
import type {
  AttendanceRecord,
  AttendanceStatus,
  DashboardData,
  EngagementData,
  RiskFlag,
  Session,
  Student,
} from "@/types";

const firstNames = [
  "Emma",
  "Liam",
  "Sofia",
  "Marcus",
  "Olivia",
  "Noah",
  "Aisha",
  "Devon",
  "Priya",
  "Lucas",
];

const lastNames = ["Wilson", "Chen", "Garcia", "Rivera", "Martin", "Kim", "Khan"];

const SESSION_ID = "session-2026-week-15";
let tick = 0;

function buildStudentNames(): string[] {
  const names: string[] = [];
  for (const firstName of firstNames) {
    for (const lastName of lastNames) {
      names.push(`${firstName} ${lastName}`);
    }
  }
  return names;
}

function avatarFromName(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getStatus(engagementScore: number, trustScore: number): AttendanceStatus {
  if (engagementScore < 35 || trustScore < 45) return "Absent";
  if (engagementScore < 55 || trustScore < 60) return "Late";
  return "Present";
}

function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function getMinuteTime(baseHour: number, minuteOffset: number): string {
  const hour24 = clamp(0, baseHour + Math.floor(minuteOffset / 60), 23);
  const minute = ((minuteOffset % 60) + 60) % 60;
  const suffix = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

function generateStudents(): Student[] {
  const names = buildStudentNames();
  const riskIndexes = new Set([7, 22, 41, 58]);

  return names.map((name, index) => {
    const geoVerified = riskIndexes.has(index) ? index % 2 === 0 : true;
    const qrVerified = riskIndexes.has(index) ? index % 3 === 0 : true;
    const visionVerified = riskIndexes.has(index) ? false : index % 9 !== 0;
    const trustScore = calculateTrustScore(geoVerified, qrVerified, visionVerified);

    const baseline = 92 - (index % 8) * 5;
    const pulse = ((tick + index) % 7) - 3;
    let engagementScore = clamp(45, baseline + pulse, 98);

    if (riskIndexes.has(index)) {
      engagementScore = clamp(18, 31 + pulse, 39);
    }

    const attendanceStatus = getStatus(engagementScore, trustScore);
    const minuteOffset = 40 + (index % 35) + (tick % 4);

    return {
      id: `student-${index + 1}`,
      sessionId: SESSION_ID,
      name,
      avatar: avatarFromName(name),
      attendanceStatus,
      geoVerified,
      qrVerified,
      visionVerified,
      trustScore,
      engagementScore,
      lastSeenAt: getMinuteTime(8, minuteOffset),
    };
  });
}

function buildSession(): Session {
  return {
    id: SESSION_ID,
    className: "Class 10A",
    groupName: "All groups",
    scheduleLabel: "Week",
    startedAt: "2026-04-10T08:00:00.000Z",
    endsAt: "2026-04-10T18:00:00.000Z",
    isLive: true,
  };
}

function buildAttendanceRecords(students: Student[]): AttendanceRecord[] {
  return students.map((student, index) => ({
    id: `attendance-${index + 1}`,
    sessionId: student.sessionId,
    studentId: student.id,
    status: student.attendanceStatus,
    timestamp: `2026-04-10T${(8 + Math.floor(index / 12))
      .toString()
      .padStart(2, "0")}:${(10 + (index % 45)).toString().padStart(2, "0")}:00.000Z`,
    geoVerified: student.geoVerified,
    qrVerified: student.qrVerified,
    visionVerified: student.visionVerified,
  }));
}

function buildEngagementData(students: Student[]): EngagementData {
  const high = students.filter((student) => student.engagementScore >= 75).length;
  const medium = students.filter(
    (student) => student.engagementScore >= 40 && student.engagementScore < 75,
  ).length;
  const low = students.length - high - medium;
  const presentCount = students.filter((student) => student.attendanceStatus === "Present").length;
  const lateCount = students.filter((student) => student.attendanceStatus === "Late").length;
  const absentCount = students.filter((student) => student.attendanceStatus === "Absent").length;

  const weekBase = [1, 2, -1, 0, 1];
  const daily = ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => {
    const drift = weekBase[index] + (tick % 3) - 1;
    const dailyPresent = clamp(0, presentCount + drift, students.length);
    const dailyLate = clamp(0, lateCount - Math.floor(drift / 2), students.length - dailyPresent);
    const dailyAbsent = clamp(0, students.length - dailyPresent - dailyLate, students.length);
    return {
      day,
      present: dailyPresent,
      late: dailyLate,
      absent: dailyAbsent,
    };
  });

  const averageEngagement = Math.round(
    students.reduce((sum, student) => sum + student.engagementScore, 0) / students.length,
  );

  return {
    sessionId: SESSION_ID,
    averageEngagement,
    trendDelta: ((tick % 5) - 2) * 0.6,
    daily,
    distribution: [
      { name: "High", value: high },
      { name: "Medium", value: medium },
      { name: "Low", value: low },
    ],
  };
}

function buildRiskFlags(students: Student[]): RiskFlag[] {
  return getRiskStudents(students).slice(0, 5).map((student, index) => {
    const isTrustRisk = student.trustScore < 50;
    return {
      id: `risk-${student.id}`,
      sessionId: student.sessionId,
      studentId: student.id,
      reason: isTrustRisk ? "Trust score below threshold" : "Low engagement trend",
      severity: student.engagementScore < 30 || student.trustScore < 40 ? "Critical" : "Warning",
      createdAt: `2026-04-10T09:${(5 + index * 7).toString().padStart(2, "0")}:00.000Z`,
    };
  });
}

function createDashboardData(): DashboardData {
  tick += 1;
  const session = buildSession();
  const students = generateStudents();
  const attendanceRecords = buildAttendanceRecords(students);
  const engagement = buildEngagementData(students);
  const riskFlags = buildRiskFlags(students);

  return {
    session,
    students,
    attendanceRecords,
    engagement,
    riskFlags,
    reminders: [
      { id: "reminder-1", dateLabel: "APR", day: "10", text: "End of term assessments begin" },
      { id: "reminder-2", dateLabel: "APR", day: "11", text: "Parent-teacher conferences" },
      { id: "reminder-3", dateLabel: "APR", day: "14", text: "Attendance reports due" },
    ],
  };
}

async function withDelay<T>(data: T): Promise<T> {
  await new Promise((resolve) => window.setTimeout(resolve, 220));
  return data;
}

export async function fetchDashboardData(): Promise<DashboardData> {
  return withDelay(createDashboardData());
}

export async function fetchStudents(): Promise<Student[]> {
  const dashboard = await fetchDashboardData();
  return dashboard.students;
}

export async function fetchSession(): Promise<Session> {
  const dashboard = await fetchDashboardData();
  return dashboard.session;
}

export async function fetchEngagementData(): Promise<EngagementData> {
  const dashboard = await fetchDashboardData();
  return dashboard.engagement;
}
