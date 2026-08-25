"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, User, Phone, BarChart3, Users, Check } from "lucide-react";
import { createStudent, updateStudent } from "@/lib/actions";
import { LEVELS } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";
import type { Course, Group, Student } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      {label}
    </button>
  );
}

const initialState: { success?: boolean; error?: string } = {};

export function StudentForm({
  courses,
  groups,
  student,
  onSaved,
}: {
  courses: Course[];
  groups?: (Group & { course: Course | null; students: { id: string }[] })[];
  student?: Student;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = Boolean(student);
  const [mode, setMode] = useState<"individual" | "group">(student?.group_id ? "group" : "individual");

  const action = isEdit ? updateStudent.bind(null, student!.id) : createStudent;
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    if (state.success) {
      showToast(
        isEdit ? "O'quvchi ma'lumotlari yangilandi." : "O'quvchi muvaffaqiyatli qo'shildi.",
        "success"
      );
      if (onSaved) onSaved();
      else router.push("/students");
      router.refresh();
    } else if (state.error) {
      showToast(state.error, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Individual rejimda faqat "Koreys tili" kursi ishlatiladi.
  const koreanCourse = courses.find((c) => c.name.toLowerCase().includes("koreys")) ?? courses[0];

  const openGroups = (groups ?? []).filter(
    (g) => g.status === "faol" && (g.students?.length ?? 0) < g.max_students
  );

  // Tahrirlashda har doim kurs/daraja maydonlari ko'rsatiladi — guruhga
  // biriktirish/chiqarish alohida joyda (profil sahifasida) boshqariladi.
  const effectiveMode = isEdit ? "individual" : mode;

  return (
    <form action={formAction} className="space-y-4">
      {!isEdit && (
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMode("individual")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "individual" ? "bg-white text-primary-700 shadow-sm" : "text-slate-500"
            }`}
          >
            <User className="w-4 h-4" />
            Individul
          </button>
          <button
            type="button"
            onClick={() => setMode("group")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === "group" ? "bg-white text-primary-700 shadow-sm" : "text-slate-500"
            }`}
          >
            <Users className="w-4 h-4" />
            Gruppa
          </button>
        </div>
      )}
      <input type="hidden" name="mode" value={effectiveMode} />

      <div>
        <label className="label" htmlFor="full_name">
          Ism-familiya
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="full_name"
            name="full_name"
            required
            autoFocus
            className="input pl-10"
            placeholder="Muhammad Ali"
            defaultValue={student?.full_name}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="phone">
          Telefon raqami 1
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="phone"
            name="phone"
            required
            inputMode="tel"
            className="input pl-10 pr-20"
            placeholder="+998 90 123 45 67"
            defaultValue={student?.phone}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-success-600 bg-success-50 px-2 py-0.5 rounded-full">
            Asosiy
          </span>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="phone2">
          Telefon raqami 2
        </label>
        <div className="relative">
          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="phone2"
            name="phone2"
            inputMode="tel"
            className="input pl-10 pr-24"
            placeholder="+998 99 987 65 43"
            defaultValue={student?.phone2 ?? undefined}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Qo'shimcha
          </span>
        </div>
      </div>

      {effectiveMode === "individual" ? (
        <div>
          <input type="hidden" name="course_id" value={koreanCourse?.id ?? ""} />
          <label className="label" htmlFor="level">
            Daraja
          </label>
          <div className="relative">
            <BarChart3 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="level"
              name="level"
              required
              className="input pl-10"
              defaultValue={student?.level ?? 0}
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <label className="label" htmlFor="group_id">
            Guruh
          </label>
          <div className="relative">
            <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="group_id"
              name="group_id"
              required
              className="input pl-10"
              defaultValue={student?.group_id ?? openGroups[0]?.id}
            >
              {openGroups.length === 0 && <option value="">Ochiq guruh yo'q</option>}
              {openGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <SubmitButton label="Saqlash" />
    </form>
  );
}
