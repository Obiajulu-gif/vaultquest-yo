import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address?: string, start = 6, end = 4) {
  if (!address) {
    return "Not connected";
  }

  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function formatPercent(value?: string | number | null, digits = 2) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return "N/A";
  }

  return `${numeric.toFixed(digits)}%`;
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

export function safeNumber(value: string | number | bigint | undefined | null) {
  if (value === null || value === undefined) {
    return 0;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatTokenFromUnits(value: bigint, decimals: number, digits = 4) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(Number(formatUnits(value, decimals)));
}

export function timeAgo(timestamp: number | string | undefined) {
  if (!timestamp) {
    return "Unknown";
  }

  const date = typeof timestamp === "number"
    ? new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000)
    : new Date(timestamp);

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
