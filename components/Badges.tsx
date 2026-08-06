import { STUDENT_STATUS_META, CALL_RESULT_META } from "@/lib/constants";
import type { StudentStatus, CallResultValue } from "@/lib/types";

export function StatusBadge({ status }: { status: StudentStatus }) {
  const meta = STUDENT_STATUS_META[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export function CallResultBadge({ result }: { result: CallResultValue }) {
  const meta = CALL_RESULT_META[result];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${meta.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.short}
    </span>
  );
}
