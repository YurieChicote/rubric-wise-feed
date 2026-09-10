import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockRubrics } from "@/lib/mock-data";
import { Upload, FileText, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/rubrics")({
  head: () => ({ meta: [{ title: "Rubrics — SmartCheck" }] }),
  component: RubricsPage,
});

function RubricsPage() {
  const [rubrics, setRubrics] = useState(mockRubrics);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [filename, setFilename] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFilename(f.name);
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !filename) return;
    setRubrics((r) => [
      { id: `r${Date.now()}`, name, subject: subject || "—", filename, size: "112 KB", uploadedAt: "Today" },
      ...r,
    ]);
    setName(""); setSubject(""); setFilename(null); setShowForm(false);
  }

  function onDelete(id: string) {
    setRubrics((r) => r.filter((x) => x.id !== id));
  }

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-5xl">
        <PageHeader
          title="Rubrics"
          subtitle="Upload and manage grading rubrics used to evaluate student outputs."
          action={
            <button
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-primary-foreground text-sm font-medium"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Plus className="size-4" /> Upload rubric
            </button>
          }
        />

        {showForm && (
          <form onSubmit={onSave} className="rounded-2xl bg-card border border-border p-5 md:p-6 mb-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Rubric name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Essay Rubric Q1"
                  className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. English 11"
                  className="mt-1.5 w-full h-11 px-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rubric file (PDF or DOCX)</label>
              <label className="mt-1.5 flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-border bg-input/40 cursor-pointer hover:border-primary/50 transition-colors">
                <input type="file" accept=".pdf,.docx" className="hidden" onChange={onFile} />
                <Upload className="size-6 text-muted-foreground" />
                <div className="text-sm mt-2">{filename ?? "Select a rubric file to upload"}</div>
                <div className="text-xs text-muted-foreground">PDF or DOCX only</div>
              </label>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="h-11 px-4 rounded-lg border border-border text-sm">Cancel</button>
              <button type="submit" className="flex-1 h-11 rounded-lg text-primary-foreground font-medium text-sm" style={{ background: "var(--gradient-primary)" }}>Save rubric</button>
            </div>
          </form>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rubrics.map((r) => (
            <div key={r.id} className="rounded-2xl bg-card border border-border p-5 group" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between">
                <div className="size-10 rounded-lg bg-primary/15 grid place-items-center">
                  <FileText className="size-5 text-primary" />
                </div>
                <button onClick={() => onDelete(r.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-4">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.subject}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate pr-2">{r.filename}</span>
                <span className="inline-flex items-center gap-1 text-success shrink-0">
                  <CheckCircle2 className="size-3" /> Ready
                </span>
              </div>
              <div className="text-[11px] text-muted-foreground mt-2">{r.size} · {r.uploadedAt}</div>
            </div>
          ))}
          {rubrics.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
              No rubrics yet. <Link to="/rubrics" className="text-primary">Upload one</Link> to get started.
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
