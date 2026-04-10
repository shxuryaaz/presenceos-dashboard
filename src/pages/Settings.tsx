import { useQuery } from "@tanstack/react-query";
import TeacherLayout from "@/components/dashboard/TeacherLayout";
import { fetchSettingsModuleData } from "@/lib/mockApi";

export default function SettingsPage() {
  const { data } = useQuery({
    queryKey: ["settings-module"],
    queryFn: fetchSettingsModuleData,
  });

  return (
    <TeacherLayout>
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <h3 className="dashboard-section-title">Settings</h3>
        <p className="text-sm text-foreground">Notifications: {data?.notifications ? "Enabled" : "Disabled"}</p>
        <p className="text-sm text-foreground">QR Rotation: {data?.qrRotationSeconds ?? 60} seconds</p>
        <p className="text-sm text-foreground">Grace Window: {data?.graceWindowMinutes ?? 2} minutes</p>
      </div>
    </TeacherLayout>
  );
}
