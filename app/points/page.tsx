import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { redirect } from "next/navigation"
import { Toilet, Star, MapPin, ThumbsUp, Users, Zap, Gift, Trophy, Lock } from "lucide-react"

export const dynamic = "force-dynamic"

async function getUserPoints(userId: string) {
  const supabase = await createClient()

  const [
    { count: totalReviews },
    { count: adultStations },
    { data: posts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_adult_changing_station", true),
    supabase.from("posts").select("likes_count").eq("user_id", userId),
  ])

  const totalLikes = (posts ?? []).reduce((sum, p) => sum + (p.likes_count ?? 0), 0)
  const reviews = totalReviews ?? 0
  const stations = adultStations ?? 0

  // FLUSH token calculation
  const reviewPoints   = reviews * 10
  const stationPoints  = stations * 25
  const likePoints     = totalLikes * 2
  const signupBonus    = 50
  const total          = reviewPoints + stationPoints + likePoints + signupBonus

  return { reviews, stations, totalLikes, reviewPoints, stationPoints, likePoints, signupBonus, total }
}

const BADGES = [
  { key: "first_flush",    icon: "🚽", label: "First Flush",      desc: "Submit your first review",          threshold: 1,   field: "reviews" },
  { key: "ten_flushes",    icon: "💧", label: "10 Flushes",        desc: "Submit 10 reviews",                 threshold: 10,  field: "reviews" },
  { key: "fifty_flushes",  icon: "🌊", label: "50 Flushes",        desc: "Submit 50 reviews",                 threshold: 50,  field: "reviews" },
  { key: "station_scout",  icon: "♿", label: "Station Scout",     desc: "Find 5 adult changing stations",    threshold: 5,   field: "stations" },
  { key: "liked_reviewer", icon: "❤️", label: "Crowd Favourite",   desc: "Receive 25 likes on your reviews",  threshold: 25,  field: "totalLikes" },
  { key: "top_100",        icon: "🏆", label: "Top 100",           desc: "Reach 1,000 FLUSH tokens",          threshold: 1000, field: "total" },
]

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let profile = null
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  profile = data

  const pts = await getUserPoints(user.id)

  const earnActions = [
    { icon: Toilet,   label: "Post a toilet review",              reward: "+10 FLUSH",  color: "text-sky-500",     bg: "bg-sky-50 dark:bg-sky-950/30" },
    { icon: MapPin,   label: "Log an adult changing station",      reward: "+25 FLUSH",  color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { icon: ThumbsUp, label: "Receive a like on your review",      reward: "+2 FLUSH",   color: "text-pink-500",    bg: "bg-pink-50 dark:bg-pink-950/30" },
    { icon: Users,    label: "Refer a friend who signs up",        reward: "+50 FLUSH",  color: "text-violet-500",  bg: "bg-violet-50 dark:bg-violet-950/30" },
    { icon: Star,     label: "First review of a new location",     reward: "+15 FLUSH",  color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-950/30" },
    { icon: Zap,      label: "Review 7 days in a row (streak)",    reward: "+100 FLUSH", color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-950/30" },
  ]

  // airdrop tier based on review count
  const airdropTier =
    pts.reviews >= 50 ? { label: "Diamond", emoji: "💎", bonus: "5,000", color: "text-sky-500" } :
    pts.reviews >= 20 ? { label: "Gold",    emoji: "🥇", bonus: "2,000", color: "text-amber-500" } :
    pts.reviews >= 5  ? { label: "Silver",  emoji: "🥈", bonus: "500",   color: "text-slate-400" } :
                        { label: "Bronze",  emoji: "🥉", bonus: "100",   color: "text-orange-400" }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

        {/* ── Page header ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-400" />
            FLUSH Tokens
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Earn tokens for every review. Early reviewers get the biggest airdrop when we launch.
          </p>
        </div>

        {/* ── Balance card ── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 mb-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-sky-300 text-sm font-medium mb-1">Your FLUSH balance</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-bold">{pts.total.toLocaleString()}</span>
              <span className="text-sky-400 text-lg mb-1">FLUSH</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Reviews",        value: pts.reviews,      pts: pts.reviewPoints },
                { label: "Adult stations", value: pts.stations,     pts: pts.stationPoints },
                { label: "Likes received", value: pts.totalLikes,   pts: pts.likePoints },
                { label: "Signup bonus",   value: "✓",              pts: pts.signupBonus },
              ].map(({ label, value, pts: p }) => (
                <div key={label} className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-sky-300/70 mb-1">{label}</p>
                  <p className="text-lg font-semibold">{value}</p>
                  <p className="text-xs text-sky-400">+{p} FLUSH</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Airdrop status ── */}
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/60 dark:border-amber-800/40 dark:bg-amber-950/20 p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="h-5 w-5 text-amber-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Airdrop Status</h2>
            <span className={`ml-auto text-sm font-semibold ${airdropTier.color}`}>
              {airdropTier.emoji} {airdropTier.label} Tier
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            When Toilet Book launches the FLUSH token on-chain, early reviewers receive a bonus airdrop on top of their earned balance. Your tier is locked at launch — the more you review now, the bigger your bonus.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { tier: "Bronze 🥉", req: "1+ reviews",  bonus: "100",   color: "text-orange-400" },
              { tier: "Silver 🥈", req: "5+ reviews",  bonus: "500",   color: "text-slate-400" },
              { tier: "Gold 🥇",   req: "20+ reviews", bonus: "2,000", color: "text-amber-500" },
              { tier: "Diamond 💎",req: "50+ reviews", bonus: "5,000", color: "text-sky-500" },
            ].map(({ tier, req, bonus, color }) => (
              <div key={tier} className={`rounded-xl border p-3 text-center ${pts.reviews >= parseInt(req) ? "border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900" : "border-slate-200 dark:border-slate-800 opacity-50"}`}>
                <p className={`text-sm font-semibold ${color}`}>{tier}</p>
                <p className="text-xs text-slate-400 mt-0.5">{req}</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">+{bonus} FLUSH</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Your current tier: <strong className={airdropTier.color}>{airdropTier.label} — +{airdropTier.bonus} FLUSH bonus reserved</strong>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">

          {/* ── How to earn ── */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              How to earn FLUSH
            </h2>
            <div className="space-y-3">
              {earnActions.map(({ icon: Icon, label, reward, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300 flex-1">{label}</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full whitespace-nowrap">{reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Badges ── */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              Badges
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => {
                const current = pts[badge.field as keyof typeof pts] as number
                const earned = current >= badge.threshold
                return (
                  <div key={badge.key} className={`rounded-xl p-3 text-center transition-all ${earned ? "bg-gradient-to-br from-amber-50 to-sky-50 dark:from-amber-950/30 dark:to-sky-950/30 border border-amber-200/60 dark:border-amber-800/40" : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 opacity-40 grayscale"}`}>
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-tight">{badge.label}</p>
                    {!earned && (
                      <p className="text-xs text-slate-400 mt-0.5">{badge.desc}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Coming soon banner ── */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-sky-600 p-5 text-white text-center">
          <p className="text-lg font-semibold mb-1">🚀 Token launch coming soon</p>
          <p className="text-sm text-white/80 max-w-md mx-auto">
            FLUSH tokens will launch on-chain. Every point you earn now converts 1:1. Keep reviewing — early users win the most.
          </p>
        </div>

      </main>
    </div>
  )
}
