import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetMockStoreForTests,
  endAttendanceSession,
  loginUser,
  markStudentAttendanceFromQr,
  startAttendanceSession,
} from "@/lib/mockApi";

describe("attendance QR flow", () => {
  beforeEach(() => {
    __resetMockStoreForTests();
    window.localStorage.removeItem("presenceos_pending_qr_opened_at");
    window.localStorage.removeItem("presenceos_pending_qr");
  });

  it("allows marking during grace window after session ends", async () => {
    const user = await loginUser("Student", "0251cse317@niet.co.in", "shaurya1234");
    const session = await startAttendanceSession();
    window.localStorage.setItem("presenceos_pending_qr_opened_at", Date.now().toString());
    await endAttendanceSession();

    const record = await markStudentAttendanceFromQr(user.studentId!, session.qrToken);
    expect(record.status).toBe("Present");
    expect(record.qrVerified).toBe(true);
  });

  it("rejects stale QR outside grace window", async () => {
    const user = await loginUser("Student", "0251cse317@niet.co.in", "shaurya1234");
    const session = await startAttendanceSession();
    await endAttendanceSession();
    window.localStorage.setItem(
      "presenceos_pending_qr_opened_at",
      (Date.now() - 10 * 60_000).toString(),
    );
    const staleToken = session.qrToken.replace(/\d+$/, String(Date.now() - 10 * 60_000));

    await expect(markStudentAttendanceFromQr(user.studentId!, staleToken)).rejects.toThrow(
      "Attendance session is not active",
    );
  });
});
