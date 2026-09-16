import type { CallResultValue, GroupShift, StudentStatus } from "@/lib/types";

export const LEVELS = [
  { value: 0, label: "0 dan" },
  { value: 1, label: "1A" },
  { value: 2, label: "1B" },
  { value: 3, label: "2A" },
  { value: 4, label: "2B" },
  { value: 5, label: "3A" },
  { value: 6, label: "3B" },
] as const;

export function levelLabel(level: number): string {
  return LEVELS.find((l) => l.value === level)?.label ?? `${level}-daraja`;
}

// Har bir kursning o'z daraja tizimi bo'lishi mumkin. Hozircha faqat
// Koreys tili uchun to'liq (1A-3B) tizim bor; boshqa kurslarda (masalan,
// Xitoy tili) hali daraja tizimi joriy qilinmagan — shuning uchun ular
// uchun faqat "0 dan" ko'rsatiladi.
export function getLevelsForCourse(courseName?: string | null) {
  if (courseName?.toLowerCase().includes("koreys")) return LEVELS;
  return LEVELS.filter((l) => l.value === 0);
}

export const WEEKDAYS = ["Du", "Se", "Chor", "Pay", "Jum", "Shan", "Yak"] as const;

// Guruhlar ikki fixed smenadan birida ochiladi. Har bir smenaning
// vaqt oralig'i qat'iy (belgilangan) — o'qituvchi faqat smenani tanlaydi,
// aniq soat kiritmaydi. schedule_time shu yerdan avtomatik olinadi.
export const SHIFT_META: Record<
  GroupShift,
  { label: string; korean: string; range: string; startTime: string; emoji: string }
> = {
  ertalabki: {
    label: "Ertalabki",
    korean: "오전",
    range: "08:00–12:00",
    startTime: "08:00",
    emoji: "🌅",
  },
  kunduzgi: {
    label: "Kunduzgi",
    korean: "오후",
    range: "13:00–18:00",
    startTime: "13:00",
    emoji: "☀️",
  },
};

export const SHIFTS: GroupShift[] = ["ertalabki", "kunduzgi"];

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
