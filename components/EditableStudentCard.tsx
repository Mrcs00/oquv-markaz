"use client";

import { useState } from "react";
import { Pencil, Phone, BookOpen, BarChart3, Users, Calendar } from "lucide-react";
import { StudentForm } from "@/components/StudentForm";
import { StatusBadge } from "@/components/Badges";
import { levelLabel } from "@/lib/constants";
import type { Course, StudentWithRelations } from "@/lib/types";

export function EditableStudentCard({
  student,
  courses,
}: {
  student: StudentWithRelations;
  courses: Course[];
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="card p-5 md:p-6">
        <StudentForm courses={courses} student={student} onSaved={() => setEditing(false)} />
        <button onClick={() => setEditing(false)} className="btn-ghost w-full mt-2">
          Bekor qilish
        </button>
      </div>
    );
  }

  const rows = [
    { icon: Phone, label: "Telefon", value: student.phone },
    { icon: BookOpen, label: "Kurs", value: student.course?.name ?? "—" },
    { icon: BarChart3, label: "Daraja", value: levelLabel(student.level) },
    { icon: Users, label: "Guruh", value: student.group?.name ?? "Biriktirilmagan" },
    {
      icon: Calendar,
      label: "Qo'shilgan sana",
      value: new Date(student.created_at).toLocaleDateString("uz-UZ", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-lg font-semibold shrink-0">
            {student.full_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-900 truncate">{student.full_name}</h2>
            <StatusBadge status={student.status} />
          </div>
        </div>
        <button onClick={() => setEditing(true)} className="btn-secondary shrink-0">
          <Pencil className="w-3.5 h-3.5" />
          Tahrirlash
        </button>
      </div>

      <dl className="space-y-3.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 text-sm">
            <r.icon className="w-4 h-4 text-slate-400 shrink-0" />
            <dt className="text-slate-500 w-32 shrink-0">{r.label}</dt>
            <dd className="text-slate-900 font-medium truncate">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
