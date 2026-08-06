import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korean center | Boshqaruv paneli",
  description: "O'quvchilarni ro'yxatga olish va guruhlarga joylashtirish tizimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="font-sans bg-surface text-slate-900 antialiased">{children}</body>
    </html>
  );
}
