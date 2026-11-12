"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Home,
  Users,
  Menu,
  X,
  Plus,
  Trash2,
  ClipboardCheck,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { signOut } from "@/lib/actions";

const BOTTOM_ITEMS = [
  { href: "/", label: "Bosh sahifa", icon: Home },
  { href: "/students", label: "O'quvchilar", icon: GraduationCap },
  { href: "/students/new", label: "Qo'shish", icon: Plus, primary: true },
  { href: "/groups", label: "Guruhlar", icon: Users },
];

const DRAWER_EXTRA = [
  { href: "/topik", label: "TOPIK", icon: ClipboardCheck },
  { href: "/deleted", label: "O'chirilganlar", icon: Trash2 },
  { href: "/settings", label: "Sozlamalar", icon: Settings },
];

export function MobileHeader({ title, backHref }: { title: string; backHref?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Menyu ochiq turganda orqadagi sahifa aylanib ketmasin
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur border-b border-slate-100">
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center justify-center w-11 h-11 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-100"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-11 h-11 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-100"
            aria-label="Menyu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-[15px] font-semibold text-slate-900 truncate">{title}</h1>
        <div className="w-11" />
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-cardHover flex flex-col animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between h-14 px-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <GraduationCap className="w-4.5 h-4.5 text-slate-900" />
                </div>
                <span className="font-semibold text-slate-900">Korean center</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Yopish"
                className="flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {[...BOTTOM_ITEMS.filter((i) => !i.primary), ...DRAWER_EXTRA].map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium ${
                      active ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-100 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-danger-600 hover:bg-danger-50"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                  Chiqish
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-100 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 h-16">
        {BOTTOM_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Yangi o'quvchi qo'shish"
                className="flex items-center justify-center"
              >
                <span className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-slate-900 shadow-cardHover -translate-y-1">
                  <Icon className="w-5 h-5" />
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium active:bg-slate-50 ${
                active ? "text-primary-600" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
