import type { Reminder } from "@/types";

interface UpcomingRemindersProps {
  reminders: Reminder[];
}

export default function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="dashboard-section-title mb-4">
        Upcoming Reminders
      </h3>
      <div className="flex items-start gap-6">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-start gap-3">
            <div className="text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                {reminder.dateLabel}
              </p>
              <p className="text-xl font-semibold text-foreground leading-tight">{reminder.day}</p>
            </div>
            <div className="border-l border-border pl-3">
              <p className="text-sm text-foreground">{reminder.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
