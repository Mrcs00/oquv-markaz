"use client";

import { useTransition } from "react";
import { Loader2, PhoneCall } from "lucide-react";
import { setCallResult } from "@/lib/actions";
import { useToast } from "@/components/ToastProvider";
import { CALL_RESULT_META } from "@/lib/constants";
import type { CallResultValue } from "@/lib/types";

const OPTIONS: CallResultValue[] = ["coming", "no_answer", "not_coming", "call_later"];

export function CallResultButtons({
  studentId,
  currentResult,
}: {
  studentId: string;
  currentResult?: CallResultValue;
}) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleClick(result: CallResultValue) {
    startTransition(async () => {
      const res = await setCallResult(studentId, result);
      if (res?.error) showToast(res.error, "error");
      else showToast("Telefon natijasi saqlandi.", "success");
    });
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-1.5">
      {OPTIONS.map((opt) => {
        const meta = CALL_RESULT_META[opt];
        const active = currentResult === opt;
        return (
          <button
            key={opt}
            type="button"
            disabled={isPending}
            onClick={() => handleClick(opt)}
            className={`inline-flex items-center justify-center md:justify-start gap-2 md:gap-1.5 min-h-[44px] md:min-h-0 px-3 md:px-2.5 py-2.5 md:py-1.5 rounded-xl md:rounded-lg text-sm md:text-xs font-medium border transition-colors active:scale-[0.98] disabled:opacity-50 ${
              active
                ? `${meta.className} border-current`
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${active ? meta.dot : "bg-slate-300"}`} />
            {meta.short}
          </button>
        );
      })}
      {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400 self-center col-span-2 justify-self-center md:col-span-1" />}
    </div>
  );
}

export function CallLink({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${phone.replace(/\s+/g, "")}`}
      className="inline-flex items-center gap-2 shrink-0 min-h-[44px] px-3.5 rounded-xl bg-primary-50 text-sm font-semibold text-slate-900 active:bg-primary-100 md:min-h-0 md:px-0 md:rounded-none md:bg-transparent md:font-medium md:text-primary-600"
    >
      <PhoneCall className="w-3.5 h-3.5" />
      {phone}
    </a>
  );
}
