import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Star, Users, Coins, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "FLUSH Token Leaderboard — Toilet Book",
  description: "Top FLUSH token earners on Toilet Book. See who is leading the community rankings and how to climb the leaderboard.",
  alternates: { canonical: "https://toilet-book.com/leaderboard" },
}

const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  legend:      { label: "Legend",      color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-100 dark:bg-amber-900/40",   emoji: "👑" },
  expert:      { label: "Expert",      color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40", emoji: "💎" },
  trusted:     { label: "Trusted",     color: "text-sky-700 dark:text-sky-300",       bg: "bg-sky-100 dark:bg-sky-900/40",       emoji: "⭐" },
  contributor: { label: "Contributor", color: "text-emerald-700 dark:text-emerald-300",bg: "bg-emerald-100 dark:bg-emerald-900/40",emoji: "✅" },
  newcomer:    { label: "Newcomer",    color: "text-slate-600 dark:text-slate-400",   bg: "bg-slate-100 dark:bg-slate-800",      emoji: "🌱" },
}

const BADGE_THRESHOLDS = [
  { badge: "legend",      reviews: 100, emoji: "👑", desc: "100+ reviews" },
  { badge: "expert",      reviews: 50,  emoji: "💎", desc: "50+ reviews" },
  { badge: "trusted",     reviews: 10,  emoji: "⭐", desc: "10+ reviews" },
  { badge: "contributor", reviews: 3,   emoji: "✅", desc: "3+ reviews" },
  { badge: "newcomer",    reviews: 0,   emoji: "🌱", desc: "Just getting started" },
]

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  // Top 50 by flush balance
  const { data: leaders } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, flush_balance, reviewer_badge, total_reviews, referral_count")
    .not("flush_balance", "is", null)
    .gt("flush_balance", 0)
    .order("flush_balance", { ascending: false })
    .limit(50)

  // Platform totals
  const [
    { count: totalUsers },
    { count: totalReviews },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
  ])

  // Find current user's rank
  let myRank: number | null = null
  if (profile?.flush_balance) {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gt("flush_balance", profile.flush_balance)
    myRank = (count ?? 0) + 1
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "text-amber-500"
    if (rank === 2) return "text-slate-400"
    if (rank === 3) return "text-amber-700"
    return "text-slate-500 dark:text-slate-400"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={profile} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs text-amber-700 dark:text-amber-400 mb-4">
            <Trophy className="h-3 w-3" />
            FLUSH Token Leaderboard
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Top Flush Earners
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Every review earns points that convert to FLUSH tokens at launch.
            1 point = 10 FLUSH tokens · Launch August 28, 2026
          </p>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Users className="h-4 w-4 text-violet-400" />,  label: "Community members", value: fmt(totalUsers ?? 0) },
            { icon: <Star className="h-4 w-4 text-amber-400" />,    label: "Reviews posted",    value: fmt(totalReviews ?? 0) },
            { icon: <Coins className="h-4 w-4 text-sky-400" />,     label: "Token launch",      value: "Aug 28" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
              <div className="flex justify-center mb-1">{icon}</div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* My rank banner */}
        {user && profile && (
          <div className="rounded-xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-200 dark:border-sky-800 px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile.avatar_url ?? ""} />
                <AvatarFallback className="text-sm">{(profile.username ?? "?")[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{profile.username}</p>
                <p className="text-xs text-slate-500">{fmt(profile.flush_balance ?? 0)} pts · {fmt((profile.flush_balance ?? 0) * 10)} FLUSH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">#{myRank ?? "—"}</p>
              <p className="text-xs text-slate-400">your rank</p>
            </div>
          </div>
        )}

        {/* Leaderboard table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
          {(!leaders || leaders.length === 0) ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-4">🚽</div>
              <p className="text-slate-500 text-sm">No rankings yet — be the first to earn FLUSH points!</p>
              <Link href="/signup" className="inline-flex items-center gap-2 mt-4 text-sm text-sky-500 hover:text-sky-400">
                Join free <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : leaders.map((u, i) => {
            const rank = i + 1
            const badge = BADGE_CONFIG[u.reviewer_badge ?? "newcomer"] ?? BADGE_CONFIG.newcomer
            const isMe = user?.id === u.id
            return (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${
                  isMe ? "bg-sky-50/50 dark:bg-sky-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {/* Rank */}
                <div className={`w-8 text-center font-bold text-lg flex-shrink-0 ${getRankStyle(rank)}`}>
                  {getRankIcon(rank) ?? `#${rank}`}
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={u.avatar_url ?? ""} />
                  <AvatarFallback className="text-sm">{(u.username ?? "?")[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                {/* Name + badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/profile/${u.username}`}
                      className="text-sm font-semibold text-slate-800 dark:text-white hover:text-sky-500 transition-colors truncate"
                    >
                      {u.username ?? "Anonymous"}
                    </Link>
                    {isMe && (
                      <span className="text-xs bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-full px-2 py-0.5">you</span>
                    )}
                    <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${badge.bg} ${badge.color}`}>
                      {badge.emoji} {badge.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {u.total_reviews ?? 0} reviews · {u.referral_count ?? 0} referrals
                  </p>
                </div>

                {/* FLUSH balance */}
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{fmt(u.flush_balance ?? 0)}</p>
                  <p className="text-xs text-sky-500">{fmt((u.flush_balance ?? 0) * 10)} FLUSH</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Badge guide */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Reviewer badges
          </h2>
          <div className="space-y-2">
            {BADGE_THRESHOLDS.map(({ badge, emoji, desc }) => {
              const cfg = BADGE_CONFIG[badge]
              return (
                <div key={badge} className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                    {emoji} {cfg.label}
                  </span>
                  <span className="text-xs text-slate-400">{desc}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        {!user && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
            <p className="text-lg font-bold text-white mb-2">Start earning FLUSH tokens today</p>
            <p className="text-sm text-slate-400 mb-5">Sign up free · earn points for every review · convert to crypto August 28 2026</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <Coins className="h-4 w-4" /> Join & start earning
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
