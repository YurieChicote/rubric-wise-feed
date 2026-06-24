import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockAssessments } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "Assessment history — SmartCheck" }] }),
  component: HistoryPage,
});

function scoreColor(score: number) {
  if (score >= 85) return "bg-success/15 text-success";
  if (score >= 70) return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
}

function HistoryPage() {
  const [q, setQ] = useState("");
  const results = useMemo(
    () => mockAssessments.filter((a) => (a.studentName + a.outputTitle + a.rubricName).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-4xl">
        <PageHeader title="Assessment history" subtitle={`Showing ${results.length} recent assessments`} />

        <div className="relative mb-5">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assessments..."
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        <div className="space-y-3">
          {results.map((a) => (
            <Link
              key={a.id}
              to="/feedback/$id"
              params={{ id: a.id }}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="min-w-0">
                <div className="font-medium">{a.studentName}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">{a.outputTitle} · {a.date}</div>
              </div>
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md ${scoreColor(a.score)}`}>{a.score}/100</span>
            </Link>
          ))}
          {results.length === 0 && (
            <div className="text-center py-16 text-sm text-muted-foreground">No matching assessments.</div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
