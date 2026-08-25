import Link from "next/link";
import { GraduationCap, Users, PhoneCall, UserCheck, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/Badges";
import { getDashboardStats } from "@/lib/data";
import { READY_POOL_SIZE } from "@/lib/constants";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader
        title="Bosh sahifa"
        action={
          <Link href="/students/new" className="btn-primary">
            + Yangi o'quvchi
          </Link>
        }
      />

      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Statistik kartalar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard label="Yangi o'quvchilar" value={stats.newStudents} icon={GraduationCap} tone="primary" />
          <StatCard label="Faol guruhlar" value={stats.activeGroups} icon={Users} tone="slate" />
          <StatCard label="Guruh ochishga tayyor" value={stats.readyToOpen} icon={PhoneCall} tone="warning" />
          <StatCard label="Jami o'quvchilar" value={stats.totalStudents} icon={UserCheck} tone="success" />
        </div>

        {/* Guruhlarni yig'ish (0 dan boshlaydiganlar) + Individual kutayotganlar */}
        {(stats.pools.length > 0 || stats.individualWaiting.length > 0) && (
          <section>
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Guruhlarni yig'ish</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stats.pools.map((pool) => (
                <div key={pool.courseId} className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{pool.courseName} — Beginner</p>
                      <p className="text-sm text-slate-500 mt-0.5">Daraja: 0 dan</p>
                    </div>
                    {pool.ready ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-success-50 text-success-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                        Tayyor
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        Yig'ilmoqda
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-500">Yig'ilgan</span>
                      <span className="font-medium text-slate-900">
                        {pool.count} / {READY_POOL_SIZE}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${pool.ready ? "bg-success-500" : "bg-primary-500"}`}
                        style={{ width: `${Math.min(100, (pool.count / READY_POOL_SIZE) * 100)}%` }}
                      />
                    </div>
                    {!pool.ready && (
                      <p className="text-xs text-slate-400 mt-1.5">
                        To'liq holat uchun yana {READY_POOL_SIZE - pool.count} ta o'quvchi kerak — lekin
                        xohlagan payt telefon qilishni boshlashingiz mumkin.
                      </p>
                    )}
                  </div>

                  <Link href={`/call/${pool.courseId}`} className="btn-primary w-full mt-4">
                    <PhoneCall className="w-4 h-4" />
                    Telefon qilish va natijalarni kiritish
                  </Link>
                </div>
              ))}

              {stats.individualWaiting.length > 0 && (
                <div className="card p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">Individual</p>
                      <p className="text-sm text-slate-500 mt-0.5">Daraja: 0 dan · guruhsiz</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                      {stats.individualWaiting.length} ta
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 max-h-48 overflow-y-auto">
                    {stats.individualWaiting.map((s) => (
                      <Link
                        key={s.id}
                        href={`/students/${s.id}`}
                        className="flex items-center justify-between gap-2 py-2 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-sm text-slate-900 truncate">{s.full_name}</span>
                        <span className="text-xs text-slate-400 shrink-0">{s.phone}</span>
                      </Link>
                    ))}
                  </div>

                  <Link href="/call/individual" className="btn-primary w-full mt-4">
                    <PhoneCall className="w-4 h-4" />
                    Telefon qilish va natijalarni kiritish
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Yaqinda qo'shilgan o'quvchilar */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Yaqinda qo'shilgan o'quvchilar</h2>
            <Link href="/students" className="text-sm text-primary-600 font-medium flex items-center gap-1">
              Barchasi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="card divide-y divide-slate-100">
            {stats.recentStudents.length === 0 && (
              <p className="p-5 text-sm text-slate-400">Hozircha o'quvchilar yo'q.</p>
            )}
            {stats.recentStudents.map((s) => (
              <Link
                key={s.id}
                href={`/students/${s.id}`}
                className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{s.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {s.course?.name} · {s.phone}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
