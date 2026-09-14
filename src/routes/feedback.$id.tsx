import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import type { Assessment } from "@/lib/mock-data";
import { ArrowLeft, Pencil, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/feedback/$id")({
  head: () => ({ meta: [{ title: "Feedback — SmartCheck" }] }),
  loader: async ({ params }) => {
  const response = await fetch(
    `http://127.0.0.1:4000/api/assessments/${params.id}`
  );

  if (!response.ok) {
    throw notFound();
  }

  const data = await response.json();

  return data.assessment ?? data;
},
  component: FeedbackPage,
  errorComponent: () => <div className="p-8">Could not load feedback.</div>,
  notFoundComponent: () => (
    <AppLayout>
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Assessment not found.</p>
        <Link to="/history" className="text-primary text-sm">Back to history</Link>
      </div>
    </AppLayout>
  ),
});

function FeedbackPage() {
  const a = Route.useLoaderData() as Assessment;

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-4xl">
        <Link to="/history" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" /> Back to history
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{a.studentName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary text-xs font-medium">{a.outputTitle}</span>
              <span className="text-xs text-muted-foreground">Based on: {a.rubricName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">Suggested score</div>
            <div className="px-3 py-1.5 rounded-lg bg-success/15 text-success font-bold text-lg">{a.score} / 100</div>
            <button className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"><Pencil className="size-4" /></button>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Sparkles className="size-4" /> AI-generated feedback
          </div>
          <p className="mt-3 text-sm md:text-base leading-relaxed text-foreground/90">{a.feedback}</p>
        </div>

        <h3 className="font-display font-semibold text-lg mt-8 mb-4">Rubric criteria</h3>
        <div className="space-y-3">
          {a.criteria.map((c) => {
            const pct = Math.round((c.score / c.max) * 100);
            return (
              <div key={c.name} className="rounded-xl bg-card border border-border p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-sm tabular-nums font-semibold">{c.score}<span className="text-muted-foreground font-normal">/{c.max}</span></div>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{c.comment}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-8 sticky bottom-20 md:static bg-background/80 backdrop-blur md:bg-transparent py-2">
          <button className="flex-1 h-12 rounded-xl border border-border text-sm font-medium inline-flex items-center justify-center gap-2">
            <Pencil className="size-4" /> Edit
          </button>
          <button className="flex-1 h-12 rounded-xl text-primary-foreground font-medium inline-flex items-center justify-center gap-2" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <Check className="size-4" /> Approve & save
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
