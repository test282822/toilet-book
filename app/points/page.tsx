import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { PostCard } from "@/components/feed/PostCard"
import { redirect } from "next/navigation"
import { CopyReferralButton } from "@/components/profile/CopyReferralButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Toilet, Star, Users, Zap, Trophy,
  Coins, Calendar, Accessibility, Gift
} from "lucide-react"

export const dynamic = "force-dynamic"

const BADGE_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string; next?: string }> = {
  legend:      { label: "Legend",      color: "text-amber-700 dark:text-amber-300",     bg: "bg-amber-100 dark:bg-amber-900/40",     emoji: "👑" },
  expert:      { label: "Expert",      color: "text-violet-700 dark:text-violet-300",   bg: "bg-violet-100 dark:bg-violet-900/40",   emoji: "💎", next: "Legend at 100 reviews" },
  trusted:     { label: "Trusted",     color: "text-sky-700 dark:text-sky-300",         bg: "bg-sky-100 dark:bg-sky-900/40",         emoji: "⭐", next: "Expert at 50 reviews" },
  contributor: { label: "Contributor", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40", emoji: "✅", next: "Trusted at 10 reviews" },
  newcomer:    { label: "Newcomer",    color: "text-slate-600 dark:text-slate-400",     bg: "bg-slate-100 dark:bg-slate-800",        emoji: "🌱", next: "Contributor at 3 reviews" },
}

const MINT = "3rQ2XfkPEYnB5tbkupWkFQmKT983MvG15Jaqr6DH9gk9"

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

async function getStats(userId: string) {
  const supabase = await createClient()
  const [
    { count: totalReviews },
    { count: adultStations },
    { count: familyBathrooms },
    { count: genderNeutral },
    { data: posts },
    { data: recentPosts },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_adult_changing_station", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_family_bathroom", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId).eq("has_gender_neutral", true),
    supabase.from("posts").select("likes_count").eq("user_id", userId),
    supabase.from("posts").select("*, profiles(username, avatar_url)").eq("user_id", userId).order("created_at", { ascending: false }).limit(12),
  ])
  const totalLikes    = (posts ?? []).reduce((s, p) => s + (p.likes_count ?? 0), 0)
  const reviews       = totalReviews    ?? 0
  const stations      = adultStations   ?? 0
  const family        = familyBathrooms ?? 0
  const neutral       = genderNeutral   ?? 0
  const reviewPts     = reviews  * 10
  const stationPts    = stations * 25
  const familyPts     = family   * 15
  const neutralPts    = neutral  * 15
  const likePts       = totalLikes * 2
  const signupBonus   = 50
  const total         = reviewPts + stationPts + familyPts + neutralPts + likePts + signupBonus
  return { reviews, stations, family, neutral, totalLikes, reviewPts, stationPts, familyPts, neutralPts, likePts, signupBonus, total, recentPosts: recentPosts ?? [] }
}

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const stats = await getStats(user.id)

  const flushBal    = profile?.flush_balance ?? stats.total
  const badge       = BADGE_CONFIG[profile?.reviewer_badge ?? "newcomer"] ?? BADGE_CONFIG.newcomer
  const referralUrl = `https://toilet-book.com/signup?ref=${profile?.referral_code ?? ""}`
  const joinDate    = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : ""

  const airdropTier =
    stats.reviews >= 50 ? { label: "Diamond", emoji: "💎", bonus: "5,000", color: "text-sky-500" } :
    stats.reviews >= 20 ? { label: "Gold",    emoji: "🥇", bonus: "2,000", color: "text-amber-500" } :
    stats.reviews >= 5  ? { label: "Silver",  emoji: "🥈", bonus: "500",   color: "text-slate-400" } :
                          { label: "Bronze",  emoji: "🥉", bonus: "100",   color: "text-orange-400" }

  const earnActions = [
    { emoji: "🚽", label: "Post a toilet review",            reward: "+10 pts" },
    { emoji: "♿", label: "Log an adult changing station",   reward: "+25 pts" },
    { emoji: "👨‍👩‍👧", label: "Log a family bathroom",          reward: "+15 pts" },
    { emoji: "⚧",  label: "Log a gender neutral bathroom",  reward: "+15 pts" },
    { emoji: "🔒", label: "Log a single stall bathroom",    reward: "+10 pts" },
    { emoji: "🩸", label: "Log hygiene products available", reward: "+10 pts" },
    { emoji: "❤️", label: "Receive a like on your review",  reward: "+2 pts" },
    { emoji: "👥", label: "Refer a friend who signs up",    reward: "+50 pts" },
    { emoji: "⭐", label: "First review of a new location", reward: "+15 pts" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={profile} />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 space-y-5">

        {/* ── Profile header ── */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-4 mb-5">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={profile?.avatar_url ?? ""} />
              <AvatarFallback className="text-xl">
                {(profile?.username ?? "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile?.full_name || profile?.username}
                </h1>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.color}`}>
                  {badge.emoji} {badge.label}
                </span>
              </div>
              <p className="text-sm text-slate-500">@{profile?.username}</p>
              {joinDate && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="h-3 w-3" /> Joined {joinDate}
                </p>
              )}
              {badge.next && <p className="text-xs text-slate-400 mt-0.5">Next: {badge.next}</p>}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {[
              { icon: <Star className="h-3.5 w-3.5 text-amber-400" />,         label: "Reviews",        value: fmt(stats.reviews) },
              { icon: <Coins className="h-3.5 w-3.5 text-sky-400" />,          label: "FLUSH pts",      value: fmt(flushBal) },
              { icon: <Trophy className="h-3.5 w-3.5 text-violet-400" />,      label: "Tokens",         value: fmt(flushBal * 10) },
              { icon: <Accessibility className="h-3.5 w-3.5 text-blue-400" />, label: "Adult stations", value: fmt(stats.stations) },
              { icon: <Users className="h-3.5 w-3.5 text-emerald-400" />,      label: "Referrals",      value: fmt(profile?.referral_count ?? 0) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLUZH balance + referral ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Balance */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-200 dark:border-sky-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">FLUZH balance</p>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {fmt(flushBal)} <span className="text-sm text-slate-400 font-normal">points</span>
            </p>
            <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold mb-3">
              = {fmt(flushBal * 10)} FLUZH tokens at launch
            </p>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${airdropTier.color} bg-slate-100 dark:bg-slate-800`}>
              {airdropTier.emoji} {airdropTier.label} Tier — +{airdropTier.bonus} FLUZH bonus
            </div>
          </div>

          {/* Referral */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Your referral link</p>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Earn <strong className="text-emerald-500">+50 pts</strong> for every friend who signs up
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 mb-2">
              <code className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">
                {referralUrl}
              </code>
              <CopyReferralButton url={referralUrl} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{profile?.referral_count ?? 0} friends referred</p>
              <Link href="/referrals" className="text-xs text-emerald-500 hover:text-emerald-400">
                Full referral page →
              </Link>
            </div>
          </div>
        </div>

        {/* ── FLUZH token info ── */}
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
                <code className="text-xs text-emerald-400 flex-1 break-all font-mono select-all">{MINT}</code>
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
            <div className="flex gap-3">
              <a href={`https://solscan.io/token/${MINT}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold py-2.5 hover:bg-sky-500/20 transition-colors">
                View on Solscan →
              </a>
              <a href={`https://birdeye.so/token/${MINT}?chain=solana`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold py-2.5 hover:bg-violet-500/20 transition-colors">
                View on Birdeye →
              </a>
            </div>
            <a href="https://docs.google.com/document/d/1dGkNBm54XEsNou9jQnkC9KI7Ih9_4Sxr/edit?usp=sharing&ouid=103945640703295940575&rtpof=true&sd=true"
              target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-200 text-xs font-semibold py-2.5 hover:bg-slate-700 transition-colors">
              📄 Read the FLUZH Token Whitepaper →
            </a>
          </div>
        </div>

        {/* ── Earn rates ── */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" /> How to earn FLUZH points
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {earnActions.map(({ emoji, label, reward }) => (
              <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800 px-3 py-2.5">
                <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span>{emoji}</span>{label}
                </span>
                <span className="text-xs font-semibold text-emerald-500 flex-shrink-0 ml-2">{reward}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Breakdown ── */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-violet-400" /> Your points breakdown
          </h2>
          <div className="space-y-2">
            {[
              { label: "Sign up bonus",          pts: stats.signupBonus,  detail: "one time" },
              { label: `${stats.reviews} reviews`,pts: stats.reviewPts,   detail: "×10 pts each" },
              { label: `${stats.stations} adult stations`, pts: stats.stationPts, detail: "×25 pts each" },
              { label: `${stats.family} family bathrooms`, pts: stats.familyPts,  detail: "×15 pts each" },
              { label: `${stats.neutral} gender neutral`,  pts: stats.neutralPts, detail: "×15 pts each" },
              { label: `${stats.totalLikes} likes received`, pts: stats.likePts,  detail: "×2 pts each" },
            ].map(({ label, pts, detail }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                  <span className="text-xs text-slate-400 ml-2">{detail}</span>
                </div>
                <span className="text-sm font-semibold text-amber-500">+{pts}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total</span>
              <span className="text-lg font-bold text-amber-500">{fmt(flushBal)} pts</span>
            </div>
          </div>
        </div>

        {/* ── My reviews ── */}
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
            <Toilet className="h-4 w-4 text-sky-500" />
            My reviews
            <span className="text-xs text-slate-400 font-normal">({fmt(stats.reviews)})</span>
          </h2>
          {stats.recentPosts.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-16 text-center">
              <div className="text-4xl mb-3">🚽</div>
              <p className="text-slate-500 text-sm">No reviews yet — start rating bathrooms to earn FLUZH!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.recentPosts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={user.id} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
