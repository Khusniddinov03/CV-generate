"use client";

import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "ai";

export function Button({
  variant = "secondary",
  size = "md",
  loading,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all",
        "disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
        variant === "secondary" &&
          "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
        variant === "ghost" && "text-slate-600 hover:bg-slate-100",
        variant === "danger" && "text-red-600 hover:bg-red-50",
        variant === "ai" &&
          "text-white shadow-lg shadow-brand-500/25 bg-gradient-to-r from-brand-600 via-violet-600 to-fuchsia-600 hover:brightness-110",
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

const field =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(field, "h-9", className)} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={clsx(field, "resize-y leading-relaxed", className)} />;
}

export function Field({
  label,
  children,
  className,
  action,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <label className={clsx("block", className)}>
      <span className="mb-1 flex items-center justify-between text-xs font-medium text-slate-500">
        {label}
        {action}
      </span>
      {children}
    </label>
  );
}
