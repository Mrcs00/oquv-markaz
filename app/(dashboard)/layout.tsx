import { Sidebar } from "@/components/Sidebar";
import { MobileBottomNav } from "@/components/MobileNav";
import { ToastProvider } from "@/components/ToastProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-dvh">
        <Sidebar />
        <div className="md:pl-64">
          <main className="pb-20 md:pb-8">{children}</main>
        </div>
        <MobileBottomNav />
      </div>
    </ToastProvider>
  );
}
