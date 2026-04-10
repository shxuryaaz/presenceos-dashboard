import type { Student } from "@/types";

export function calculateTrustScore(geo: boolean, qr: boolean, vision: boolean): number {
  let score = 0;
  if (geo) score += 30;
  if (qr) score += 30;
  if (vision) score += 40;
  return score;
}

export function getRiskStudents(students: Student[]): Student[] {
  return students.filter((student) => {
    return student.engagementScore < 40 || student.trustScore < 50;
  });
}
