import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/app-layout";
import { mockAssessments } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Award } from "lucide-react";

export const Route = createFileRoute("/performance")({
  head: () => ({ meta: [{ title: "Performance insights — SmartCheck" }] }),
  component: PerformancePage,
});

const trend = [62, 70, 68, 75, 78, 82, 80, 84, 87, 85, 88, 84];
const months = ["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"];

function PerformancePage() {
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const avg = Math.round(trend.reduce((a, b) => a + b, 0) / trend.length);

  const strengths = [
    { label: "Grammar & mechanics", pct: 88 },
    { label: "Reflection depth", pct: 84 },
    { label: "Methodology", pct: 82 },
  ];
  const weaknesses = [
    { label: "Citations", pct: 58 },
    { label: "Coherence", pct: 64 },
    { label: "Thesis", pct: 72 },
  ];

  return (
    <AppLayout>
      <div className="px-5 md:px-10 py-6 md:py-10 max-w-6xl">
        <PageHeader title="Performance insights" subtitle="Trends and patterns across student assessments." />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: "Class average", value: `${avg}%`, icon: Award, tone: "text-primary" },
            { label: "Highest", value: `${max}%`, icon: TrendingUp, tone: "text-success" },
            { label: "Lowest", value: `${min}%`, icon: TrendingDown, tone: "text-warning" },
            { label: "Assessed", value: String(mockAssessments.length * 4), icon: Award, tone: "text-primary" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card border border-border p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <s.icon className={`size-5 ${s.tone}`} />
              <div className="text-2xl md:text-3xl font-bold mt-3">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="rounded-2xl bg-card border border-border p-5 md:p-6 mb-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg">Score trend</h3>
            <span className="text-xs text-muted-foreground">Last 12 months</span>
          </div>
          <div className="mt-6">
            <svg viewBox="0 0 600 200" className="w-full h-48">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.62 0.19 256)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(0.62 0.19 256)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" x2="600" y1={200 - (y / 100) * 180 - 10} y2={200 - (y / 100) * 180 - 10} stroke="oklch(0.3 0.03 250)" strokeDasharray="2 4" />
              ))}
              {(() => {
                const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * 600},${200 - (v / 100) * 180 - 10}`);
                const linePath = "M" + pts.join(" L");
                const areaPath = `${linePath} L600,200 L0,200 Z`;
                return (
                  <>
                    <path d={areaPath} fill="url(#g)" />
                    <path d={linePath} fill="none" stroke="oklch(0.62 0.19 256)" strokeWidth="2.5" strokeLinejoin="round" />
                    {trend.map((v, i) => (
                      <circle key={i} cx={(i / (trend.length - 1)) * 600} cy={200 - (v / 100) * 180 - 10} r="3.5" fill="oklch(0.62 0.19 256)" />
                    ))}
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
              {months.map((m) => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="size-4 text-success" /> Common strengths
            </h3>
            <div className="mt-5 space-y-4">
              {strengths.map((s) => (
                <Bar key={s.label} label={s.label} pct={s.pct} tone="success" />
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-5 md:p-6" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <TrendingDown className="size-4 text-warning" /> Common weaknesses
            </h3>
            <div className="mt-5 space-y-4">
              {weaknesses.map((w) => (
                <Bar key={w.label} label={w.label} pct={w.pct} tone="primary" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: "primary" | "success" }) {
  const bg = tone === "success" ? "oklch(0.68 0.16 155)" : "var(--gradient-primary)";
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: bg }} />
      </div>
    </div>
  );
}
