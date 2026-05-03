"use client"
import { useEffect, useState } from "react"
import { ShowerHead, X } from "lucide-react"

const STORAGE_KEY = "bv_content_warning_dismissed"

export function ContentWarning() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem(STORAGE_KEY) === "1"
      if (!dismissed) setVisible(true)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="alert"
      className="relative w-full border-b border-sky-200/80 bg-gradient-to-r from-sky-50 via-white to-sky-50 dark:border-sky-900/50 dark:from-sky-950/40 dark:via-slate-950 dark:to-sky-950/40"
    >
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3 sm:items-center sm:px-6">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/50 sm:mt-0">
          <ShowerHead className="h-4 w-4 text-sky-500" />
        </div>
        <p className="flex-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Heads up. </span>
          Toilet Book contains real user photos of bathrooms. Some images may
          include toilets, sinks, showers, and occasionally bodily waste (poop
          or pee). Viewer discretion advised.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={dismiss}
            className="rounded-lg border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm transition-all hover:bg-sky-50 hover:shadow dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-400 dark:hover:bg-sky-900/60"
          >
            Got it
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="rounded-lg p-1 text-slate-400 hover:bg-sky-100 hover:text-slate-600 dark:hover:bg-sky-900/50 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
