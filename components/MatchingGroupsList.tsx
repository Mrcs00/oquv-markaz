"use client";

import { useTransition } from "react";
import { Loader2, Users } from "lucide-react";
import { addStudentToGroup, removeStudentFromGroup } from "@/lib/actions";
import { useToast } from "@/components/ToastProvider";
import { ConfirmButton } from "@/components/ConfirmButton";
import type { Group } from "@/lib/types";

export function MatchingGroupsList({
  studentId,
  groups,
}: {
  studentId: string;
  groups: (Group & { currentCount: number })[];
}) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  function handleAdd(groupId: string) {
    startTransition(async () => {
      const result = await addStudentToGroup(studentId, groupId);
      if (result?.error) showToast(result.error, "error");
      else showToast("O'quvchi guruhga qo'shildi.", "success");
    });
  }

  if (groups.length === 0) {
    return (
      <div className="card p-5 text-sm text-slate-500 flex items-center gap-2">
        <Users className="w-4 h-4 text-slate-400 shrink-0" />
        Mos guruh topilmadi. Guruh to'liq yig'ilganda administrator yangi guruh ochishi mumkin.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((g) => (
        <div key={g.id} className="card p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-slate-900 text-sm truncate">{g.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {g.currentCount} / {g.max_students} o'quvchi · {g.schedule_time}
            </p>
          </div>
          <button
            disabled={isPending}
            onClick={() => handleAdd(g.id)}
            className="btn-primary shrink-0"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Qo'shish
          </button>
        </div>
      ))}
    </div>
  );
}

export function RemoveFromGroupButton({ studentId, level }: { studentId: string; level: number }) {
  return (
    <ConfirmButton
      label="Guruhdan chiqarish"
      confirmLabel="Chiqarish"
      title="O'quvchini guruhdan chiqarish"
      description="O'quvchini ushbu guruhdan chiqarishni tasdiqlaysizmi? U yana yangi o'quvchilar ro'yxatida ko'rinadi."
      variant="danger"
      className="btn-secondary text-danger-600"
      action={() => removeStudentFromGroup(studentId, level)}
      successMessage="O'quvchi guruhdan chiqarildi."
    />
  );
}
