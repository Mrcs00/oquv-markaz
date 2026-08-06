"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createStudent, updateStudent } from "@/lib/actions";
import { LEVELS } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";
import type { Course, Student } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {label}
    </button>
  );
}

const initialState: { success?: boolean; error?: string } = {};

export function StudentForm({
  courses,
  student,
  onSaved,
}: {
  courses: Course[];
  student?: Student;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = Boolean(student);

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

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="full_name">
          Ism-familiya
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          autoFocus
          className="input"
          placeholder="Muhammad Ali"
          defaultValue={student?.full_name}
        />
      </div>

      <div>
        <label className="label" htmlFor="phone">
          Telefon raqami
        </label>
        <input
          id="phone"
          name="phone"
          required
          inputMode="tel"
          className="input"
          placeholder="+998 90 123 45 67"
          defaultValue={student?.phone}
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
            className="input"
            defaultValue={student?.course_id ?? courses[0]?.id}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="level">
            Daraja
          </label>
          <select
            id="level"
            name="level"
            required
            className="input"
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

      <SubmitButton label={isEdit ? "Saqlash" : "Saqlash"} />
    </form>
  );
}
