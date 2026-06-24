import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockAssessments, mockRubrics } from "@/lib/mock-data";
import { Plus, TrendingUp, FileText, CheckCircle2, Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — SmartCheck" }] }),
  component: Dashboard,
});

function Dashboard() {
  const avg = Math.round(mockAssessments.reduce((s, a) => s + a.score, 0) / mockAssessments.length);
  const stats = [
    { label: "Total assessments", value: "12", icon: FileText, tone: "text-primary" },
    { label: "Avg. score", value: `${avg}%`, icon: TrendingUp, tone: "text-success" },
    { label: "Rubrics uploaded", value: String(mockRubrics.length), icon: CheckCircle2, tone: "text-primary" },
    { label: "This week", value: "5", icon: Calendar, tone: "text-warning" },
  ];

  const weaknesses = [
    { label: "Thesis", pct: 72 },
    { label: "Coherence", pct: 64 },
    { label: "Citations", pct: 58 },
  ];

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-6xl">
        <PageHeader
          title="Welcome back, Teacher"
          subtitle="Here's what's happening with your assessments today."
          action={
            <Link
              to="/assess"
              className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-lg text-primary-foreground text-sm font-medium"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="size-4" /> New assessment
            </Link>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-4 md:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <s.icon className={`size-5 ${s.tone}`} />
              <div className="text-2xl md:text-3xl font-bold mt-3">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg">Common weaknesses</h3>
              <Link to="/performance" className="text-xs text-primary inline-flex items-center gap-1">View insights <ArrowRight className="size-3" /></Link>
            </div>
            <div className="mt-5 space-y-4">
              {weaknesses.map((w) => (
                <div key={w.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{w.label}</span>
                    <span className="font-medium">{w.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${w.pct}%`, background: "var(--gradient-primary)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-display font-semibold text-lg">Recent feedback</h3>
            <div className="mt-4 space-y-3">
              {mockAssessments.slice(0, 3).map((a) => (
                <Link key={a.id} to="/feedback/$id" params={{ id: a.id }} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/60 transition-colors">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{a.studentName}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.outputTitle}</div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-md bg-success/15 text-success">{a.score}/100</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <Link
          to="/assess"
          className="md:hidden mt-6 flex items-center justify-center gap-2 h-12 rounded-xl text-primary-foreground font-medium"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          <Plus className="size-4" /> New assessment
        </Link>
      </div>
    </AppLayout>
  );
}
