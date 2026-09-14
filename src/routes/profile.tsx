import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { teacher, mockAssessments, mockRubrics } from "@/lib/mock-data";
import { LogOut, Mail, Building2, FileText, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — SmartCheck" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Profile</h1>

        <div className="flex flex-col items-center text-center py-6">
          <div className="size-24 rounded-full grid place-items-center text-3xl font-bold text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            {teacher.name[0]}
          </div>
          <h2 className="font-display text-xl font-bold mt-4">{teacher.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{teacher.school}</p>
          <p className="text-sm text-muted-foreground">{teacher.university}</p>
        </div>

        <div className="space-y-3 mt-4">
          <InfoCard icon={Mail} label="Email address" value={teacher.email} />
          <InfoCard icon={Building2} label="Department" value={teacher.department} />
          <InfoCard icon={ClipboardCheck} label="Total assessments" value={`${mockAssessments.length * 4} assessments`} />
          <InfoCard icon={FileText} label="Rubrics uploaded" value={`${mockRubrics.length} rubrics`} />
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("smartcheck_user");
             navigate({ to: "/auth" });
}}
          className="w-full mt-8 h-12 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive font-medium inline-flex items-center justify-center gap-2 hover:bg-destructive/15 transition-colors"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </AppLayout>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="size-10 rounded-lg bg-primary/15 grid place-items-center">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm font-medium mt-0.5 truncate">{value}</div>
      </div>
    </div>
  );
}
