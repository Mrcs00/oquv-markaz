import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EditableGroupCard } from "@/components/EditableGroupCard";
import { RemoveFromGroupButton } from "@/components/MatchingGroupsList";
import { ConfirmButton } from "@/components/ConfirmButton";
import { getGroupById } from "@/lib/data";
import { deleteGroup } from "@/lib/actions";

export default async function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = await getGroupById(params.id);
  if (!group) notFound();

  return (
    <div>
      <PageHeader title={group.name} />

      <div className="p-4 md:p-8 max-w-lg space-y-5">
        <EditableGroupCard group={group} courseName={group.course?.name ?? "—"} />

        <section>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            O'quvchilar ({group.students.length} / {group.max_students})
          </h3>
          <div className="card divide-y divide-slate-100">
            {group.students.length === 0 && (
              <p className="p-5 text-sm text-slate-400">Bu guruhda hali o'quvchi yo'q.</p>
            )}
            {group.students.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 p-4">
                <Link href={`/students/${s.id}`} className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 text-sm truncate">{s.full_name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {s.phone}
                  </p>
                </Link>
                <RemoveFromGroupButton studentId={s.id} level={s.level} />
              </div>
            ))}
          </div>
        </section>

        <ConfirmButton
          label="Guruhni o'chirish"
          confirmLabel="O'chirish"
          title="Guruhni o'chirish"
          description="Ushbu guruhni o'chirmoqchimisiz? Guruhdagi o'quvchilar yangi o'quvchilar ro'yxatiga qaytariladi."
          variant="danger"
          className="btn-secondary text-danger-600 w-full"
          icon={<Trash2 className="w-4 h-4" />}
          action={deleteGroup.bind(null, group.id)}
        />
      </div>
    </div>
  );
}
