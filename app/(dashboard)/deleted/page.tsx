import { PageHeader } from "@/components/PageHeader";
import { ConfirmButton } from "@/components/ConfirmButton";
import { getDeletedStudents } from "@/lib/data";
import { restoreStudent, permanentlyDeleteStudent } from "@/lib/actions";
import { RotateCcw, Trash2 } from "lucide-react";

export default async function DeletedStudentsPage() {
  const students = await getDeletedStudents();

  return (
    <div>
      <PageHeader title="O'chirilganlar" />
      <div className="p-4 md:p-8">
        {students.length === 0 ? (
          <div className="card p-10 text-center text-sm text-slate-400">
            O'chirilgan o'quvchilar yo'q.
          </div>
        ) : (
          <div className="card divide-y divide-slate-100">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{s.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {s.phone} · {s.course?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ConfirmButton
                    label="Tiklash"
                    confirmLabel="Tiklash"
                    title="O'quvchini tiklash"
                    description="Ushbu o'quvchini yangi o'quvchilar ro'yxatiga qaytarmoqchimisiz?"
                    variant="primary"
                    className="btn-secondary"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                    action={restoreStudent.bind(null, s.id)}
                    successMessage="O'quvchi tiklandi."
                  />
                  <ConfirmButton
                    label="Butunlay o'chirish"
                    confirmLabel="O'chirish"
                    title="Butunlay o'chirish"
                    description="Bu amalni bekor qilib bo'lmaydi. O'quvchi ma'lumotlari butunlay o'chiriladi."
                    variant="danger"
                    className="btn-secondary text-danger-600"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    action={permanentlyDeleteStudent.bind(null, s.id)}
                    successMessage="O'quvchi butunlay o'chirildi."
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
