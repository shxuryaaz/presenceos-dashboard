import { Bell, ChevronDown, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
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
          <span className="text-sm font-mono font-semibold text-foreground">02:34:12</span>
          <span className="px-2.5 py-0.5 rounded-full bg-success text-success-foreground text-xs font-medium">
            Live
          </span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Actions */}
        <button className="p-2 hover:bg-muted rounded-md transition-colors">
          <Bell className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-xs font-semibold text-primary cursor-pointer">
          JD
        </div>
      </div>
    </header>
  );
}
