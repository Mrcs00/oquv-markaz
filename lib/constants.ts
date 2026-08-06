import type { CallResultValue, StudentStatus } from "@/lib/types";

export const LEVELS = [
  { value: 0, label: "0 dan" },
  { value: 1, label: "1-daraja" },
  { value: 2, label: "2-daraja" },
  { value: 3, label: "3-daraja" },
  { value: 4, label: "4-daraja" },
  { value: 5, label: "5-daraja" },
  { value: 6, label: "6-daraja" },
] as const;

export function levelLabel(level: number): string {
  return LEVELS.find((l) => l.value === level)?.label ?? `${level}-daraja`;
}

export const WEEKDAYS = ["Du", "Se", "Chor", "Pay", "Jum", "Shan", "Yak"] as const;

export const READY_POOL_SIZE = 10;

export const STUDENT_STATUS_META: Record<
  StudentStatus,
  { label: string; className: string }
> = {
  kutmoqda: { label: "Kutmoqda", className: "bg-primary-50 text-primary-700" },
  guruh_kutmoqda: { label: "Guruh kutmoqda", className: "bg-warning-50 text-warning-600" },
  faol: { label: "Faol", className: "bg-success-50 text-success-600" },
};

export const CALL_RESULT_META: Record<
  CallResultValue,
  { label: string; short: string; className: string; dot: string }
> = {
  coming: {
    label: "Kelaman",
    short: "Kelaman",
    className: "bg-success-50 text-success-600 border-success-500/20",
    dot: "bg-success-500",
  },
  no_answer: {
    label: "Telefonni ko'tarmadi",
    short: "Ko'tarmadi",
    className: "bg-warning-50 text-warning-600 border-warning-500/20",
    dot: "bg-warning-500",
  },
  not_coming: {
    label: "Kelmayman",
    short: "Kelmayman",
    className: "bg-danger-50 text-danger-600 border-danger-500/20",
    dot: "bg-danger-500",
  },
  call_later: {
    label: "Keyinroq qo'ng'iroq qilish",
    short: "Keyinroq",
    className: "bg-primary-50 text-primary-700 border-primary-500/20",
    dot: "bg-primary-500",
  },
};
