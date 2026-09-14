import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Assessment } from "@/lib/mock-data";

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
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const response = await fetch(
          "http://127.0.0.1:4000/api/assessments"
        );

        if (!response.ok) {
          throw new Error("Failed to load assessments");
        }

        const data = await response.json();
        setAssessments(data.assessments ?? []);
      } catch (error) {
        console.error("Failed to load assessment history:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, []);
   async function deleteAssessment(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assessment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:4000/api/assessments/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete assessment");
      }

      setAssessments((current) =>
        current.filter((assessment) => assessment.id !== id)
      );
    } catch (error) {
      console.error("Delete assessment error:", error);
      alert("Could not delete the assessment.");
    }
  }

  const results = useMemo(() => {
    const search = q.toLowerCase();

    return assessments.filter((a) =>
      `${a.studentName} ${a.outputTitle} ${a.rubricName}`
        .toLowerCase()
        .includes(search)
    );
  }, [q, assessments]);

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-4xl">
        <PageHeader
          title="Assessment history"
          subtitle={`Showing ${results.length} recent assessments`}
        />

        <div className="relative mb-5">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assessments..."
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm text-muted-foreground">
            Loading assessments...
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((a) => (
  <div
    key={a.id}
    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
    style={{ boxShadow: "var(--shadow-card)" }}
  >
    <Link
      to="/feedback/$id"
      params={{ id: a.id }}
      className="flex items-center justify-between gap-4 min-w-0 flex-1"
    >
      <div className="min-w-0">
        <div className="font-medium">{a.studentName}</div>

        <div className="text-xs text-muted-foreground mt-0.5 truncate">
          {a.outputTitle} · {a.rubricName}
        </div>
      </div>

      <span
        className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-md ${scoreColor(
          a.score
        )}`}
      >
        {a.score}/100
      </span>
    </Link>

    <button
      onClick={() => deleteAssessment(a.id)}
      className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      title="Delete assessment"
    >
      <Trash2 className="size-4" />
    </button>
  </div>
))}

            {results.length === 0 && (
              <div className="text-center py-16 text-sm text-muted-foreground">
                No matching assessments.
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}