import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import {
  Plus,
  TrendingUp,
  FileText,
  CheckCircle2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

type Assessment = {
  id: string;
  studentName: string;
  outputTitle: string;
  rubricName: string;
  score: number;
  feedback: string;
  approved: boolean;
  createdAt: string;
};

type Task = {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  due: string;
  description: string;
  rubric: string;
};

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const user = localStorage.getItem("smartcheck_user");

    if (!user) {
      throw redirect({
        to: "/auth",
      });
    }
  },

  head: () => ({
    meta: [{ title: "Dashboard — SmartCheck" }],
  }),

  component: Dashboard,
});

function Dashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [assessmentsResponse, tasksResponse] = await Promise.all([
          fetch("http://127.0.0.1:4000/api/assessments"),
          fetch("http://127.0.0.1:4000/api/tasks"),
        ]);

        if (assessmentsResponse.ok) {
          const data = await assessmentsResponse.json();
          setAssessments(data.assessments ?? data);
        }

        if (tasksResponse.ok) {
          const data = await tasksResponse.json();
          setTasks(data.tasks ?? data);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const averageScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((sum, assessment) => sum + assessment.score, 0) /
            assessments.length
        )
      : 0;

  const thisWeek = assessments.filter((assessment) => {
    const created = new Date(assessment.createdAt);
    const now = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(now.getDate() - 7);

    return created >= sevenDaysAgo;
  }).length;

  const stats = [
    {
      label: "Total assessments",
      value: String(assessments.length),
      icon: FileText,
      tone: "text-primary",
    },
    {
      label: "Avg. score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      tone: "text-success",
    },
    {
      label: "Rubrics uploaded",
      value: String(tasks.length),
      icon: CheckCircle2,
      tone: "text-primary",
    },
    {
      label: "This week",
      value: String(thisWeek),
      icon: Calendar,
      tone: "text-warning",
    },
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
            <div
              key={s.label}
              className="rounded-2xl bg-card border border-border p-4 md:p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <s.icon className={`size-5 ${s.tone}`} />

              <div className="text-2xl md:text-3xl font-bold mt-3">
                {loading ? "..." : s.value}
              </div>

              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-4">
          <div
            className="lg:col-span-2 rounded-2xl bg-card border border-border p-5 md:p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg">
                Common weaknesses
              </h3>

              <Link
                to="/performance"
                className="text-xs text-primary inline-flex items-center gap-1"
              >
                View insights
                <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {weaknesses.map((w) => (
                <div key={w.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {w.label}
                    </span>

                    <span className="font-medium">{w.pct}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${w.pct}%`,
                        background: "var(--gradient-primary)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl bg-card border border-border p-5 md:p-6"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <h3 className="font-display font-semibold text-lg">
              Recent feedback
            </h3>

            <div className="mt-4 space-y-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading assessments...
                </p>
              ) : assessments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No assessments yet.
                </p>
              ) : (
                assessments.slice(0, 3).map((a) => (
                  <Link
                    key={a.id}
                    to="/feedback/$id"
                    params={{ id: a.id }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {a.studentName}
                      </div>

                      <div className="text-xs text-muted-foreground truncate">
                        {a.outputTitle}
                      </div>
                    </div>

                    <span className="shrink-0 text-xs font-semibold px-2 py-1 rounded-md bg-success/15 text-success">
                      {a.score}/100
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        <Link
          to="/assess"
          className="md:hidden mt-6 flex items-center justify-center gap-2 h-12 rounded-xl text-primary-foreground font-medium"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Plus className="size-4" /> New assessment
        </Link>
      </div>
    </AppLayout>
  );
}