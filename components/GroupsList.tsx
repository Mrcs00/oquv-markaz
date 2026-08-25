"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Users, Clock, Calendar, UserCheck } from "lucide-react";
import { levelLabel } from "@/lib/constants";
import type { Group } from "@/lib/types";

type GroupRow = Group & { course: { name: string } | null; students: { id: string }[] };

export function GroupsList({
  groups,
  individualCount = 0,
}: {
  groups: GroupRow[];
  individualCount?: number;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter(
      (g) => g.name.toLowerCase().includes(q) || g.course?.name.toLowerCase().includes(q)
    );
  }, [groups, search]);

  const showIndividualCard = individualCount > 0 && !search.trim();

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="input pl-10"
          placeholder="Guruh qidirish…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && !showIndividualCard && (
        <div className="card p-10 text-center text-sm text-slate-400">Guruh topilmadi.</div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {showIndividualCard && (
          <Link href="/groups/individual" className="card p-5 hover:shadow-cardHover transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">Individual o'quvchilar</p>
                <p className="text-xs text-slate-500 mt-0.5">Koreys tili · guruhsiz</p>
              </div>
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-success-50 text-success-600">
                Kelaman
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              {individualCount} ta o'quvchi
            </div>
          </Link>
        )}
        {filtered.map((g) => {
          const count = g.students?.length ?? 0;
          const full = count >= g.max_students;
          const levelText =
            g.min_level === g.max_level
              ? levelLabel(g.min_level)
              : `${levelLabel(g.min_level)} – ${levelLabel(g.max_level)}`;

          return (
            <Link key={g.id} href={`/groups/${g.id}`} className="card p-5 hover:shadow-cardHover transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{g.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {g.course?.name} · {levelText}
                  </p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    full ? "bg-danger-50 text-danger-600" : "bg-success-50 text-success-600"
                  }`}
                >
                  {full ? "To'liq" : "Faol"}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {g.teacher_name || "O'qituvchi belgilanmagan"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {g.schedule_days?.join(" / ") || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {g.schedule_time || "—"}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">O'quvchilar</span>
                  <span className="font-medium text-slate-700">
                    {count} / {g.max_students}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${full ? "bg-danger-500" : "bg-primary-500"}`}
                    style={{ width: `${Math.min(100, (count / g.max_students) * 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
