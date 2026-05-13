"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Download, Smartphone, Share, MapPin, Star,
  Wifi, Zap, Shield, Coins, CheckCircle2
} from "lucide-react"
import { usePWAInstall } from "@/hooks/usePWAInstall"

const FEATURES = [
  { icon: <MapPin   className="h-5 w-5 text-sky-400" />,    title: "Find toilets near you",      desc: "47,000+ locations mapped worldwide with live cleanliness ratings" },
  { icon: <Star     className="h-5 w-5 text-amber-400" />,  title: "Rate any bathroom",           desc: "Post reviews, earn FLUSH tokens redeemable for crypto at launch" },
  { icon: <Wifi     className="h-5 w-5 text-emerald-400" />,title: "Works offline",               desc: "Previously loaded maps stay accessible — no signal needed" },
  { icon: <Shield   className="h-5 w-5 text-blue-400" />,   title: "Accessibility data",          desc: "Adult changing stations, family bathrooms, gender-neutral facilities" },
  { icon: <Zap      className="h-5 w-5 text-violet-400" />, title: "Instant access",              desc: "No app store. No download size. Launches from your home screen in 1 tap." },
  { icon: <Coins    className="h-5 w-5 text-yellow-400" />, title: "Earn FLUSH tokens",           desc: "Every review earns crypto rewards. Token launches on Solana August 28, 2026." },
]

const REVIEWS = [
  { name: "Sarah M.",    stars: 5, text: "Found an adult changing station for my son 5 minutes from our hotel. This app is genuinely life-changing for carers." },
  { name: "Jake T.",     stars: 5, text: "Rated 12 bathrooms on my road trip and earned enough FLUSH for a decent airdrop. Great concept." },
  { name: "Maria R.",    stars: 5, text: "Finally an app that tells you if the airport bathroom is worth the walk. Used it all through my Florida trip." },
]

export default function InstallPage() {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall()
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [installing, setInstalling]     = useState(false)
  const [installed, setInstalled]       = useState(false)

  const handleInstall = async () => {
    if (isIOS)           { setShowIOSGuide(true); return }
    if (!isInstallable)  { return }
    setInstalling(true)
    const result = await triggerInstall()
    setInstalling(false)
    if (result === "accepted") setInstalled(true)
  }

  if (isInstalled || installed) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Toilet Book is installed!</h1>
          <p className="text-slate-400 text-sm mb-6">Open it from your home screen anytime.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-sky-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-400 transition-colors">
            Go to Toilet Book
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-lg px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <span className="text-lg">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
            Open in browser →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-10">
          {/* App icon */}
          <div className="mx-auto mb-5 h-24 w-24 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center shadow-2xl shadow-sky-500/30 text-5xl"
               style={{ boxShadow: "0 0 60px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
            🚽
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Toilet Book</h1>
          <p className="text-slate-400 text-sm mb-1">Community toilet ratings · FLUSH crypto rewards</p>

          {/* Stars */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} className="text-amber-400">★</span>
            ))}
            <span className="text-xs text-slate-500 ml-2">Free · No account needed to browse</span>
          </div>

          {/* Install button */}
          {isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-sky-500/25 mb-3"
            >
              <Share className="h-5 w-5" />
              Add to Home Screen
            </button>
          ) : isInstallable ? (
            <button
              onClick={handleInstall}
              disabled={installing}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-sky-500/25 mb-3 disabled:opacity-60"
            >
              <Download className="h-5 w-5" />
              {installing ? "Installing..." : "Install App — Free"}
            </button>
          ) : (
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-4 rounded-2xl text-base hover:opacity-90 transition-all shadow-xl shadow-sky-500/25 mb-3"
            >
              <MapPin className="h-5 w-5" />
              Open Toilet Book
            </Link>
          )}

          <p className="text-xs text-slate-500">No App Store needed · Works on any device · 47K+ locations</p>
        </div>

        {/* Screenshots mockup */}
        <div className="relative mb-12 flex justify-center">
          <div className="relative">
            {/* Phone frame */}
            <div className="w-52 rounded-[2.5rem] border-4 border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
              <div className="h-6 bg-slate-800 flex items-center justify-center">
                <div className="w-16 h-1.5 rounded-full bg-slate-600" />
              </div>
              {/* Mock app screen */}
              <div className="bg-slate-950 p-3 min-h-[340px]">
                <div className="rounded-xl bg-slate-800 h-36 mb-3 flex items-center justify-center">
                  <span className="text-3xl">🗺️</span>
                </div>
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="rounded-xl bg-slate-800 p-3 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex-shrink-0 text-sm flex items-center justify-center">🚽</div>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-600 rounded w-3/4 mb-1.5" />
                        <div className="flex gap-0.5">{[1,2,3,4,5].map(s=><span key={s} className="text-amber-400 text-xs">★</span>)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-5 text-center">What you get</h2>
          <div className="space-y-3">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-4">
                <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-white mb-5 text-center">What people say</h2>
          <div className="space-y-3">
            {REVIEWS.map(({ name, stars, text }) => (
              <div key={name} className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{name}</p>
                    <div className="flex">{Array(stars).fill(0).map((_,i)=><span key={i} className="text-amber-400 text-xs">★</span>)}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom install CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-sky-500/10 to-indigo-600/10 border border-sky-500/20 p-6 text-center mb-6">
          <p className="text-lg font-bold text-white mb-1">Ready to install?</p>
          <p className="text-xs text-slate-400 mb-5">Free · No sign up needed to browse · Works offline</p>
          {isIOS ? (
            <button onClick={() => setShowIOSGuide(true)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity">
              <Share className="h-4 w-4" /> Add to Home Screen
            </button>
          ) : isInstallable ? (
            <button onClick={handleInstall} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity">
              <Download className="h-4 w-4" /> Install Toilet Book — Free
            </button>
          ) : (
            <Link href="/" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-opacity">
              <MapPin className="h-4 w-4" /> Open in Browser
            </Link>
          )}
        </div>

        <p className="text-center text-xs text-slate-600">© {new Date().getFullYear()} Toilet Book · <Link href="/privacy" className="hover:text-slate-400">Privacy</Link> · <Link href="/terms" className="hover:text-slate-400">Terms</Link></p>
      </div>

      {/* iOS guide sheet */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowIOSGuide(false)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl" style={{ animation: "slideUp 0.3s ease both" }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">📱</div>
              <h2 className="text-lg font-bold text-white">Add to Home Screen</h2>
              <p className="text-xs text-slate-400 mt-1">2 steps · Safari only · Takes 10 seconds</p>
            </div>
            <div className="space-y-4 mb-5">
              <div className="flex items-start gap-3 rounded-xl bg-slate-800 p-3">
                <div className="h-8 w-8 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0 text-sky-400 font-bold text-sm">1</div>
                <div>
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">Tap <Share className="h-4 w-4 text-sky-400 inline" /> Share</p>
                  <p className="text-xs text-slate-400 mt-0.5">The share icon at the bottom of Safari — box with upward arrow</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-800 p-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold text-sm">2</div>
                <div>
                  <p className="text-sm font-semibold text-white">Tap &quot;Add to Home Screen&quot;</p>
                  <p className="text-xs text-slate-400 mt-0.5">Scroll down in the share menu · then tap Add in the top right</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowIOSGuide(false)} className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm">
              Got it!
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  )
}
