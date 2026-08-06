"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Pencil, Loader2, Users, Clock, Calendar, BarChart3 } from "lucide-react";
import { updateGroup } from "@/lib/actions";
import { WEEKDAYS, levelLabel } from "@/lib/constants";
import { useToast } from "@/components/ToastProvider";
import type { Group } from "@/lib/types";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      Saqlash
    </button>
  );
}

export function EditableGroupCard({ group, courseName }: { group: Group; courseName: string }) {
  const [editing, setEditing] = useState(false);
  const [days, setDays] = useState<string[]>(group.schedule_days ?? []);
  const action = updateGroup.bind(null, group.id);
  const [state, formAction] = useFormState(action, {});
  const { showToast } = useToast();

  useEffect(() => {
    if (state && "success" in state && state.success) {
      showToast("Guruh ma'lumotlari yangilandi.", "success");
      setEditing(false);
    } else if (state && "error" in state && state.error) {
      showToast(state.error as string, "error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const levelText =
    group.min_level === group.max_level
      ? levelLabel(group.min_level)
      : `${levelLabel(group.min_level)} – ${levelLabel(group.max_level)}`;

  if (editing) {
    return (
      <div className="card p-5 md:p-6">
        <form action={formAction} className="space-y-4">
          <div>
            <label className="label">Guruh nomi</label>
            <input name="name" className="input" defaultValue={group.name} required />
          </div>
          <div>
            <label className="label">O'qituvchi</label>
            <input name="teacher_name" className="input" defaultValue={group.teacher_name} />
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
                        : "bg-white border-slate-200 text-slate-600"
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
              <label className="label">Dars vaqti</label>
              <input name="schedule_time" type="time" className="input" defaultValue={group.schedule_time} />
            </div>
            <div>
              <label className="label">Maks. o'quvchi</label>
              <input
                name="max_students"
                type="number"
                min={1}
                className="input"
                defaultValue={group.max_students}
              />
            </div>
          </div>
          <SubmitButton />
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost w-full">
            Bekor qilish
          </button>
        </form>
      </div>
    );
  }

  const rows = [
    { icon: BarChart3, label: "Kurs / Daraja", value: `${courseName} · ${levelText}` },
    { icon: Users, label: "O'qituvchi", value: group.teacher_name || "—" },
    { icon: Calendar, label: "Dars kunlari", value: group.schedule_days?.join(" / ") || "—" },
    { icon: Clock, label: "Dars vaqti", value: group.schedule_time || "—" },
  ];

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-3 mb-5">
        <h2 className="font-semibold text-slate-900 text-lg">{group.name}</h2>
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
            <dd className="text-slate-900 font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
