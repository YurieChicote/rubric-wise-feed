import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockRubrics } from "@/lib/mock-data";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/assess")({
  head: () => ({ meta: [{ title: "New assessment — SmartCheck" }] }),
  component: AssessPage,
});

function AssessPage() {
  const navigate = useNavigate();

  const [student, setStudent] = useState("");
  const [title, setTitle] = useState("");
  const [rubricId, setRubricId] = useState(mockRubrics[0]?.id ?? "");
  const [filename, setFilename] = useState<string | null>(null);
  const [outputText, setOutputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];

    if (f) {
      setFilename(f.name);
    }
  }

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();

    if (!student.trim() || !title.trim()) {
      setError("Please enter the student name and output title.");
      return;
    }

    if (!filename) {
      setError("Please upload a student output file.");
      return;
    }

    if (!outputText.trim()) {
      setError("Please enter or paste the student's output.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const selectedRubric = mockRubrics.find(
        (rubric) => rubric.id === rubricId
      );

      const response = await fetch(
        "http://127.0.0.1:4000/api/assessments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: student,
            outputTitle: title,
            rubricId,
            rubricName: selectedRubric?.name ?? "Selected Rubric",
            rubricCriteria: selectedRubric?.criteria ?? [],
            filename,
            outputText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate assessment.");
      }

      const assessment = data.assessment ?? data;

      navigate({
        to: "/feedback/$id",
        params: {
          id: assessment.id,
        },
      });
    } catch (err) {
      console.error("Assessment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating feedback."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-3xl">
        <PageHeader
          title="New assessment"
          subtitle="Upload a student's written output and select the rubric to evaluate against."
        />

        <form
          onSubmit={onGenerate}
          className="rounded-2xl bg-card border border-border p-5 md:p-7 space-y-5"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Student name / ID
              </label>

              <input
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                placeholder="e.g. Juan dela Cruz"
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Output title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Reflection Paper 1"
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Select rubric
            </label>

            <select
              value={rubricId}
              onChange={(e) => setRubricId(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              {mockRubrics.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Student output file (PDF or DOCX)
            </label>

            <label className="mt-1.5 flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-border bg-input/40 cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={onFile}
              />

              <Upload className="size-7 text-muted-foreground" />

              <div className="text-sm mt-2">
                {filename ?? "Tap to browse file"}
              </div>

              <div className="text-xs text-muted-foreground">
                PDF or DOCX
              </div>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">
              Student output
            </label>

            <textarea
              value={outputText}
              onChange={(e) => setOutputText(e.target.value)}
              placeholder="Paste or type the student's written output here..."
              rows={7}
              className="mt-1.5 w-full px-3 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-y"
            />

            <p className="text-xs text-muted-foreground mt-1.5">
              SmartCheck uses this text to generate the assessment.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-primary-foreground font-medium inline-flex items-center justify-center gap-2 disabled:opacity-70"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating assessment...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate feedback
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          SmartCheck evaluates the student's output against the selected rubric
          and generates feedback for teacher review.
        </p>
      </div>
    </AppLayout>
  );
}