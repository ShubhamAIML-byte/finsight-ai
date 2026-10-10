import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number | undefined | null,
  currency: string = "$",
  decimals: number = 2,
  isBillions: boolean = true
): string {
  if (value === undefined || value === null || isNaN(value)) return "N/A";
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (isBillions) {
    return `${sign}${currency}${absValue.toFixed(decimals)}B`;
  }

  return `${sign}${currency}${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absValue)}`;
}

export function formatPercent(
  value: number | undefined | null,
  decimals: number = 1,
  showPlus: boolean = false
): string {
  if (value === undefined || value === null || isNaN(value)) return "N/A";
  const sign = value > 0 && showPlus ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatNumber(
  value: number | undefined | null,
  decimals: number = 2
): string {
  if (value === undefined || value === null || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatCompactNumber(value: number): string {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}
