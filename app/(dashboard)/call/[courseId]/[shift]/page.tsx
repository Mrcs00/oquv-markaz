import { notFound } from "next/navigation";
import Link from "next/link";
import { PhoneCall, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { CallResultButtons, CallLink } from "@/components/CallResultButtons";
import { getPoolByCourseAndShift } from "@/lib/data";
import { CALL_RESULT_META, SHIFT_META } from "@/lib/constants";
import type { CallResultValue, GroupShift } from "@/lib/types";

export default async function CallPhasePage({
  params,
}: {
  params: { courseId: string; shift: string };
}) {
  const shift = params.shift as GroupShift;
  const pool = await getPoolByCourseAndShift(params.courseId, shift);
  if (!pool || pool.students.length === 0) notFound();

  const shiftMeta = SHIFT_META[shift];

  const tally: Record<CallResultValue, number> = {
    coming: 0,
    no_answer: 0,
    not_coming: 0,
    call_later: 0,
  };
  for (const s of pool.students) {
    if (s.call_result) tally[s.call_result.result]++;
  }
  const comingCount = tally.coming;

  return (
    <div>
      <PageHeader
        title={`${pool.courseName} — Beginner`}
        subtitle={`${shiftMeta.emoji} ${shiftMeta.label} · ${shiftMeta.korean} · ${pool.students.length} ta o'quvchi`}
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
          {pool.students.map((s) => (
            <div key={s.id} className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900 text-sm">{s.full_name}</p>
                <CallLink phone={s.phone} />
              </div>
              <CallResultButtons studentId={s.id} currentResult={s.call_result?.result} />
            </div>
          ))}
        </div>

        <div className="sticky bottom-20 md:bottom-6">
          {comingCount > 0 ? (
            <Link
              href={`/call/${pool.courseId}/${pool.shift}/open`}
              className="btn-success w-full shadow-cardHover"
            >
              <PhoneCall className="w-4 h-4" />
              Guruhni ochish ({comingCount} ta)
            </Link>
          ) : (
            <div className="card p-4 text-center text-sm text-slate-400">
              Guruhni ochish uchun kamida bitta "Kelaman" natijasi kerak.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
