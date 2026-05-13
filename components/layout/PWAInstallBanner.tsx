"use client"
import { useState } from "react"
import { X, Download, Smartphone, Share } from "lucide-react"
import { usePWAInstall } from "@/hooks/usePWAInstall"

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall()
  const [dismissed, setDismissed]   = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [installing, setInstalling] = useState(false)
  const [done, setDone]             = useState(false)

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || dismissed || !isInstallable || done) return null

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return }
    setInstalling(true)
    const result = await triggerInstall()
    setInstalling(false)
    if (result === "accepted") setDone(true)
  }

  return (
    <>
      {/* ── Sticky bottom banner ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-lg">
          <div
            className="rounded-2xl border border-sky-500/30 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-sky-500/10 overflow-hidden"
            style={{ animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            {/* Gradient top strip */}
            <div className="h-0.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500" />

            <div className="flex items-center gap-4 p-4">
              {/* App icon */}
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/30 text-2xl">
                🚽
              </div>

              {/* Copy */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  Add Toilet Book to your home screen
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Instant access · Works offline · Find toilets near you
                </p>
                {/* Rating dots */}
                <div className="flex items-center gap-1 mt-1.5">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="text-amber-400 text-xs">{s}</span>
                  ))}
                  <span className="text-xs text-slate-500 ml-1">Free</span>
                </div>
              </div>

              {/* Install button */}
              <button
                onClick={handleInstall}
                disabled={installing}
                className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-sky-500/25 disabled:opacity-60"
              >
                {installing
                  ? <span className="animate-pulse">...</span>
                  : <><Download className="h-4 w-4" /> Install</>
                }
              </button>

              {/* Dismiss */}
              <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 text-slate-600 hover:text-slate-400 transition-colors p-1"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── iOS install guide sheet ── */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowIOSGuide(false)}
          />

          {/* Sheet */}
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl"
               style={{ animation: "slideUp 0.3s ease both" }}>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚽</div>
              <h2 className="text-lg font-bold text-white mb-1">Install Toilet Book</h2>
              <p className="text-sm text-slate-400">Add to your iPhone home screen in 2 steps</p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                  <Share className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Tap the Share button</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The share icon at the bottom of Safari — it looks like a box with an arrow pointing up
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Tap &quot;Add to Home Screen&quot;</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scroll down in the share sheet and tap &quot;Add to Home Screen&quot; — then tap Add in the top right
                  </p>
                </div>
              </div>
            </div>

            {/* Visual hint */}
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-3 mb-5 flex items-center gap-3">
              <div className="text-2xl">📱</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toilet Book will appear on your home screen like a native app — no App Store needed
              </p>
            </div>

            <button
              onClick={() => { setShowIOSGuide(false); setDismissed(true) }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Got it — I&apos;ll install it now
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  )
}
