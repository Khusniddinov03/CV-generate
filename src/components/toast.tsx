"use client";

import clsx from "clsx";
import { CheckCircle2, XCircle } from "lucide-react";
import { create } from "zustand";

type Toast = { id: number; kind: "success" | "error"; text: string };

const useToasts = create<{ items: Toast[]; push: (t: Omit<Toast, "id">) => void }>((set) => ({
  items: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ items: [...s.items, { ...t, id }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((x) => x.id !== id) })), 5000);
  },
}));

export const toast = {
  success: (text: string) => useToasts.getState().push({ kind: "success", text }),
  error: (text: string) => useToasts.getState().push({ kind: "error", text }),
};

export function Toaster() {
  const items = useToasts((s) => s.items);
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={clsx(
            "pointer-events-auto flex items-start gap-2 rounded-xl border bg-white px-4 py-3 text-sm shadow-xl",
            t.kind === "success" ? "border-emerald-200" : "border-red-200",
          )}
        >
          {t.kind === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
          ) : (
            <XCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
          )}
          <span className="text-slate-700">{t.text}</span>
        </div>
      ))}
    </div>
  );
}
