import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, Clock3, FileText, GraduationCap, LogOut, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "Student Portal — SmartCheck" }] }),
  component: StudentPage,
});

type Task = {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  due: string;
  status: string;
  description: string;
  rubric: string;
};

const fallbackTask: Task = {
  id: "reflection-1",
  title: "Reflection Paper 1",
  subject: "English 11",
  teacher: "Ms. Reyes",
  due: "Due tomorrow",
  status: "In progress",
  description: "Reflect on how a personal experience changed the way you see your community. Support your ideas with two examples from our readings.",
  rubric: "Essay Rubric Q1",
};

const initialTasks: Task[] = [
  {
    id: "reflection-1",
    title: "Reflection Paper 1",
    subject: "English 11",
    teacher: "Ms. Reyes",
    due: "Due tomorrow",
    status: "In progress",
    description: "Reflect on how a personal experience changed the way you see your community. Support your ideas with two examples from our readings.",
    rubric: "Essay Rubric Q1",
  },
  {
    id: "science-report",
    title: "Written Report",
    subject: "Science 10",
    teacher: "Mr. Santos",
    due: "Due Jun 18",
    status: "Not started",
    description: "Submit the final discussion and conclusion for your plant growth investigation.",
    rubric: "Written Report",
  },
  {
    id: "humanities-response",
    title: "Source Response",
    subject: "Humanities",
    teacher: "Ms. Lim",
    due: "Due Jun 21",
    status: "Not started",
    description: "Compare the authors' perspectives and explain which argument you find more convincing.",
    rubric: "Reflection Paper",
  },
];

function StudentPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task>(fallbackTask);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storedUser = typeof window === "undefined" ? null : JSON.parse(localStorage.getItem("smartcheck-user") ?? "null");
  const studentId = storedUser?.role === "student" ? storedUser.id : 0;

  useEffect(() => {
    fetch(apiUrl(`/api/tasks?studentId=${studentId}`))
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load assignments.");
        return response.json();
      })
      .then((result) => {
        if (result.tasks?.length) {
          setTasks(result.tasks);
          setSelectedTask(result.tasks[0]);
        }
      })
      .catch(() => setError("The assignment service is unavailable. Please start the backend and refresh."))
      .finally(() => setLoading(false));
  }, [studentId]);

  async function submitAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!answer.trim() || !studentId) {
      setError("Please sign in with a student account before submitting a response.");
      return;
    }
    try {
      const response = await fetch(apiUrl("/api/submissions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTask.id, studentId, answer }),
      });
      if (!response.ok) throw new Error("Your response could not be saved.");
    } catch {
      const savedSubmissions = JSON.parse(localStorage.getItem("smartcheck-submissions") ?? "[]");
      localStorage.setItem("smartcheck-submissions", JSON.stringify([...savedSubmissions, { taskId: selectedTask.id, studentId, answer, submittedAt: new Date().toISOString() }]));
    }
    setSubmitted(true);
    setTasks((current) => current.map((task) => task.id === selectedTask.id ? { ...task, status: "Submitted" } : task));
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link to="/student" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-none">SmartCheck</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Student Portal</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold">Juan dela Cruz</div>
              <div className="text-xs text-muted-foreground">Grade 11 · HUMSS</div>
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">JD</div>
            <Link to="/auth" aria-label="Sign out" className="ml-1 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
              <LogOut className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-7 md:px-8 md:py-10 lg:grid-cols-[280px_1fr]">
        <aside>
          <div className="mb-5">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Academic overview</div>
            <h1 className="mt-2 font-display text-3xl font-semibold">Welcome, Juan.</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">You currently have one assignment requiring your attention.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><BookOpen className="size-4 text-primary" /> Active assignments</div>
              <div className="mt-2 text-2xl font-bold">3</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-success" /> Completed</div>
              <div className="mt-2 text-2xl font-bold">8</div>
            </div>
          </div>
        </aside>

        <section>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">Assigned assignments</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Select an assignment to review its instructions.</p>
                </div>
                <FileText className="size-5 text-muted-foreground" />
              </div>
              {loading && <p className="mt-5 text-sm text-muted-foreground">Loading assignments...</p>}
              <div className="mt-5 space-y-2">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => { setSelectedTask(task); setSubmitted(false); setAnswer(""); }}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${selectedTask.id === task.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/70"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{task.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{task.subject} · {task.teacher}</div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${task.status === "In progress" ? "bg-warning/15 text-warning-foreground" : "bg-secondary text-muted-foreground"}`}>{task.status}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" /> {task.due}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submitAnswer} className="rounded-xl border border-border bg-card p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{selectedTask.subject}</div>
                  <h2 className="mt-2 font-display text-2xl font-semibold">{selectedTask.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedTask.due} · {selectedTask.rubric}</p>
                </div>
                <Sparkles className="mt-1 size-5 text-primary" />
              </div>
              <div className="mt-6 rounded-lg bg-secondary/70 p-4 text-sm leading-6 text-secondary-foreground">{selectedTask.description}</div>
              <label className="mt-5 block text-sm font-semibold" htmlFor="student-answer">Written response</label>
              <textarea id="student-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); setSubmitted(false); }} placeholder="Enter your response here..." className="mt-2 min-h-48 w-full resize-y rounded-lg border border-border bg-input p-3 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring" />
              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <p className="text-xs text-muted-foreground">Your instructor will evaluate this response using the assigned rubric.</p>
                <button type="submit" disabled={!answer.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50" style={{ background: "var(--gradient-primary)" }}>
                  <Send className="size-4" /> {submitted ? "Response submitted" : "Submit response"}
                </button>
              </div>
              {submitted && <div className="mt-4 rounded-lg bg-success/10 p-3 text-sm text-success">Your answer was submitted successfully. Your teacher can now review it.</div>}
              {error && <div role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
