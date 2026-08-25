import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CallResultButtons, CallLink } from "@/components/CallResultButtons";
import { getIndividualWaiting } from "@/lib/data";
import { CALL_RESULT_META } from "@/lib/constants";
import type { CallResultValue } from "@/lib/types";

export default async function IndividualCallPage() {
  const students = await getIndividualWaiting();
  if (students.length === 0) notFound();

  const tally: Record<CallResultValue, number> = {
    coming: 0,
    no_answer: 0,
    not_coming: 0,
    call_later: 0,
  };
  for (const s of students) {
    if (s.call_result) tally[s.call_result.result]++;
  }

  return (
    <div>
      <PageHeader
        title="Individual"
        subtitle={`${students.length} ta o'quvchi`}
        backHref="/"
      />

      <div className="p-4 md:p-8 max-w-2xl space-y-5">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">Holat</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(tally) as CallResultValue[]).map((key) => (
              <div key={key} className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-semibold text-slate-900">{tally[key]}</p>
                <p className="text-xs text-slate-500 mt-0.5">{CALL_RESULT_META[key].short}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card divide-y divide-slate-100">
          {students.map((s) => (
            <div key={s.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900 text-sm">{s.full_name}</p>
                <CallLink phone={s.phone} />
              </div>
              <CallResultButtons studentId={s.id} currentResult={s.call_result?.result} />
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-400 text-center">
          "Kelaman" natijasi belgilangan o'quvchilar "Guruhlar" bo'limida "Individual
          o'quvchilar" kartasida ko'rinadi.
        </p>
      </div>
    </div>
  );
}
