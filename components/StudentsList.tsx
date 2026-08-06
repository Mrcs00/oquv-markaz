"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronRight, Phone } from "lucide-react";
import { StatusBadge, CallResultBadge } from "@/components/Badges";
import { levelLabel } from "@/lib/constants";
import type { StudentWithRelations } from "@/lib/types";

export function StudentsList({ students }: { students: StudentWithRelations[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.full_name.toLowerCase().includes(q) || s.phone.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="O'quvchi qidirish… (ism yoki telefon)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center text-sm text-slate-400">O'quvchi topilmadi.</div>
      )}

      {/* Mobile: cards */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((s) => (
          <Link key={s.id} href={`/students/${s.id}`} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500 shrink-0">
              {s.full_name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 text-sm truncate">{s.full_name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" /> {s.phone}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {s.course?.name} · {levelLabel(s.level)}
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <StatusBadge status={s.status} />
                {s.call_result && <CallResultBadge result={s.call_result.result} />}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          </Link>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-500 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Ism</th>
              <th className="px-5 py-3 font-medium">Telefon</th>
              <th className="px-5 py-3 font-medium">Kurs</th>
              <th className="px-5 py-3 font-medium">Daraja</th>
              <th className="px-5 py-3 font-medium">Holat</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3.5">
                  <Link href={`/students/${s.id}`} className="font-medium text-slate-900 hover:text-primary-600">
                    {s.full_name}
                  </Link>
                </td>
                <td className="px-5 py-3.5 text-slate-600">{s.phone}</td>
                <td className="px-5 py-3.5 text-slate-600">{s.course?.name}</td>
                <td className="px-5 py-3.5 text-slate-600">{levelLabel(s.level)}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={s.status} />
                    {s.call_result && <CallResultBadge result={s.call_result.result} />}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/students/${s.id}`} className="text-primary-600 text-sm font-medium">
                    Ko'rish
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
