"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  GraduationCap as StudentsIcon,
  Users,
  Trash2,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/actions";

const NAV_ITEMS = [
  { href: "/", label: "Bosh sahifa", icon: Home },
  { href: "/students", label: "Yangi o'quvchilar", icon: StudentsIcon },
  { href: "/groups", label: "Guruhlar", icon: Users },
  { href: "/deleted", label: "O'chirilganlar", icon: Trash2 },
  { href: "/settings", label: "Sozlamalar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-100 bg-white">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-slate-900" />
        </div>
        <span className="font-semibold text-slate-900 truncate">Korean center</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0">
            A
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              title="Chiqish"
              className="p-2 rounded-lg text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
