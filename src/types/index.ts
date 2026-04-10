export type AttendanceStatus = "Present" | "Late" | "Absent" | "Not Marked";
export type UserRole = "Teacher" | "Student";

export interface Student {
  id: string;
  sessionId: string;
  name: string;
  avatar: string;
  role: "Student";
  attendanceStatus: AttendanceStatus;
  geoVerified: boolean;
  qrVerified: boolean;
  visionVerified: boolean;
  trustScore: number;
  engagementScore: number;
  lastSeenAt: string;
}

export interface Session {
  id: string;
  className: string;
  groupName: string;
  scheduleLabel: string;
  startedAt: string;
  endsAt: string;
  isLive: boolean;
  active: boolean;
  qrToken: string;
  expiresAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  timestamp: string;
  geoVerified: boolean;
  qrVerified: boolean;
  visionVerified: boolean;
}

export interface EngagementData {
  sessionId: string;
  averageEngagement: number;
  trendDelta: number;
  daily: Array<{
    day: string;
    present: number;
    late: number;
    absent: number;
  }>;
  distribution: Array<{
    name: "High" | "Medium" | "Low";
    value: number;
  }>;
}

export interface RiskFlag {
  id: string;
  sessionId: string;
  studentId: string;
  reason: string;
  severity: "Critical" | "Warning";
  createdAt: string;
}

export interface Reminder {
  id: string;
  dateLabel: string;
  day: string;
  text: string;
}

export interface DashboardData {
  session: Session;
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  engagement: EngagementData;
  riskFlags: RiskFlag[];
  reminders: Reminder[];
}

export interface AuthUser {
  role: UserRole;
  name: string;
  email?: string;
  studentId?: string;
}
