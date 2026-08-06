import { MobileHeader } from "@/components/MobileNav";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <MobileHeader title={title} />
      <div className="hidden md:flex items-center justify-between px-8 h-16 border-b border-slate-100 bg-white sticky top-0 z-30">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
    </>
  );
}
