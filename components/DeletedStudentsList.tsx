"use client";

import { useMemo, useState } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { restoreStudent, permanentlyDeleteStudent } from "@/lib/actions";
import { RotateCcw, Trash2 } from "lucide-react";
import type { StudentWithRelations } from "@/lib/types";

type Tab = "all" | "not_coming" | "no_answer" | "manual";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Hammasi" },
  { key: "not_coming", label: "Kelmayman" },
  { key: "no_answer", label: "Ko'tarmadi" },
  { key: "manual", label: "Qo'lda o'chirilgan" },
];

function matchesTab(s: StudentWithRelations, tab: Tab) {
  if (tab === "all") return true;
  if (tab === "not_coming") return s.call_result?.result === "not_coming";
  if (tab === "no_answer") return s.call_result?.result === "no_answer";
  // "Qo'lda o'chirilgan" — natija "Kelmayman"/"Ko'tarmadi" bo'lmagan holda o'chirilganlar.
  return s.call_result?.result !== "not_coming" && s.call_result?.result !== "no_answer";
}

export function DeletedStudentsList({ students }: { students: StudentWithRelations[] }) {
  const [tab, setTab] = useState<Tab>("all");

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { all: students.length, not_coming: 0, no_answer: 0, manual: 0 };
    for (const s of students) {
      if (s.call_result?.result === "not_coming") c.not_coming++;
      else if (s.call_result?.result === "no_answer") c.no_answer++;
      else c.manual++;
    }
    return c;
  }, [students]);

  const filtered = useMemo(() => students.filter((s) => matchesTab(s, tab)), [students, tab]);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              tab === t.key
                ? "bg-primary-500 border-primary-500 text-slate-900"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-sm text-slate-400">O'quvchilar yo'q.</div>
      ) : (
        <div className="card divide-y divide-slate-100">
          {filtered.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{s.full_name}</p>
                <p className="text-xs text-slate-500 truncate">
                  {s.phone} · {s.course?.name}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ConfirmButton
                  label="Tiklash"
                  confirmLabel="Tiklash"
                  title="O'quvchini tiklash"
                  description="Ushbu o'quvchini yangi o'quvchilar ro'yxatiga qaytarmoqchimisiz?"
                  variant="primary"
                  className="btn-secondary"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  action={restoreStudent.bind(null, s.id)}
                  successMessage="O'quvchi tiklandi."
                />
                <ConfirmButton
                  label="Butunlay o'chirish"
                  confirmLabel="O'chirish"
                  title="Butunlay o'chirish"
                  description="Bu amalni bekor qilib bo'lmaydi. O'quvchi ma'lumotlari butunlay o'chiriladi."
                  variant="danger"
                  className="btn-secondary text-danger-600"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  action={permanentlyDeleteStudent.bind(null, s.id)}
                  successMessage="O'quvchi butunlay o'chirildi."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
