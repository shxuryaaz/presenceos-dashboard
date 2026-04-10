const reminders = [
  { date: "APR", day: "10", text: "End of term assessments begin" },
  { date: "APR", day: "11", text: "Parent-teacher conferences" },
  { date: "APR", day: "14", text: "Attendance reports due" },
];

export default function UpcomingReminders() {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Upcoming Reminders
      </h3>
      <div className="flex items-start gap-6">
        {reminders.map((r, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="text-center">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{r.date}</p>
              <p className="text-xl font-semibold text-foreground leading-tight">{r.day}</p>
            </div>
            <div className="border-l border-border pl-3">
              <p className="text-sm text-foreground">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
