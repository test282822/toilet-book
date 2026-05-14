"use client"
import { useState } from "react"
import Link from "next/link"
import {
  Copy, Check, Share2, Users, Coins, Trophy,
  Mail, Star, ChevronRight, Gift, Zap, Bell, BellOff
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

const BADGE_CONFIG: Record<string, { emoji: string; label: string }> = {
  legend:      { emoji: "👑", label: "Legend" },
  expert:      { emoji: "💎", label: "Expert" },
  trusted:     { emoji: "⭐", label: "Trusted" },
  contributor: { emoji: "✅", label: "Contributor" },
  newcomer:    { emoji: "🌱", label: "Newcomer" },
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1)  return "today"
  if (d < 7)  return `${d}d ago`
  if (d < 30) return `${Math.floor(d / 7)}w ago`
  return `${Math.floor(d / 30)}mo ago`
}

interface Props {
  profile:  any
  referred: any[]
  rank:     number
  userId:   string
}

export function ReferralClient({ profile, referred, rank, userId }: Props) {
  const [copied, setCopied]         = useState(false)
  const [digestOn, setDigestOn]     = useState(profile.email_digest ?? false)
  const [digestLoading, setDigestLoading] = useState(false)

  const referralCode = profile.referral_code ?? ""
  const referralUrl  = `https://toilet-book.com/signup?ref=${referralCode}`
  const earnedFromRefs = (profile.referral_count ?? 0) * 50
  const flushBalance  = profile.flush_balance ?? 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      toast.success("Referral link copied!")
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error("Copy failed — select and copy manually")
    }
  }

  const handleShare = async () => {
    const text = `Join me on Toilet Book — rate bathrooms and earn FLUSH crypto! Use my link: ${referralUrl}`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join Toilet Book", text, url: referralUrl })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      toast.success("Share text copied!")
    }
  }

  const handleDigestToggle = async () => {
    setDigestLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ email_digest: !digestOn })
        .eq("id", userId)
      if (error) throw error
      setDigestOn(!digestOn)
      toast.success(!digestOn
        ? "Weekly digest enabled! You'll get your first email within 7 days."
        : "Weekly digest disabled."
      )
    } catch {
      toast.error("Could not update preference")
    } finally {
      setDigestLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <Gift className="h-6 w-6 text-emerald-500" />
          Refer friends, earn FLUSH
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Share your link. Every friend who joins earns you <strong className="text-emerald-500">+50 FLUSH points</strong> — that's 500 FLUSH tokens at launch.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Users className="h-4 w-4 text-emerald-400" />,  label: "Friends referred",  value: fmt(profile.referral_count ?? 0) },
          { icon: <Coins className="h-4 w-4 text-amber-400" />,    label: "Earned from refs",  value: fmt(earnedFromRefs) + " pts" },
          { icon: <Trophy className="h-4 w-4 text-violet-400" />,  label: "Leaderboard rank",  value: `#${rank}` },
        ].map(({ icon, label, value }) => (
          <div key={label} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
            <div className="flex justify-center mb-1.5">{icon}</div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Referral link card */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-200 dark:border-emerald-800 p-5">
        <p className="text-sm font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-emerald-500" />
          Your referral link
        </p>

        {/* URL box */}
        <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 mb-3">
          <code className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate select-all">
            {referralUrl}
          </code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {copied
              ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied!</>
              : <><Copy className="h-3.5 w-3.5" /> Copy</>
            }
          </button>
        </div>

        {/* Share button */}
        <button
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold py-3 text-sm hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Share2 className="h-4 w-4" />
          Share your link
        </button>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { label: "Reddit", href: `https://reddit.com/submit?url=${encodeURIComponent(referralUrl)}&title=Rate+bathrooms+and+earn+crypto+%F0%9F%9A%BD`, color: "hover:text-orange-500" },
            { label: "Twitter/X", href: `https://twitter.com/intent/tweet?text=Rate+bathrooms+%26+earn+FLUSH+crypto!+Join+Toilet+Book+%F0%9F%9A%BD&url=${encodeURIComponent(referralUrl)}`, color: "hover:text-sky-400" },
            { label: "WhatsApp", href: `https://wa.me/?text=Rate+bathrooms+%26+earn+crypto+with+Toilet+Book!+${encodeURIComponent(referralUrl)}`, color: "hover:text-emerald-500" },
          ].map(({ label, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors ${color}`}
            >
              {label} <ChevronRight className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">How it works</h2>
        <div className="space-y-3">
          {[
            { step: "1", icon: <Share2 className="h-4 w-4 text-sky-400" />,     text: "Share your unique referral link with friends, on Reddit, or social media" },
            { step: "2", icon: <Users className="h-4 w-4 text-emerald-400" />,  text: "Friend signs up and posts their first review using your link" },
            { step: "3", icon: <Coins className="h-4 w-4 text-amber-400" />,    text: "You both earn +50 FLUSH points — that's 500 FLUSH tokens at launch" },
            { step: "4", icon: <Trophy className="h-4 w-4 text-violet-400" />,  text: "Your referral count shows publicly on your profile and the leaderboard" },
          ].map(({ step, icon, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div className="flex items-center gap-2 flex-1">
                {icon}
                <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-2">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Points are credited after your referred friend posts their first review — not just on signup.
          </p>
        </div>
      </div>

      {/* Email digest toggle */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-4 w-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Weekly email digest</h2>
              {digestOn && (
                <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full px-2 py-0.5">On</span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get a weekly summary of the newest rated bathrooms near your most reviewed areas,
              your FLUSH balance update, and your rank on the leaderboard.
              Sent every Monday morning. Unsubscribe anytime.
            </p>
          </div>
          <button
            onClick={handleDigestToggle}
            disabled={digestLoading}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all disabled:opacity-50 ${
              digestOn
                ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                : "border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 hover:bg-sky-100"
            }`}
          >
            {digestOn
              ? <><BellOff className="h-4 w-4" /> Turn off</>
              : <><Bell className="h-4 w-4" /> Turn on</>
            }
          </button>
        </div>
      </div>

      {/* People you referred */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" />
            Friends you&apos;ve referred
          </h2>
          <span className="text-xs text-slate-400">{referred.length} total</span>
        </div>

        {referred.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">👋</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No referrals yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Share your link above — every friend who joins and posts a review earns you 500 FLUSH tokens
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {referred.map((r, i) => {
              const badge = BADGE_CONFIG[r.reviewer_badge ?? "newcomer"] ?? BADGE_CONFIG.newcomer
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {(r.username ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {r.username ?? "Anonymous"}
                    </p>
                    <p className="text-xs text-slate-400">Joined {timeAgo(r.created_at)}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-0.5">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {badge.emoji} {badge.label}
                    </p>
                    <p className="text-xs text-amber-500">{fmt(r.flush_balance ?? 0)} pts</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {referred.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <p className="text-xs text-slate-500">
              Total earned from referrals: <strong className="text-emerald-500">{fmt(earnedFromRefs)} pts = {fmt(earnedFromRefs * 10)} FLUSH tokens</strong>
            </p>
          </div>
        )}
      </div>

      {/* View leaderboard */}
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-800 p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">You&apos;re ranked #{rank} overall</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">See how you compare to the full community on the leaderboard</p>
        </div>
        <Link
          href="/leaderboard"
          className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors"
        >
          View <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  )
}
