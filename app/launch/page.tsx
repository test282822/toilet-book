import { Metadata } from "next"
import Link from "next/link"
import {
  Sparkles, ArrowRight, MapPin, Star, Coins,
  CheckCircle2, XCircle, Toilet, Accessibility
} from "lucide-react"
import { Countdown, StickyCTA } from "@/components/launch/LaunchClient"

const MINT = "3rQ2XfkPEYnB5tbkupWkFQmKT983MvG15Jaqr6DH9gk9"

export const metadata: Metadata = {
  title: "Rate a Bathroom. Earn Real Crypto. — Toilet Book",
  description:
    "Rate public bathrooms, earn FLUZH tokens on Solana. 47,000+ locations mapped. Whitelist closes August 21, 2026 — airdrop August 28. Join free.",
  openGraph: {
    title: "Rate a Bathroom. Earn Real Crypto. 🚽",
    description:
      "Toilet Book pays you FLUZH tokens on Solana for rating public bathrooms. 47,000+ locations. Whitelist closes Aug 21. Free to join.",
    url: "https://toilet-book.com/launch",
    siteName: "Toilet Book",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rate a Bathroom. Earn Real Crypto. 🚽",
    description:
      "FLUZH tokens on Solana for rating bathrooms. 47K+ locations. Whitelist closes Aug 21.",
    images: ["/opengraph-image.png"],
  },
}

// ── Section data ─────────────────────────────────────────────
const STEPS = [
  { icon: <MapPin className="h-6 w-6 text-sky-500" />,    step: "1", title: "Find a bathroom",     desc: "Any public restroom, anywhere on Earth." },
  { icon: <Star className="h-6 w-6 text-amber-400" />,    step: "2", title: "Rate it in 10 seconds", desc: "Stars, a photo, done." },
  { icon: <Coins className="h-6 w-6 text-emerald-500" />, step: "3", title: "Earn FLUZH tokens",   desc: "Real crypto on Solana. Airdrop Aug 28." },
]

const DIFFERENCES = [
  { label: "Crypto rewards for every review",       us: true, them: false },
  { label: "Adult changing station tracking",       us: true, them: false },
  { label: "Photo-verified reviews",                us: true, them: false },
  { label: "Family & gender-neutral bathroom data", us: true, them: false },
  { label: "Free forever, no ads in the app",       us: true, them: false },
]

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function LaunchPage() {
  // If already signed in, skip the pitch — straight to the app
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">

      {/* ══════════════════ 1 · HERO ══════════════════ */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-800/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-200/40 dark:bg-indigo-800/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="text-5xl mb-5">🚽</div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-5 leading-[1.1]">
            Rate a bathroom.{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Earn real crypto.
            </span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            Every bathroom you review earns FLUZH tokens on Solana. Free to join — the community airdrop is August 28.
          </p>

          <Link
            href="/signup?ref=landing"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/30 hover:opacity-90 active:scale-[0.98] transition-all mb-10"
          >
            <Sparkles className="h-5 w-5" />
            Join Free — Earn FLUZH
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Countdown />
        </div>
      </section>

      {/* ══════════════════ 2 · SOCIAL PROOF STRIP ══════════════════ */}
      <section className="border-y border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-4 px-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <MapPin className="h-4 w-4 text-sky-500" /> 47,000+ locations mapped
          </span>
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Token live on Solana
          </span>
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
            <Coins className="h-4 w-4 text-amber-400" /> Community airdrop Aug 28
          </span>
        </div>
      </section>

      {/* ══════════════════ 3 · HOW IT WORKS ══════════════════ */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-10">
            Three steps. Ten seconds.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STEPS.map(({ icon, step, title, desc }) => (
              <div
                key={step}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center shadow-sm"
              >
                <div className="flex justify-center mb-3">{icon}</div>
                <div className="text-xs font-bold text-sky-500 mb-1">STEP {step}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ 4 · WHY DIFFERENT ══════════════════ */}
      <section className="px-4 py-14 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
            No other app does this
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8">
            Bathroom finders exist. None of them pay you or track what actually matters.
          </p>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="grid grid-cols-[1fr_auto_auto] text-sm">
              <div className="px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-800"></div>
              <div className="px-4 py-3 font-bold text-sky-500 text-center border-b border-slate-100 dark:border-slate-800">Toilet Book</div>
              <div className="px-4 py-3 font-semibold text-slate-400 text-center border-b border-slate-100 dark:border-slate-800">Others</div>
              {DIFFERENCES.map(({ label, us, them }) => (
                <div key={label} className="contents">
                  <div className="px-4 py-3 text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-800/50 last:border-0">{label}</div>
                  <div className="px-4 py-3 text-center border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                    {us ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-slate-300 inline" />}
                  </div>
                  <div className="px-4 py-3 text-center border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                    {them ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" /> : <XCircle className="h-4 w-4 text-slate-300 dark:text-slate-600 inline" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ 5 · TOKEN PROOF ══════════════════ */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-emerald-500/20 px-5 py-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-400/20 flex items-center justify-center text-lg">🚽</div>
              <div>
                <p className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                  FLUZH Token
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">
                    ✓ Live on Solana
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Deployed May 22, 2026 · 1 billion supply · Airdrop Aug 28
                </p>
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Token Mint Address — verify it yourself</p>
                <div className="rounded-xl bg-slate-950 border border-slate-700 px-4 py-3">
                  <code className="text-xs text-emerald-400 break-all font-mono select-all">{MINT}</code>
                </div>
              </div>
              <a
                href={`https://solscan.io/token/${MINT}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-sm font-semibold py-2.5 hover:bg-sky-500/20 transition-colors"
              >
                View on Solscan →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ 6 · THE REAL PROBLEM ══════════════════ */}
      <section className="px-4 py-14 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-2xl text-center">
          <Accessibility className="h-8 w-8 text-sky-500 mx-auto mb-4" />
          <blockquote className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-4">
            Millions of Americans need an adult changing table to use a public bathroom.
            Most cities have zero mapped.
          </blockquote>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto mb-6">
            Families, caregivers, and people with disabilities plan entire trips around bathroom access.
            Toilet Book is the first platform that tracks adult changing stations, family bathrooms, and
            gender-neutral facilities at scale — built by the community, for everyone. Every review makes
            someone&apos;s day genuinely easier.
          </p>
          <p className="text-xs text-slate-400">
            That&apos;s the mission. The crypto is how we say thank you.
          </p>
        </div>
      </section>

      {/* ══════════════════ 7 · FINAL CTA ══════════════════ */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
            The whitelist won&apos;t wait.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Whitelist closes <strong className="text-slate-700 dark:text-slate-200">August 21</strong>.
            Airdrop <strong className="text-slate-700 dark:text-slate-200">August 28</strong>.
            Sign up now, earn 50 FLUZH points instantly — that&apos;s 500 tokens on day one.
          </p>
          <Link
            href="/signup?ref=landing"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/30 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Sparkles className="h-5 w-5" />
            Claim Your Spot — Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="mt-5">
            <Link
              href="/map"
              className="text-sm text-slate-400 hover:text-sky-500 transition-colors underline underline-offset-4"
            >
              or just browse the map first
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ 8 · MINIMAL FOOTER ══════════════════ */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 px-4 py-8">
        <div className="mx-auto max-w-2xl flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
              <Toilet className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-white">Toilet Book</span>
          </div>
          <p className="text-xs text-slate-400">Rating the world&apos;s restrooms, one flush at a time</p>
          <div className="flex gap-5 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-sky-500 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-sky-500 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <StickyCTA />
    </div>
  )
}
