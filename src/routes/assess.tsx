import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockRubrics, mockAssessments } from "@/lib/mock-data";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFilename(f.name);
  }

  function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!student.trim() || !title.trim() || !filename) {
      setError("Please provide the student name, output title, and a PDF or DOCX file.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      navigate({ to: "/feedback/$id", params: { id: mockAssessments[0].id } });
    }, 1200);
  }

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-3xl">
        <PageHeader
          title="New assessment"
          subtitle="Upload a student's written output and select the rubric to evaluate against."
        />

        <form onSubmit={onGenerate} className="rounded-2xl bg-card border border-border p-5 md:p-7 space-y-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Student name / ID</label>
              <input value={student} onChange={(e) => setStudent(e.target.value)} placeholder="e.g. Juan dela Cruz"
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Output title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Reflection Paper 1"
                className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Select rubric</label>
            <select value={rubricId} onChange={(e) => setRubricId(e.target.value)}
              className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm">
              {mockRubrics.map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Student output file (PDF or DOCX)</label>
            <label className="mt-1.5 flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed border-border bg-input/40 cursor-pointer hover:border-primary/50 transition-colors">
              <input type="file" accept=".pdf,.docx" className="hidden" onChange={onFile} />
              <Upload className="size-7 text-muted-foreground" />
              <div className="text-sm mt-2">{filename ?? "Select a file to upload"}</div>
              <div className="text-xs text-muted-foreground">PDF or DOCX</div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-primary-foreground font-medium inline-flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            {loading ? <><Loader2 className="size-4 animate-spin" /> Preparing feedback...</> : <><Sparkles className="size-4" /> Generate feedback</>}
          </button>
          {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          SmartCheck retrieves rubric criteria and uses a language model to draft feedback you can review and approve.
        </p>
      </div>
    </AppLayout>
  );
}
