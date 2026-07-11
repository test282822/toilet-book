"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const WHITELIST_CLOSE = new Date("2026-08-21T23:59:59-04:00").getTime()

function getTimeLeft() {
  const diff = Math.max(0, WHITELIST_CLOSE - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done:    diff <= 0,
  }
}

// ── Live countdown to whitelist close ─────────────────────────
export function Countdown() {
  const [t, setT] = useState(getTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  // Avoid hydration mismatch — render placeholder until mounted
  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 text-slate-400 text-sm h-16">
        Whitelist closes August 21, 2026
      </div>
    )
  }

  if (t.done) {
    return (
      <p className="text-sm font-semibold text-red-500">
        Whitelist is closed — airdrop August 28, 2026
      </p>
    )
  }

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
        Whitelist closes in
      </p>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {[
          { v: t.days,    l: "days" },
          { v: t.hours,   l: "hrs" },
          { v: t.minutes, l: "min" },
          { v: t.seconds, l: "sec" },
        ].map(({ v, l }) => (
          <div
            key={l}
            className="flex flex-col items-center rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-2 min-w-[62px] backdrop-blur-sm"
          >
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
              {String(v).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">{l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sticky mobile CTA bar — appears after scrolling past hero ──
export function StickyCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-3 transition-transform duration-300 sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-900/20 backdrop-blur-lg p-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            Whitelist closes Aug 21
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Sign up free · earn FLUZH tokens
          </p>
        </div>
        <Link
          href="/signup?ref=landing"
          className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Join Free
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
