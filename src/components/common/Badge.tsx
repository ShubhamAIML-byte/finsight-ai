import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "positive"
  | "negative"
  | "neutral"
  | "warning"
  | "ai"
  | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-800 border-slate-200",
    positive: "bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium",
    negative: "bg-rose-50 text-rose-700 border-rose-200/80 font-medium",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80 font-medium",
    ai: "bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium",
    outline: "bg-transparent text-slate-700 border-slate-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border tracking-tight transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
