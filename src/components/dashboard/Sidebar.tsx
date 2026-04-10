import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  Clock,
  Calendar,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: CalendarCheck, label: "Sessions", to: "/sessions" },
  { icon: Users, label: "Attendance", to: "/attendance" },
  { icon: BarChart3, label: "Analytics", to: "/analytics" },
];

const settingsNav = [
  { icon: Clock, label: "Time Tracking", to: "/time-tracking" },
  { icon: Calendar, label: "Schedules", to: "/schedules" },
  { icon: Briefcase, label: "Activities & Projects", to: "/activities-projects" },
  { icon: Building2, label: "Organisation", to: "/organisation" },
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
        <img
          src="/presence-os-logo.png"
          alt="Presence OS logo"
          className="w-8 h-8 rounded-md object-cover"
        />
        {!collapsed && (
          <span className="text-foreground font-extrabold text-base tracking-tight">Presence OS</span>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        {mainNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "text-sidebar-active bg-primary/8"
                  : "text-sidebar-foreground hover:bg-sidebar-hover"
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {/* Settings section */}
        {!collapsed && (
          <div className="pt-4 pb-1 px-3">
            <span className="dashboard-section-title">
              Settings
            </span>
          </div>
        )}
        {settingsNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "text-sidebar-active bg-primary/8"
                  : "text-sidebar-foreground hover:bg-sidebar-hover"
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "text-sidebar-active bg-primary/8"
                : "text-sidebar-foreground hover:bg-sidebar-hover"
            }`
          }
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-sidebar-hover transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Shaurya Singh</p>
              <p className="text-xs text-muted-foreground truncate">
                Noida Institute of Engineering and Technology
              </p>
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
