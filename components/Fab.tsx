import Link from "next/link";

// Telefonda o'ng pastda suzib turadigan "+" tugmasi (kompyuterda ko'rinmaydi).
export const fabClass =
  "md:hidden fixed right-4 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 w-14 h-14 rounded-full bg-primary-500 text-slate-900 shadow-cardHover flex items-center justify-center active:scale-95 transition-transform";

export function FabLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} aria-label={label} className={fabClass}>
      {children}
    </Link>
  );
}
