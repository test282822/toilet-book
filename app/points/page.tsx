import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { redirect } from "next/navigation"
import { Toilet, Star, ThumbsUp, Users, Zap, Gift, Trophy, Lock, Accessibility } from "lucide-react"

export const dynamic = "force-dynamic"

async function getUserPoints(userId: string) {
  const supabase = await createClient()
  const [
    { count: totalReviews },
    { count: adultStations },
    { count: familyBathrooms },
    { count: genderNeutral },
    { data: posts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_adult_changing_station", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_family_bathroom", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_gender_neutral", true),
    supabase.from("posts").select("likes_count").eq("user_id", userId),
  ])
  const totalLikes    = (posts ?? []).reduce((sum, p) => sum + (p.likes_count ?? 0), 0)
  const reviews       = totalReviews ?? 0
  const stations      = adultStations ?? 0
  const family        = familyBathrooms ?? 0
  const neutral       = genderNeutral ?? 0
  const reviewPoints  = reviews * 10
  const stationPoints = stations * 25
  const familyPoints  = family * 15
  const neutralPoints = neutral * 15
  const likePoints    = totalLikes * 2
  const signupBonus   = 50
  const total         = reviewPoints + stationPoints + familyPoints + neutralPoints + likePoints + signupBonus
  return { reviews, stations, family, neutral, totalLikes, reviewPoints, stationPoints, familyPoints, neutralPoints, likePoints, signupBonus, total }
}

const BADGES = [
  { key: "first_flush",   icon: "🚽", label: "First Flush",     threshold: 1,    field: "reviews" },
  { key: "ten_flushes",   icon: "💧", label: "10 Flushes",       threshold: 10,   field: "reviews" },
  { key: "fifty_flushes", icon: "🌊", label: "50 Flushes",       threshold: 50,   field: "reviews" },
  { key: "station_scout", icon: "♿", label: "Station Scout",    threshold: 5,    field: "stations" },
  { key: "family_finder", icon: "👨‍👩‍👧", label: "Family Finder",   threshold: 5,    field: "family" },
  { key: "neutral_scout", icon: "⚧",  label: "Neutral Scout",    threshold: 5,    field: "neutral" },
  { key: "liked",         icon: "❤️", label: "Crowd Fave",       threshold: 25,   field: "totalLikes" },
  { key: "top_100",       icon: "🏆", label: "Top 100",          threshold: 1000, field: "total" },
]

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const pts = await getUserPoints(user.id)
  const airdropTier =
    pts.reviews >= 50 ? { label: "Diamond", emoji: "💎", bonus: "5,000", color: "text-sky-500" } :
    pts.reviews >= 20 ? { label: "Gold",    emoji: "🥇", bonus: "2,000", color: "text-amber-500" } :
    pts.reviews >= 5  ? { label: "Silver",  emoji: "🥈", bonus: "500",   color: "text-slate-400" } :
                        { label: "Bronze",  emoji: "🥉", bonus: "100",   color: "text-orange-400" }

  const earnActions = [
    { emoji: "🚽", label: "Post a toilet review",             reward: "+10 FLUSH" },
    { emoji: "♿", label: "Log an adult changing station",    reward: "+25 FLUSH" },
    { emoji: "👨‍👩‍👧", label: "Log a family bathroom",           reward: "+15 FLUSH" },
    { emoji: "⚧",  label: "Log a gender neutral bathroom",   reward: "+15 FLUSH" },
    { emoji: "❤️", label: "Receive a like on your review",   reward: "+2 FLUSH" },
    { emoji: "👥", label: "Refer a friend who signs up",     reward: "+50 FLUSH" },
    { emoji: "⭐", label: "First review of a new location",  reward: "+15 FLUSH" },
    { emoji: "🔥", label: "7-day review streak",             reward: "+100 FLUSH" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-400" />FLUSH Tokens
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Earn tokens for every contribution. Early reviewers get the biggest airdrop.</p>
        </div>

        {/* Balance card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 mb-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <p className="text-sky-300 text-sm font-medium mb-1">Your FLUSH balance</p>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-5xl font-bold">{pts.total.toLocaleString()}</span>
            <span className="text-sky-400 text-lg mb-1">FLUSH</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Reviews",          value: pts.reviews,  p: pts.reviewPoints },
              { label: "Adult stations",   value: pts.stations, p: pts.stationPoints },
              { label: "Family bathrooms", value: pts.family,   p: pts.familyPoints },
              { label: "Gender neutral",   value: pts.neutral,  p: pts.neutralPoints },
            ].map(({ label, value, p }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3">
                <p className="text-xs text-sky-300/70 mb-1">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
                <p className="text-xs text-sky-400">+{p} FLUSH</p>
              </div>
            ))}
          </div>
        </div>

        {/* Airdrop */}
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/20 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Airdrop Status</h2>
            <span className={`ml-auto text-sm font-semibold ${airdropTier.color}`}>{airdropTier.emoji} {airdropTier.label} Tier</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">When Toilet Book launches the FLUZH token on-chain, early contributors receive a bonus airdrop based on their review tier.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { tier: "Bronze 🥉", reviews: 1,  bonus: "100",   color: "text-orange-400" },
              { tier: "Silver 🥈", reviews: 5,  bonus: "500",   color: "text-slate-400" },
              { tier: "Gold 🥇",   reviews: 20, bonus: "2,000", color: "text-amber-500" },
              { tier: "Diamond 💎",reviews: 50, bonus: "5,000", color: "text-sky-500" },
            ].map(({ tier, reviews, bonus, color }) => (
              <div key={tier} className={`rounded-xl border p-3 text-center ${pts.reviews >= reviews ? "border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900" : "border-slate-200 dark:border-slate-800 opacity-50"}`}>
                <p className={`text-sm font-semibold ${color}`}>{tier}</p>
                <p className="text-xs text-slate-400 mt-0.5">{reviews}+ reviews</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">+{bonus} FLUSH</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Your tier: <strong className={airdropTier.color}>{airdropTier.label} — +{airdropTier.bonus} FLUSH bonus reserved</strong>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Earn */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />How to earn FLUSH
            </h2>
            <div className="space-y-3">
              {earnActions.map(({ emoji, label, reward }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-base w-8 text-center flex-shrink-0">{emoji}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300 flex-1">{label}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full whitespace-nowrap">{reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />Badges
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {BADGES.map((badge) => {
                const current = pts[badge.field as keyof typeof pts] as number
                const earned = current >= badge.threshold
                return (
                  <div key={badge.key} className={`rounded-xl p-2.5 text-center ${earned ? "bg-gradient-to-br from-amber-50 to-sky-50 dark:from-amber-950/30 dark:to-sky-950/30 border border-amber-200/60 dark:border-amber-800/40" : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 opacity-40 grayscale"}`}>
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{badge.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FLUZH Token — Live on Solana */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-emerald-500/30 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border-b border-emerald-500/20 px-5 py-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-lg">🚽</div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                FLUZH Token — Deployed on Solana
                <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">✓ Live</span>
              </p>
              <p className="text-xs text-slate-400">Airdrop: August 28, 2026 · 1 point = 10 FLUZH · Whitelist closes Aug 21</p>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1.5">Token Mint Address (Solana)</p>
              <div className="flex items-center gap-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3">
                <code className="text-xs text-emerald-400 flex-1 break-all font-mono select-all">
                  3rQ2XfkPEYnB5tbkupWkFQmKT983MvG15Jaqr6DH9gk9
                </code>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { label: "Name",     value: "FLUZH" },
                { label: "Network",  value: "Solana" },
                { label: "Supply",   value: "1,000,000,000" },
                { label: "Decimals", value: "6" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-1">
              <a
                href="https://solscan.io/token/3rQ2XfkPEYnB5tbkupWkFQmKT983MvG15Jaqr6DH9gk9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold py-2.5 hover:bg-sky-500/20 transition-colors"
              >
                View on Solscan →
              </a>
              <a
                href="https://birdeye.so/token/3rQ2XfkPEYnB5tbkupWkFQmKT983MvG15Jaqr6DH9gk9?chain=solana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold py-2.5 hover:bg-violet-500/20 transition-colors"
              >
                View on Birdeye →
              </a>
            </div>
            <p className="text-xs text-slate-500 text-center pt-1">
              Register your Solana wallet address in your profile settings to secure your airdrop spot
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
