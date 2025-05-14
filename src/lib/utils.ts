
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact: boolean = false): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(amount);
}

export function getRandomColor(index: number): string {
  const colors = [
    "#3366CC", "#DC3912", "#FF9900", "#109618", 
    "#990099", "#0099C6", "#DD4477", "#66AA00",
    "#B82E2E", "#316395", "#994499", "#22AA99"
  ];
  return colors[index % colors.length];
}
