import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const roleFromQuery = searchParams.get("role");
  const qrFromQuery = searchParams.get("qr");
  const [role, setRole] = useState<UserRole>(roleFromQuery === "Student" ? "Student" : "Teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = await login(role, email, password);
    setSubmitting(false);
    if (!ok) {
      setError(
        role === "Student"
          ? "Invalid credentials. Use 0251cse317@niet.co.in and password."
          : "Invalid credentials. Use 0251cse310@niet.co.in and password.",
      );
      return;
    }
    if (qrFromQuery) {
      window.localStorage.setItem("presenceos_pending_qr", qrFromQuery);
      window.localStorage.setItem("presenceos_pending_qr_opened_at", Date.now().toString());
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-md bg-card border border-border rounded-lg p-6 space-y-5">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <img src="/presence-os-logo.png" alt="Presence OS logo" className="w-10 h-10 rounded-md object-cover" />
            <img src="/niet-logo.png" alt="NIET logo" className="h-10 w-auto object-contain" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Presence OS Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in as Teacher or Student</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Role</label>
          <div className="flex items-center border border-border rounded-md overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setRole("Teacher")}
              className={`flex-1 px-3 py-2 transition-colors ${
                role === "Teacher" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => setRole("Student")}
              className={`flex-1 px-3 py-2 transition-colors ${
                role === "Student" ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Student
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={
              role === "Teacher" ? "0251cse310@niet.co.in" : "0251cse317@niet.co.in"
            }
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {role === "Student" ? (
            <p className="text-xs text-muted-foreground">Example: 0251cse317@niet.co.in</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="shaurya1234"
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {error ? <p className="text-xs text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting || !email.trim() || !password.trim()}
          className="w-full px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
