import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — SmartCheck" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("teacher@neu.edu.ph");
  const [password, setPassword] = useState("password");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center gap-3 text-primary-foreground">
          <div className="size-10 rounded-xl bg-white/15 grid place-items-center backdrop-blur">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-display font-bold text-lg">SmartCheck</span>
        </div>
        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">Rubric-aligned feedback, generated in seconds.</h2>
          <p className="mt-4 text-primary-foreground/80">Upload your rubric and student outputs. SmartCheck retrieves your criteria and produces consistent, teacher-reviewable feedback.</p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { k: "12", v: "Assessments" },
              { k: "84%", v: "Avg. score" },
              { k: "3", v: "Rubrics" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl bg-white/10 backdrop-blur p-4">
                <div className="text-2xl font-bold text-primary-foreground">{s.k}</div>
                <div className="text-xs text-primary-foreground/80 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground/70 relative z-10">© 2026 SmartCheck · New Era University</div>
        <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">SmartCheck</span>
          </div>
          <h1 className="font-display text-3xl font-bold">SmartCheck</h1>
          <p className="text-muted-foreground mt-1">Assessment Feedback System</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="teacher@neu.edu.ph"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-lg text-primary-foreground font-medium transition-transform active:scale-[0.99]"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Log in
            </button>
            <div className="text-center">
              <Link to="/" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-10 text-center">
            For teacher accounts only. Contact your administrator for access.
          </p>
        </form>
      </div>
    </div>
  );
}
