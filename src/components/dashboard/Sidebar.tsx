import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: CalendarCheck, label: "Sessions" },
  { icon: Users, label: "Attendance" },
  { icon: BarChart3, label: "Analytics" },
  { icon: MapPin, label: "Live Locations" },
];

const settingsNav = [
  { icon: Clock, label: "Time Tracking" },
  { icon: Calendar, label: "Schedules" },
  { icon: Briefcase, label: "Activities & Projects" },
  { icon: Building2, label: "Organisation" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">P</span>
        </div>
        {!collapsed && (
          <span className="text-foreground font-semibold text-base tracking-tight">PresenceOS</span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {mainNav.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              item.active
                ? "text-sidebar-active bg-primary/8"
                : "text-sidebar-foreground hover:bg-sidebar-hover"
            }`}
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {/* Settings section */}
        {!collapsed && (
          <div className="pt-4 pb-1 px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Settings
            </span>
          </div>
        )}
        {settingsNav.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover transition-colors"
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-hover transition-colors">
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-hover transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Jane Doe</p>
              <p className="text-xs text-muted-foreground truncate">Oakwood Academy</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
