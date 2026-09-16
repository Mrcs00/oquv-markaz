"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, User, Phone, BarChart3, Users, Check, GraduationCap } from "lucide-react";
import { createStudent, updateStudent } from "@/lib/actions";
import { getLevelsForCourse, SHIFTS, SHIFT_META } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";
import type { Course, Group, GroupShift, Student } from "@/lib/types";

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

  // Individual rejimda o'quvchi qaysi kursga (til) yozilayotganini tanlaydi.
  const [courseId, setCourseId] = useState(
    student?.course_id ?? courses.find((c) => c.name.toLowerCase().includes("koreys"))?.id ?? courses[0]?.id ?? ""
  );
  const selectedCourse = courses.find((c) => c.id === courseId);
  const levels = getLevelsForCourse(selectedCourse?.name);
  const [shift, setShift] = useState<GroupShift>(student?.desired_shift ?? "kunduzgi");

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
      {effectiveMode === "group" && <input type="hidden" name="course_id" value={courseId} />}

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
        <>
          <div>
            <label className="label" htmlFor="course_id">
              Kurs
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="course_id"
                name="course_id"
                required
                className="input pl-10"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="level">
              Daraja
            </label>
            <div className="relative">
              <BarChart3 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                key={courseId}
                id="level"
                name="level"
                required
                className="input pl-10"
                defaultValue={levels.some((l) => l.value === student?.level) ? student?.level : 0}
              >
                {levels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="label" htmlFor="course_id_pool">
              Kurs
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="course_id_pool"
                className="input pl-10"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Xohlagan smena</label>
            <div className="grid grid-cols-2 gap-2">
              {SHIFTS.map((s) => {
                const meta = SHIFT_META[s];
                const active = shift === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setShift(s)}
                    className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-500 border-primary-500 text-slate-900"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>
                      {meta.emoji} {meta.label} · {meta.korean}
                    </span>
                    <span className={`text-xs ${active ? "text-slate-800" : "text-slate-400"}`}>
                      {meta.range}
                    </span>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="shift" value={shift} />
            <p className="text-xs text-slate-400 mt-1.5">
              O'quvchi shu smena bo'yicha yig'ilish ro'yxatiga tushadi — telefon
              qilib tasdiqlangach, guruh ochiladi.
            </p>
          </div>
        </>
      )}

      <SubmitButton label="Saqlash" />
    </form>
  );
}
