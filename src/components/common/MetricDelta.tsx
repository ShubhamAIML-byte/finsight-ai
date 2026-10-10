import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface MetricDeltaProps {
  changePercent: number;
  className?: string;
  isInverse?: boolean; // if true, negative change is good (e.g. costs, debt)
  showSign?: boolean;
}

export function MetricDelta({
  changePercent,
  className,
  isInverse = false,
  showSign = true,
}: MetricDeltaProps) {
  if (isNaN(changePercent)) {
    return <span className="text-slate-400 text-xs">—</span>;
  }

  const isZero = Math.abs(changePercent) < 0.05;
  const isPositive = changePercent > 0;
  const isGood = isInverse ? !isPositive : isPositive;

  if (isZero) {
    return (
      <span className={cn("inline-flex items-center text-xs text-slate-500 font-medium gap-0.5", className)}>
        <Minus className="w-3.5 h-3.5" />
        0.0%
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-semibold gap-0.5",
        isGood ? "text-emerald-600" : "text-rose-600",
        className
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
      ) : (
        <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
      )}
      {formatPercent(changePercent, 1, showSign)}
    </span>
  );
}
