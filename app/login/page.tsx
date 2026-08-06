"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("Email yoki parol noto'g'ri.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-card mb-4">
            <GraduationCap className="w-7 h-7 text-slate-900" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Korean center</h1>
          <p className="text-sm text-slate-500 mt-1">Administrator paneliga kirish</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-danger-50 text-danger-600 text-sm px-3.5 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input"
              placeholder="admin@markaz.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Parol
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Kirish
          </button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-6">
          Foydalanuvchi Supabase Authentication orqali tekshiriladi. Yangi admin qo'shish uchun
          Supabase dashboard &rarr; Authentication bo'limidan foydalaning.
        </p>
      </div>
    </div>
  );
}
