"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { useToast } from "@/components/ToastProvider";
import {
  createTopikApplicant,
  updateTopikApplicant,
  deleteTopikApplicant,
} from "@/lib/actions";
import type { TopikApplicant, TopikResult } from "@/lib/types";

const RESULT_META: Record<TopikResult, { label: string; className: string }> = {
  kutilmoqda: { label: "Kutilmoqda", className: "bg-slate-100 text-slate-600" },
  otdi: { label: "O'tdi", className: "bg-success-50 text-success-600" },
  otmadi: { label: "O'tmadi", className: "bg-danger-50 text-danger-600" },
};

const levelLabel = (level: number) => (level === 1 ? "TOPIK I" : "TOPIK II");

// "2005-03-15" -> "15.03.2005" (Date ishlatilmaydi, vaqt zonasi siljishi bo'lmasligi uchun)
function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

function ResultBadge({ result }: { result: TopikResult }) {
  const meta = RESULT_META[result];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

export function TopikManager({ applicants }: { applicants: TopikApplicant[] }) {
  const [search, setSearch] = useState("");
  const [roundFilter, setRoundFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [editing, setEditing] = useState<TopikApplicant | "new" | null>(null);

  const rounds = useMemo(
    () => Array.from(new Set(applicants.map((a) => a.exam_round))).sort((a, b) => b - a),
    [applicants]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applicants.filter((a) => {
      if (roundFilter && String(a.exam_round) !== roundFilter) return false;
      if (levelFilter && String(a.level) !== levelFilter) return false;
      if (resultFilter && a.result !== resultFilter) return false;
      if (!q) return true;
      const haystack = [
        a.first_name,
        a.last_name,
        `${a.first_name} ${a.last_name}`,
        `${a.last_name} ${a.first_name}`,
        a.exam_number,
        a.birth_date ? `${formatDate(a.birth_date)}|${a.birth_date}` : "",
      ]
        .join("|")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [applicants, search, roundFilter, levelFilter, resultFilter]);

  const hasFilters = search || roundFilter || levelFilter || resultFilter;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="input pl-10"
              placeholder="Qidirish… (ism, familiya, raqam yoki tug'ilgan sana)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="button" onClick={() => setEditing("new")} className="btn-primary shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Qo'shish</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:max-w-xl">
          <select
            className="input"
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            aria-label="Imtihon raundi"
          >
            <option value="">Barcha raundlar</option>
            {rounds.map((r) => (
              <option key={r} value={r}>
                {r}-imtihon
              </option>
            ))}
          </select>
          <select
            className="input"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Daraja"
          >
            <option value="">Barcha darajalar</option>
            <option value="1">TOPIK I</option>
            <option value="2">TOPIK II</option>
          </select>
          <select
            className="input"
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            aria-label="Natija"
          >
            <option value="">Barcha natijalar</option>
            <option value="kutilmoqda">Kutilmoqda</option>
            <option value="otdi">O'tdi</option>
            <option value="otmadi">O'tmadi</option>
          </select>
        </div>

        <p className="text-sm text-slate-500">
          {hasFilters
            ? `${filtered.length} ta topildi (jami ${applicants.length} ta)`
            : `Jami: ${applicants.length} ta`}
        </p>
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center text-sm text-slate-400">
          {applicants.length === 0
            ? "Hali hech kim kiritilmagan. \"Qo'shish\" tugmasi bilan birinchi o'quvchini kiriting."
            : "Hech narsa topilmadi. Qidiruv yoki filtrni o'zgartirib ko'ring."}
        </div>
      )}

      {/* Mobil: kartalar */}
      <div className="grid gap-3 md:hidden">
        {filtered.map((a) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm">
                  {a.first_name} {a.last_name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {a.exam_round}-imtihon · {levelLabel(a.level)}
                </p>
              </div>
              <ResultBadge result={a.result} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Imtihon raqami</p>
                <p className="text-slate-900 font-medium tabular-nums">{a.exam_number}</p>
              </div>
              <div>
                <p className="text-slate-400">Tug'ilgan sana</p>
                <p className="text-slate-900 font-medium tabular-nums">{formatDate(a.birth_date)}</p>
              </div>
            </div>
            {a.note && <p className="text-xs text-slate-500 mt-2.5">{a.note}</p>}
            <div className="flex gap-2 mt-3.5">
              <button type="button" onClick={() => setEditing(a)} className="btn-secondary flex-1 !py-2">
                <Pencil className="w-3.5 h-3.5" />
                Tahrirlash
              </button>
              <DeleteButton applicant={a} compact />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: jadval */}
      {filtered.length > 0 && (
        <div className="hidden md:block card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="px-5 py-3 font-medium">Imtihon</th>
                <th className="px-5 py-3 font-medium">Imtihon raqami</th>
                <th className="px-5 py-3 font-medium">Familiya</th>
                <th className="px-5 py-3 font-medium">Ism</th>
                <th className="px-5 py-3 font-medium">Tug'ilgan sana</th>
                <th className="px-5 py-3 font-medium">Natija</th>
                <th className="px-5 py-3 font-medium">Izoh</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                    {a.exam_round}-imtihon · {levelLabel(a.level)}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900 tabular-nums">
                    {a.exam_number}
                  </td>
                  <td className="px-5 py-3.5 text-slate-900">{a.last_name}</td>
                  <td className="px-5 py-3.5 text-slate-900">{a.first_name}</td>
                  <td className="px-5 py-3.5 text-slate-600 tabular-nums">{formatDate(a.birth_date)}</td>
                  <td className="px-5 py-3.5">
                    <ResultBadge result={a.result} />
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-[220px] truncate" title={a.note}>
                    {a.note || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(a)}
                        title="Tahrirlash"
                        aria-label="Tahrirlash"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <DeleteButton applicant={a} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ApplicantSheet
          key={editing === "new" ? "new" : editing.id}
          applicant={editing === "new" ? null : editing}
          defaults={{
            exam_round: roundFilter || String(rounds[0] ?? ""),
            level: levelFilter || "2",
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function DeleteButton({ applicant, compact }: { applicant: TopikApplicant; compact?: boolean }) {
  return (
    <ConfirmButton
      label=""
      icon={<Trash2 className="w-4 h-4" />}
      className={
        compact
          ? "btn-secondary !py-2 !px-3 text-danger-600"
          : "p-2 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
      }
      confirmLabel="O'chirish"
      title="O'chirilsinmi?"
      description={`${applicant.first_name} ${applicant.last_name} (${applicant.exam_round}-imtihon, ${levelLabel(applicant.level)}, ${applicant.exam_number}) ro'yxatdan butunlay o'chiriladi.`}
      variant="danger"
      action={() => deleteTopikApplicant(applicant.id)}
      successMessage="O'chirildi"
    />
  );
}

function ApplicantSheet({
  applicant,
  defaults,
  onClose,
}: {
  applicant: TopikApplicant | null;
  defaults: { exam_round: string; level: string };
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const isEdit = applicant !== null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = isEdit
        ? await updateTopikApplicant(applicant.id, formData)
        : await createTopikApplicant(formData);
      if (result.error) {
        showToast(result.error, "error");
        return;
      }
      showToast(isEdit ? "Saqlandi" : "Qo'shildi", "success");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={() => !isPending && onClose()} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full sm:max-w-lg max-h-[92dvh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-cardHover animate-in fade-in slide-in-from-bottom-4 duration-150"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">
            {isEdit ? "Ma'lumotni tahrirlash" : "Yangi o'quvchi qo'shish"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Yopish"
            className="p-2 -mr-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="exam_round">
              Imtihon raundi
            </label>
            <input
              id="exam_round"
              name="exam_round"
              type="number"
              inputMode="numeric"
              min={1}
              required
              placeholder="108"
              className="input"
              defaultValue={applicant?.exam_round ?? defaults.exam_round}
              autoFocus={!isEdit}
            />
          </div>
          <div>
            <label className="label" htmlFor="level">
              Daraja
            </label>
            <select
              id="level"
              name="level"
              className="input"
              defaultValue={applicant?.level ?? defaults.level}
            >
              <option value="1">TOPIK I</option>
              <option value="2">TOPIK II</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="label" htmlFor="exam_number">
              Imtihon raqami
            </label>
            <input
              id="exam_number"
              name="exam_number"
              required
              inputMode="numeric"
              className="input tabular-nums"
              defaultValue={applicant?.exam_number ?? ""}
            />
          </div>

          <div>
            <label className="label" htmlFor="first_name">
              Ism
            </label>
            <input
              id="first_name"
              name="first_name"
              required
              className="input"
              defaultValue={applicant?.first_name ?? ""}
            />
          </div>
          <div>
            <label className="label" htmlFor="last_name">
              Familiya
            </label>
            <input
              id="last_name"
              name="last_name"
              required
              className="input"
              defaultValue={applicant?.last_name ?? ""}
            />
          </div>

          <div>
            <label className="label" htmlFor="birth_date">
              Tug'ilgan sana
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              min="1900-01-01"
              max={new Date().toISOString().slice(0, 10)}
              className="input tabular-nums"
              defaultValue={applicant?.birth_date ?? ""}
            />
          </div>
          <div>
            <label className="label" htmlFor="result">
              Natija
            </label>
            <select
              id="result"
              name="result"
              className="input"
              defaultValue={applicant?.result ?? "kutilmoqda"}
            >
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="otdi">O'tdi</option>
              <option value="otmadi">O'tmadi</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="label" htmlFor="note">
              Izoh
            </label>
            <input id="note" name="note" className="input" defaultValue={applicant?.note ?? ""} />
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button type="button" onClick={onClose} disabled={isPending} className="btn-secondary flex-1">
            Bekor qilish
          </button>
          <button type="submit" disabled={isPending} className="btn-primary flex-1">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Saqlash
          </button>
        </div>
      </form>
    </div>
  );
}
