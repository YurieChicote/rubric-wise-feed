import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Upload, History, User, FileText, TrendingUp, GraduationCap } from "lucide-react";
import { type ReactNode } from "react";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/rubrics", label: "Rubrics", icon: FileText },
  { to: "/assess", label: "Assess", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/performance", label: "Insights", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
];

const mobileNav = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/assess", label: "Upload", icon: Upload },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="size-10 rounded-xl grid place-items-center" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">SmartCheck</div>
            <div className="text-[11px] text-muted-foreground mt-1">Assessment Feedback</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((it) => {
            const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <it.icon className="size-4" />
                {it.label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="text-sm font-medium mt-0.5">teacher@neu.edu.ph</div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children ?? <Outlet />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar/95 backdrop-blur border-t border-sidebar-border">
        <div className="grid grid-cols-4">
          {mobileNav.map((it) => {
            const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <it.icon className="size-5" />
                {it.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
