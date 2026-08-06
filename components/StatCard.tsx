import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "slate";
}) {
  const toneClasses: Record<string, string> = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-slate-900 leading-tight">{value}</p>
        <p className="text-sm text-slate-500 truncate">{label}</p>
      </div>
    </div>
  );
}
