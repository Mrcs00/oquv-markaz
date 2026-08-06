"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2, Phone } from "lucide-react";
import { createGroup } from "@/lib/actions";
import { LEVELS, WEEKDAYS } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";
import type { Course } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-success w-full">
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {label}
    </button>
  );
}

const initialState: { error?: string } = {};

export function GroupForm({
  courses,
  defaultCourseId,
  defaultMinLevel,
  defaultMaxLevel,
  presetName,
  presetStudents,
}: {
  courses: Course[];
  defaultCourseId?: string;
  defaultMinLevel?: number;
  defaultMaxLevel?: number;
  presetName?: string;
  presetStudents?: { id: string; full_name: string; phone: string }[];
}) {
  const [state, formAction] = useFormState(createGroup, initialState);
  const { showToast } = useToast();
  const [days, setDays] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) showToast(state.error, "error");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const isFromCall = Boolean(presetStudents && presetStudents.length > 0);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Guruh nomi
        </label>
        <input
          id="name"
          name="name"
          required
          className="input"
          placeholder="Korean Beginner 03"
          defaultValue={presetName}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="course_id">
            Kurs
          </label>
          <select
            id="course_id"
            name="course_id"
            required
            className="input disabled:opacity-60 disabled:bg-slate-50"
            defaultValue={defaultCourseId ?? courses[0]?.id}
            disabled={isFromCall}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* disabled select'lar FormData'ga qo'shilmaydi — qiymatni yashirin input orqali yuboramiz */}
          {isFromCall && <input type="hidden" name="course_id" value={defaultCourseId} />}
        </div>
        <div>
          <label className="label" htmlFor="teacher_name">
            O'qituvchi
          </label>
          <input
            id="teacher_name"
            name="teacher_name"
            className="input"
            placeholder="Ism-familiya"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="min_level">
            Daraja (dan)
          </label>
          <select
            id="min_level"
            name="min_level"
            required
            className="input disabled:opacity-60 disabled:bg-slate-50"
            defaultValue={defaultMinLevel ?? 0}
            disabled={isFromCall}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          {isFromCall && <input type="hidden" name="min_level" value={defaultMinLevel ?? 0} />}
        </div>
        <div>
          <label className="label" htmlFor="max_level">
            Daraja (gacha)
          </label>
          <select
            id="max_level"
            name="max_level"
            required
            className="input disabled:opacity-60 disabled:bg-slate-50"
            defaultValue={defaultMaxLevel ?? 0}
            disabled={isFromCall}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          {isFromCall && <input type="hidden" name="max_level" value={defaultMaxLevel ?? 0} />}
        </div>
      </div>

      <div>
        <label className="label">Dars kunlari</label>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((d) => {
            const active = days.includes(d);
            return (
              <button
                type="button"
                key={d}
                onClick={() =>
                  setDays((prev) => (active ? prev.filter((x) => x !== d) : [...prev, d]))
                }
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  active
                    ? "bg-primary-500 border-primary-500 text-slate-900"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
        {days.map((d) => (
          <input key={d} type="hidden" name="schedule_days" value={d} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="schedule_time">
            Dars vaqti
          </label>
          <input id="schedule_time" name="schedule_time" type="time" className="input" defaultValue="18:00" />
        </div>
        <div>
          <label className="label" htmlFor="max_students">
            Maksimal o'quvchi
          </label>
          <input
            id="max_students"
            name="max_students"
            type="number"
            min={1}
            className="input"
            defaultValue={12}
          />
        </div>
      </div>

      {presetStudents && presetStudents.length > 0 && (
        <div>
          <label className="label">O'quvchilar ({presetStudents.length} ta)</label>
          <div className="card divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {presetStudents.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm">
                <span className="font-medium text-slate-900">{s.full_name}</span>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> {s.phone}
                </span>
                <input type="hidden" name="student_ids" value={s.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isFromCall ? (
        <>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="btn-success w-full"
          >
            Guruhni ochish ({presetStudents!.length})
          </button>

          {confirmOpen && (
            <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
              <div className="absolute inset-0 bg-slate-900/40" onClick={() => setConfirmOpen(false)} />
              <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-cardHover">
                <h3 className="text-base font-semibold text-slate-900">Guruhni ochish</h3>
                <p className="text-sm text-slate-500 mt-1.5">
                  Guruhni {presetStudents!.length} ta o'quvchi bilan ochmoqchimisiz?
                </p>
                <div className="flex gap-2.5 mt-5">
                  <button type="button" onClick={() => setConfirmOpen(false)} className="btn-secondary flex-1">
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => formRef.current?.requestSubmit()}
                    className="btn-success flex-1"
                  >
                    Guruhni ochish
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <SubmitButton label="Guruhni yaratish" />
      )}
    </form>
  );
}
