import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getIndividualConfirmed } from "@/lib/data";

export default async function IndividualGroupPage() {
  const students = await getIndividualConfirmed();
  if (students.length === 0) notFound();

  return (
    <div>
      <PageHeader
        title="Individual o'quvchilar"
        subtitle={`${students.length} ta o'quvchi · guruhsiz`}
        backHref="/groups"
      />

      <div className="p-4 md:p-8 max-w-2xl">
        <div className="card divide-y divide-slate-100">
          {students.map((s) => (
            <Link
              key={s.id}
              href={`/students/${s.id}`}
              className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">{s.full_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.course?.name ?? "—"}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 shrink-0">
                <Phone className="w-3.5 h-3.5" />
                {s.phone}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
