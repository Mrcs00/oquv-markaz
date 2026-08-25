import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MobileHeader } from "@/components/MobileNav";

export function PageHeader({
  title,
  subtitle,
  action,
  backHref,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <>
      <MobileHeader title={title} backHref={backHref} />
      <div className="hidden md:flex items-center justify-between px-8 h-16 border-b border-slate-100 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center justify-center w-9 h-9 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Orqaga"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </Link>
          )}
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
    </>
  );
}
