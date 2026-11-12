"use client";

import { Search, X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className="input pl-10 pr-11"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Klaviaturadagi "Qidirish" tugmasi klaviaturani yopadi
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      {value && (
        <button
          type="button"
          aria-label="Tozalash"
          onClick={() => onChange("")}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 text-slate-400 active:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
