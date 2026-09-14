import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import type { Assessment } from "@/lib/mock-data";
import { ArrowLeft, Pencil, Check, Sparkles } from "lucide-react";
import { useState } from "react";

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

  errorComponent: () => (
    <div className="p-8">Could not load feedback.</div>
  ),

  notFoundComponent: () => (
    <AppLayout>
      <div className="p-10 text-center">
        <p className="text-muted-foreground">Assessment not found.</p>
        <Link to="/history" className="text-primary text-sm">
          Back to history
        </Link>
      </div>
    </AppLayout>
  ),
});

function FeedbackPage() {
  const a = Route.useLoaderData() as Assessment;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [approved, setApproved] = useState(a.approved);

  const [score, setScore] = useState(a.score);
  const [feedback, setFeedback] = useState(a.feedback);
  const [criteria, setCriteria] = useState(a.criteria);

  function updateCriterion(
    index: number,
    field: "score" | "comment",
    value: string
  ) {
    setCriteria((current) =>
      current.map((criterion, i) => {
        if (i !== index) return criterion;

        if (field === "score") {
          return {
            ...criterion,
            score: Number(value),
          };
        }

        return {
          ...criterion,
          comment: value,
        };
      })
    );
  }

  async function saveChanges(shouldApprove = false) {
    setSaving(true);

    try {
      const calculatedScore = criteria.reduce(
        (total, criterion) => total + Number(criterion.score),
        0
      );

      const finalScore = score !== a.score ? score : calculatedScore;

      const response = await fetch(
        `http://127.0.0.1:4000/api/assessments/${a.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: finalScore,
            feedback,
            criteria,
            approved: shouldApprove || approved,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save assessment");
      }

      const data = await response.json();

      const updated = data.assessment ?? data;

      setScore(updated.score);
      setFeedback(updated.feedback);
      setCriteria(updated.criteria);
      setApproved(updated.approved);
      setEditing(false);

      alert(
        shouldApprove
          ? "Assessment approved and saved."
          : "Assessment changes saved."
      );
    } catch (error) {
      console.error(error);
      alert("Could not save the assessment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-4xl">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="size-4" /> Back to history
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {a.studentName}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <span className="px-2.5 py-1 rounded-md bg-primary/15 text-primary text-xs font-medium">
                {a.outputTitle}
              </span>

              <span className="text-xs text-muted-foreground">
                Based on: {a.rubricName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">
              {editing ? "Score" : "Suggested score"}
            </div>

            {editing ? (
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-lg bg-input border border-border text-center font-bold"
              />
            ) : (
              <div className="px-3 py-1.5 rounded-lg bg-success/15 text-success font-bold text-lg">
                {score} / 100
              </div>
            )}

            <button
              onClick={() => setEditing(true)}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              title="Edit assessment"
            >
              <Pencil className="size-4" />
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5 md:p-6"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Sparkles className="size-4" /> AI-generated feedback
          </div>

          {editing ? (
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="mt-3 w-full rounded-lg bg-background border border-border p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="mt-3 text-sm md:text-base leading-relaxed text-foreground/90">
              {feedback}
            </p>
          )}
        </div>

        <h3 className="font-display font-semibold text-lg mt-8 mb-4">
          Rubric criteria
        </h3>

        <div className="space-y-3">
          {criteria.map((c, index) => {
            const pct = Math.round((c.score / c.max) * 100);

            return (
              <div
                key={c.name}
                className="rounded-xl bg-card border border-border p-4"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-sm">{c.name}</div>

                  {editing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max={c.max}
                        value={c.score}
                        onChange={(e) =>
                          updateCriterion(index, "score", e.target.value)
                        }
                        className="w-16 px-2 py-1 rounded-md bg-input border border-border text-center text-sm"
                      />

                      <span className="text-muted-foreground">
                        /{c.max}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm tabular-nums font-semibold">
                      {c.score}
                      <span className="text-muted-foreground font-normal">
                        /{c.max}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: "var(--gradient-primary)",
                    }}
                  />
                </div>

                {editing ? (
                  <textarea
                    value={c.comment}
                    onChange={(e) =>
                      updateCriterion(index, "comment", e.target.value)
                    }
                    rows={3}
                    className="w-full mt-2 rounded-lg bg-input border border-border p-2 text-xs text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground mt-2">
                    {c.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 mt-8 sticky bottom-20 md:static bg-background/80 backdrop-blur md:bg-transparent py-2">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setScore(a.score);
                  setFeedback(a.feedback);
                  setCriteria(a.criteria);
                  setEditing(false);
                }}
                disabled={saving}
                className="flex-1 h-12 rounded-xl border border-border text-sm font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => saveChanges(false)}
                disabled={saving}
                className="flex-1 h-12 rounded-xl text-primary-foreground font-medium inline-flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Check className="size-4" />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex-1 h-12 rounded-xl border border-border text-sm font-medium inline-flex items-center justify-center gap-2"
              >
                <Pencil className="size-4" /> Edit
              </button>

              <button
                onClick={() => saveChanges(true)}
                disabled={saving || approved}
                className="flex-1 h-12 rounded-xl text-primary-foreground font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                <Check className="size-4" />

                {approved
                  ? "Approved & saved"
                  : saving
                    ? "Saving..."
                    : "Approve & save"}
              </button>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}