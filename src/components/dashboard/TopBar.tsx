import { Bell, ChevronDown } from "lucide-react";
import type { Session } from "@/types";
import type { ReactNode } from "react";

interface TopBarProps {
  session?: Session;
  action?: ReactNode;
}

function formatTimeLeft(endsAt: string): string {
  const end = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((end - now) / 1000));
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function TopBar({ session, action }: TopBarProps) {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-extrabold text-foreground">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center border border-border rounded-md overflow-hidden text-sm">
          <button className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">Day</button>
          <button className="px-3 py-1.5 text-primary font-medium border-b-2 border-primary bg-primary/5">Week</button>
          <button className="px-3 py-1.5 text-muted-foreground hover:bg-muted transition-colors">Month</button>
        </div>

        {/* Filters */}
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
          All classes <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
          All groups <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Session badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Session active</span>
          <span className="text-sm font-mono font-semibold text-foreground">
            {session ? formatTimeLeft(session.endsAt) : "--:--:--"}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-success text-success-foreground text-xs font-medium">
            {session?.isLive ? "Live" : "Idle"}
          </span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Actions */}
        {action}
        <button className="p-2 hover:bg-muted rounded-md transition-colors">
          <Bell className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-xs font-semibold text-primary cursor-pointer">
          SS
        </div>
      </div>
    </header>
  );
}
