import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { apiRequest } from "@/lib/api";
import type { Assessment, Rubric } from "@/lib/mock-data";
import { Plus, TrendingUp, FileText, CheckCircle2, Calendar, ArrowRight, Sparkles, Clock3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — SmartCheck" }] }),
  component: Dashboard,
});

function Dashboard() {
  if (typeof window !== "undefined" && sessionStorage.getItem("smartcheck-session-active-v2") !== "true") {
    return <Navigate to="/auth" />;
  }

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [rubrics] = useState<Rubric[]>([{ id: "r1", name: "Essay Rubric Q1", subject: "English 11", filename: "essay_rubric.pdf", size: "128 KB", uploadedAt: "Jun 8, 2026" }, { id: "r2", name: "Reflection Paper", subject: "Humanities", filename: "reflection.pdf", size: "94 KB", uploadedAt: "Jun 5, 2026" }, { id: "r3", name: "Written Report", subject: "Science 10", filename: "report_rubric.docx", size: "76 KB", uploadedAt: "May 30, 2026" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { apiRequest<{ assessments: Assessment[] }>("/api/assessments").then((result) => setAssessments(result.assessments)).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load assessments.")).finally(() => setLoading(false)); }, []);
  const avg = assessments.length ? Math.round(assessments.reduce((s, a) => s + a.score, 0) / assessments.length) : 0;
  const stats = [
    { label: "Total assessments", value: String(assessments.length), icon: FileText, tone: "text-primary" },
    { label: "Avg. score", value: `${avg}%`, icon: TrendingUp, tone: "text-success" },
    { label: "Rubrics uploaded", value: String(rubrics.length), icon: CheckCircle2, tone: "text-primary" },
    { label: "This week", value: String(assessments.length), icon: Calendar, tone: "text-warning" },
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
          subtitle="Review your assessment activity and priorities for today."
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

        <div className="mb-6 rounded-2xl overflow-hidden text-primary-foreground" style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-glow)" }}>
          <div className="p-5 md:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary-foreground/65"><Sparkles className="size-3.5" /> Assessment overview</div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mt-3">A clear view of every learner.</h2>
              <p className="text-sm text-primary-foreground/70 mt-2 max-w-md">Five assessments are scheduled for review this week. Maintain timely and meaningful feedback.</p>
            </div>
            <Link to="/assess" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/12 border border-white/20 px-4 h-10 text-sm font-medium hover:bg-white/20 transition-colors"><Plus className="size-4" /> Create assessment</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-card border border-border p-4 md:p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <s.icon className={`size-5 ${s.tone}`} />
              <div className="text-2xl md:text-3xl font-bold mt-3">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground py-8"><Loader2 className="size-4 animate-spin" /> Loading your assessment activity...</div>}
        {error && <div role="alert" className="rounded-xl bg-destructive/10 text-destructive p-4 text-sm mt-4">{error} Start the API with <strong>npm run server</strong> to load live data.</div>}
        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-2 rounded-xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
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

          <div className="rounded-xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between"><h3 className="font-display font-semibold text-lg">Recent feedback</h3><Clock3 className="size-4 text-muted-foreground" /></div>
            <div className="mt-4 space-y-3">
              {assessments.slice(0, 3).map((a) => (
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
