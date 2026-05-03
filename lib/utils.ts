import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 6) return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "just now"
}

export function getStoreDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "")
    if (hostname.includes("amazon")) return "Amazon"
    if (hostname.includes("homedepot")) return "Home Depot"
    if (hostname.includes("lowes")) return "Lowe's"
    if (hostname.includes("wayfair")) return "Wayfair"
    if (hostname.includes("ikea")) return "IKEA"
    if (hostname.includes("target")) return "Target"
    if (hostname.includes("walmart")) return "Walmart"
    return hostname
  } catch {
    return "Shop"
  }
}
