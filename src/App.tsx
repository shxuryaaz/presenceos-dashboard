import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import ActivitiesProjectsPage from "./pages/ActivitiesProjects.tsx";
import AnalyticsPage from "./pages/Analytics.tsx";
import AttendancePage from "./pages/Attendance.tsx";
import CameraFeedPage from "./pages/CameraFeed.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import OrganisationPage from "./pages/Organisation.tsx";
import SchedulesPage from "./pages/Schedules.tsx";
import SessionsPage from "./pages/Sessions.tsx";
import SettingsPage from "./pages/Settings.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import TimeTrackingPage from "./pages/TimeTracking.tsx";

const queryClient = new QueryClient();

function HomeRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "Student") return <Navigate to="/student" replace />;
  return <Navigate to="/dashboard" replace />;
}

function TeacherRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Teacher") return <Navigate to="/student" replace />;
  return children;
}

function StudentRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Student") return <Navigate to="/dashboard" replace />;
  return <StudentDashboard />;
}

function LoginRoute() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const qrFromQuery = searchParams.get("qr");

  useEffect(() => {
    if (!qrFromQuery) return;
    window.localStorage.setItem("presenceos_pending_qr", qrFromQuery);
    window.localStorage.setItem("presenceos_pending_qr_opened_at", Date.now().toString());
  }, [qrFromQuery]);

  if (user) return <Navigate to="/" replace />;
  return <Login />;
}

function DashboardAutoRefresh() {
  const client = useQueryClient();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      client.invalidateQueries({ queryKey: ["dashboard"] });
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [client]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DashboardAutoRefresh />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/student" element={<StudentRoute />} />
            <Route path="/dashboard" element={<TeacherRoute><Index /></TeacherRoute>} />
            <Route path="/sessions" element={<TeacherRoute><SessionsPage /></TeacherRoute>} />
            <Route path="/attendance" element={<TeacherRoute><AttendancePage /></TeacherRoute>} />
            <Route path="/analytics" element={<TeacherRoute><AnalyticsPage /></TeacherRoute>} />
            <Route path="/time-tracking" element={<TeacherRoute><TimeTrackingPage /></TeacherRoute>} />
            <Route path="/schedules" element={<TeacherRoute><SchedulesPage /></TeacherRoute>} />
            <Route path="/activities-projects" element={<TeacherRoute><ActivitiesProjectsPage /></TeacherRoute>} />
            <Route path="/organisation" element={<TeacherRoute><OrganisationPage /></TeacherRoute>} />
            <Route path="/settings" element={<TeacherRoute><SettingsPage /></TeacherRoute>} />
            <Route path="/camera-feed" element={<TeacherRoute><CameraFeedPage /></TeacherRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
