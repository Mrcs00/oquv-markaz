import { PageHeader } from "@/components/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";
import { LogOut, Mail } from "lucide-react";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <PageHeader title="Sozlamalar" />
      <div className="p-4 md:p-8 max-w-md space-y-5">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
            A
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-900">Administrator</p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5" />
              {user?.email ?? "—"}
            </p>
          </div>
        </div>

        <form action={signOut}>
          <button type="submit" className="btn-secondary text-danger-600 w-full">
            <LogOut className="w-4 h-4" />
            Tizimdan chiqish
          </button>
        </form>
      </div>
    </div>
  );
}
