"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ToastProvider";

interface ConfirmButtonProps {
  label: string;
  confirmLabel: string;
  title: string;
  description: string;
  variant?: "danger" | "primary" | "success";
  className?: string;
  icon?: React.ReactNode;
  action: () => Promise<{ success?: boolean; error?: string } | void>;
  successMessage?: string;
  redirectOnSuccess?: string;
}

export function ConfirmButton({
  label,
  confirmLabel,
  title,
  description,
  variant = "danger",
  className,
  icon,
  action,
  successMessage,
  redirectOnSuccess,
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await action();
      setOpen(false);
      if (result && "error" in result && result.error) {
        showToast(result.error, "error");
        return;
      }
      if (successMessage) showToast(successMessage, "success");
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
        router.refresh();
      }
    });
  }

  const confirmBtnClass =
    variant === "danger" ? "btn-danger" : variant === "success" ? "btn-success" : "btn-primary";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {icon}
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => !isPending && setOpen(false)} />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-cardHover animate-in fade-in slide-in-from-bottom-4 duration-150">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1.5">{description}</p>
            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setOpen(false)}
                className="btn-secondary flex-1"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirm}
                className={`${confirmBtnClass} flex-1`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
