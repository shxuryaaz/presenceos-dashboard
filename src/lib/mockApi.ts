import { calculateTrustScore, getRiskStudents } from "@/lib/scoring";
import { getAttendanceTrend, getDashboardMetrics, getEngagementDistribution } from "@/lib/selectors";
import type {
  AttendanceRecord,
  AttendanceStatus,
  AuthUser,
  DashboardData,
  EngagementData,
  RiskFlag,
  Session,
  Student,
  UserRole,
} from "@/types";

const studentNames = [
  "Aarav Menon", "Vihaan Kulkarni", "Aditya Sethi", "Arjun Bhat", "Ishaan Purohit",
  "Ananya Rao", "Diya Kapoor", "Kavya Nambiar", "Riya Srivastava", "Meera Singh",
  "Rohan Naidu", "Saanvi Iyer", "Pranav Joshi", "Aditi Chawla", "Tanvi Bhargava",
  "Nikhil Banerjee", "Yash Agrawal", "Sneha Pillai", "Harsh Vardhan", "Pooja Das",
  "Kunal Trivedi", "Ira Malhotra", "Tanishq Arora", "Navya Bansal", "Aryan Mishra",
  "Ritika Jindal", "Devansh Soni", "Ira Deshmukh", "Parth Bedi", "Simran Ahuja",
  "Naman Kohli", "Siya Dutta", "Krish Choudhary", "Prisha Bajaj", "Arnav Ghosh",
  "Ayesha Farooqui", "Dhruv Bhandari", "Mahi Batra", "Lakshya Jain", "Ishita Luthra",
  "Vedant Khurana", "Rudra Shekhar", "Myra Narang", "Aarohi Chatterjee", "Raghav Anand",
  "Samaira Tripathi", "Shaurya Mehta", "Naira Bhaskar", "Reyansh Tandon", "Anika Wadhwa",
  "Vivaan Anand", "Ritvik Nanda", "Zoya Hashmi", "Hriday Sharma", "Aarna Rathi",
  "Yuvraj Talwar", "Diya Pradhan", "Krisha Yadav", "Abeer Chandra", "Suhani Oberoi",
  "Kabir Solanki", "Manya Sehgal", "Devika Thomas", "Atharv Dubey", "Nysa Kapoor",
  "Ayaan Qureshi", "Jiya Kamat", "Veer Narula", "Nivaan Khandelwal", "Tara Fernandes",
];
const teacherNames = [
  "Anita Sharma",
  "Rajesh Kumar",
  "Priyanka Iyer",
  "Vikram Singh",
  "Neha Patel",
  "Shaurya Mehta",
];
const TEACHER_EMAIL = "0251cse310@niet.co.in";
const STUDENT_EMAIL = "0251cse317@niet.co.in";
const LOGIN_PASSWORD = "shaurya1234";
const FIXED_STUDENT_NAME = "Saksham Bhardwaj";

const SESSION_ID = "session-2026-week-15";
let tick = 0;

function buildStudentNames(): string[] {
  return studentNames.slice(0, 70);
}

function avatarFromName(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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

function createBaseStudents(): Student[] {
  const names = buildStudentNames();
  const riskIndexes = new Set([7, 22, 41, 58, 63]);
  const lateIndexes = new Set([3, 15, 28, 49, 66]);

  return names.map((name, index) => {
    const geoVerified = false;
    const qrVerified = index % 9 !== 0;
    const visionVerified = riskIndexes.has(index) ? false : index % 7 !== 0;
    const trustScore = calculateTrustScore(geoVerified, qrVerified, visionVerified);

    const baseline = 92 - (index % 8) * 5;
    const pulse = ((tick + index) % 7) - 3;
    let engagementScore = clamp(45, baseline + pulse, 98);

    if (riskIndexes.has(index)) {
      engagementScore = clamp(18, 31 + pulse, 39);
    }

    const attendanceStatus: AttendanceStatus = riskIndexes.has(index)
      ? "Absent"
      : lateIndexes.has(index)
        ? "Late"
        : qrVerified
          ? "Present"
          : "Not Marked";
    const minuteOffset = 40 + (index % 35) + (tick % 4);

    return {
      id: `student-${index + 1}`,
      sessionId: SESSION_ID,
      name,
      avatar: avatarFromName(name),
      role: "Student",
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

function createQrToken(sessionId: string): string {
  return `QR|${sessionId}|${Date.now()}`;
}

function createDefaultSession(): Session {
  const startedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 60_000).toISOString();
  return {
    id: SESSION_ID,
    className: "Class 10A",
    groupName: "All groups",
    scheduleLabel: "Week",
    startedAt,
    endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    isLive: true,
    active: false,
    qrToken: createQrToken(SESSION_ID),
    expiresAt,
  };
}

const store: {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  session: Session;
  studentEmailMap: Record<string, string>;
} = {
  students: createBaseStudents(),
  attendanceRecords: [],
  session: createDefaultSession(),
  studentEmailMap: {},
};

function seedInitialAttendanceRecords() {
  if (store.attendanceRecords.length > 0) return;
  store.attendanceRecords = store.students
    .filter((student) => student.attendanceStatus === "Present" || student.attendanceStatus === "Late")
    .map((student, index) => ({
      id: `attendance-${index + 1}`,
      sessionId: SESSION_ID,
      studentId: student.id,
      status: student.attendanceStatus,
      timestamp: new Date(Date.now() - (index % 55) * 60_000).toISOString(),
      geoVerified: false,
      qrVerified: student.qrVerified,
      visionVerified: student.visionVerified,
    }));
}

function rotateQrIfExpired(): void {
  if (!store.session.active) return;
  const expiresAt = new Date(store.session.expiresAt).getTime();
  if (Date.now() < expiresAt) return;
  store.session.qrToken = createQrToken(store.session.id);
  store.session.expiresAt = new Date(Date.now() + 60_000).toISOString();
}

function recalculateAttendanceFromRecords(): void {
  const latestByStudent = new Map<string, AttendanceRecord>();
  for (const record of store.attendanceRecords) {
    latestByStudent.set(record.studentId, record);
  }

  store.students = store.students.map((student) => {
    const record = latestByStudent.get(student.id);
    const attendanceStatus: AttendanceStatus = record ? "Present" : "Not Marked";
    const qrVerified = Boolean(record?.qrVerified);
    const trustScore = calculateTrustScore(false, qrVerified, student.visionVerified);
    return {
      ...student,
      attendanceStatus,
      qrVerified,
      trustScore,
      lastSeenAt: record ? getMinuteTime(8, 30 + (tick % 30)) : student.lastSeenAt,
    };
  });
}

function simulateActivityPulse(): void {
  tick += 1;
  store.students = store.students.map((student, index) => {
    const jitter = ((tick + index) % 5) - 2;
    const engagementScore = student.attendanceStatus === "Present"
      ? clamp(35, student.engagementScore + jitter, 98)
      : clamp(20, student.engagementScore + jitter, 70);
    return {
      ...student,
      engagementScore,
    };
  });
}

function buildEngagementData(students: Student[]): EngagementData {
  const daily = getAttendanceTrend(students, tick);

  const averageEngagement = Math.round(
    students.reduce((sum, student) => sum + student.engagementScore, 0) / students.length,
  );

  return {
    sessionId: SESSION_ID,
    averageEngagement,
    trendDelta: ((tick % 5) - 2) * 0.6,
    daily,
    distribution: getEngagementDistribution(students),
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
  seedInitialAttendanceRecords();
  rotateQrIfExpired();
  simulateActivityPulse();
  recalculateAttendanceFromRecords();

  const engagement = buildEngagementData(store.students);
  const riskFlags = buildRiskFlags(store.students);

  return {
    session: { ...store.session },
    students: store.students,
    attendanceRecords: store.attendanceRecords,
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

export async function fetchSessionsModuleData() {
  const dashboard = createDashboardData();
  return withDelay({
    activeSession: dashboard.session,
    pastSessions: [
      { id: "session-2026-week-14", date: "2026-04-09", present: 61, absent: 9 },
      { id: "session-2026-week-13", date: "2026-04-08", present: 58, absent: 12 },
    ],
  });
}

export async function fetchAttendanceModuleData() {
  const dashboard = createDashboardData();
  return withDelay({
    roster: dashboard.students,
    records: dashboard.attendanceRecords,
  });
}

export async function fetchAnalyticsModuleData() {
  const dashboard = createDashboardData();
  return withDelay({
    metrics: getDashboardMetrics(dashboard.students),
    engagement: dashboard.engagement,
    risk: dashboard.riskFlags,
  });
}

export async function fetchLiveLocationsModuleData() {
  const dashboard = createDashboardData();
  const metrics = getDashboardMetrics(dashboard.students);
  return withDelay({
    branches: [
      { name: "Main Block", inCount: Math.max(0, metrics.present - 8), alerts: 1 },
      { name: "Lab Wing", inCount: 8, alerts: 0 },
      { name: "Library Zone", inCount: 5, alerts: 1 },
    ],
    checkins: dashboard.students.slice(0, 10).map((student, index) => ({
      studentId: student.id,
      name: student.name,
      location: index % 2 === 0 ? "Main Block" : "Lab Wing",
      time: student.lastSeenAt,
    })),
  });
}

export async function fetchTimeTrackingModuleData() {
  const dashboard = createDashboardData();
  return withDelay({
    entries: dashboard.students.slice(0, 20).map((student, index) => ({
      studentId: student.id,
      name: student.name,
      inTime: `08:${(10 + (index % 40)).toString().padStart(2, "0")}`,
      outTime: student.attendanceStatus === "Present" ? "--" : `13:${(15 + (index % 30)).toString().padStart(2, "0")}`,
      trackedMinutes: student.attendanceStatus === "Present" ? 250 + (index % 40) : 180 + (index % 20),
    })),
  });
}

export async function fetchSchedulesModuleData() {
  return withDelay({
    week: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => ({
      day,
      subject: ["Data Structures", "DBMS", "Operating Systems", "Networks", "AI Lab"][index],
      room: `CSE-${201 + index}`,
      time: `${9 + index}:00 - ${10 + index}:00`,
    })),
  });
}

export async function fetchActivitiesProjectsModuleData() {
  return withDelay({
    activities: [
      { name: "Mini Project Sprint", status: "Ongoing", participation: 64 },
      { name: "Attendance Audit", status: "Review", participation: 70 },
      { name: "Hackathon Prep", status: "Planned", participation: 42 },
    ],
  });
}

export async function fetchOrganisationModuleData() {
  return withDelay({
    groups: [
      { name: "CSE-A", students: 35 },
      { name: "CSE-B", students: 35 },
    ],
    admins: teacherNames,
  });
}

export async function fetchSettingsModuleData() {
  return withDelay({
    notifications: true,
    qrRotationSeconds: 60,
    graceWindowMinutes: 2,
  });
}

export async function fetchStudents(): Promise<Student[]> {
  const dashboard = await fetchDashboardData();
  return dashboard.students;
}

export async function fetchSession(): Promise<Session> {
  rotateQrIfExpired();
  return withDelay({ ...store.session });
}

export async function fetchEngagementData(): Promise<EngagementData> {
  const dashboard = await fetchDashboardData();
  return dashboard.engagement;
}

function normalizeEmail(raw: string): string {
  return raw.replace(/\s+/g, "").toLowerCase();
}

export async function loginUser(role: UserRole, emailInput: string, password: string): Promise<AuthUser> {
  const email = normalizeEmail(emailInput);
  if (password !== LOGIN_PASSWORD) {
    throw new Error("Invalid password");
  }

  if (role === "Teacher") {
    if (email !== TEACHER_EMAIL) {
      throw new Error("Invalid teacher email");
    }
    return withDelay({ role, name: "Shaurya Singh", email });
  }

  if (email !== STUDENT_EMAIL) {
    throw new Error("Invalid student email");
  }

  let student = store.students.find((item) => item.name === FIXED_STUDENT_NAME);
  if (!student) {
    student = {
      ...store.students[0],
      name: FIXED_STUDENT_NAME,
      avatar: avatarFromName(FIXED_STUDENT_NAME),
    };
    store.students[0] = student;
  }

  store.studentEmailMap[email] = student.id;
  return withDelay({ role, name: student.name, email, studentId: student.id });
}

export async function startAttendanceSession(): Promise<Session> {
  store.session.active = true;
  store.session.isLive = true;
  store.session.startedAt = new Date().toISOString();
  store.session.qrToken = createQrToken(store.session.id);
  store.session.expiresAt = new Date(Date.now() + 60_000).toISOString();
  return withDelay({ ...store.session });
}

export async function endAttendanceSession(): Promise<Session> {
  store.session.active = false;
  store.session.isLive = false;
  return withDelay({ ...store.session });
}

export async function markStudentAttendanceFromQr(studentId: string, qrToken: string): Promise<AttendanceRecord> {
  rotateQrIfExpired();

  const now = Date.now();
  const normalizedToken = decodeURIComponent(qrToken).trim();
  const isCurrentToken = normalizedToken === store.session.qrToken;
  const isExpired = now > new Date(store.session.expiresAt).getTime();
  const tokenTimestampMatch = normalizedToken.match(/(\d{10,})$/);
  const tokenIssuedAtRaw = tokenTimestampMatch ? Number(tokenTimestampMatch[1]) : 0;
  const tokenWithinGrace =
    Number.isFinite(tokenIssuedAtRaw) && tokenIssuedAtRaw > 0 && now - tokenIssuedAtRaw <= 2 * 60_000;

  const openedAtRaw = Number(window.localStorage.getItem("presenceos_pending_qr_opened_at") ?? "0");
  const openedWithinGrace = Number.isFinite(openedAtRaw) && openedAtRaw > 0 && now - openedAtRaw <= 2 * 60_000;
  const withinGrace = tokenWithinGrace || openedWithinGrace;

  if (!store.session.active && !withinGrace) {
    throw new Error("Attendance session is not active");
  }

  if (store.session.active && (!isCurrentToken || isExpired)) {
    throw new Error("QR code is invalid or expired");
  }

  if (!store.session.active && !normalizedToken.includes(store.session.id)) {
    throw new Error("QR code is invalid or expired");
  }

  const student = store.students.find((item) => item.id === studentId);
  if (!student) {
    throw new Error("Student not found");
  }

  const nowIso = new Date().toISOString();
  const existing = store.attendanceRecords.find((record) => record.studentId === studentId);
  const record: AttendanceRecord = {
    id: existing?.id ?? `attendance-${store.attendanceRecords.length + 1}`,
    sessionId: store.session.id,
    studentId,
    status: "Present",
    timestamp: nowIso,
    geoVerified: false,
    qrVerified: true,
    visionVerified: student.visionVerified,
  };

  if (existing) {
    store.attendanceRecords = store.attendanceRecords.map((item) =>
      item.studentId === studentId ? record : item,
    );
  } else {
    store.attendanceRecords.push(record);
  }

  recalculateAttendanceFromRecords();
  return withDelay(record);
}

export function __resetMockStoreForTests() {
  tick = 0;
  store.students = createBaseStudents();
  store.attendanceRecords = [];
  store.session = createDefaultSession();
  store.studentEmailMap = {};
  seedInitialAttendanceRecords();
}
