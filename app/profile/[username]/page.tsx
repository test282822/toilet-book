import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { PostCard } from "@/components/feed/PostCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Toilet, Calendar, Star, Coins,
  Trophy, Users, Accessibility
} from "lucide-react"
import { CopyReferralButton } from "@/components/profile/CopyReferralButton"

export const dynamic = "force-dynamic"

// ── THIS FILE MUST BE AT: app/profile/[username]/page.tsx ────────
// The folder is literally named [username] with square brackets.
// Without the brackets Next.js treats it as a static route.

export async function generateMetadata({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> {
  return {
    title: `${params.username} — Toilet Book`,
    description: `${params.username}'s toilet reviews and FLUSH token earnings on Toilet Book.`,
  }
}

const BADGE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; emoji: string; next?: string }
> = {
  legend:      { label: "Legend",      color: "text-amber-700 dark:text-amber-300",     bg: "bg-amber-100 dark:bg-amber-900/40",     emoji: "👑" },
  expert:      { label: "Expert",      color: "text-violet-700 dark:text-violet-300",   bg: "bg-violet-100 dark:bg-violet-900/40",   emoji: "💎", next: "Legend at 100 reviews" },
  trusted:     { label: "Trusted",     color: "text-sky-700 dark:text-sky-300",         bg: "bg-sky-100 dark:bg-sky-900/40",         emoji: "⭐", next: "Expert at 50 reviews" },
  contributor: { label: "Contributor", color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-100 dark:bg-emerald-900/40", emoji: "✅", next: "Trusted at 10 reviews" },
  newcomer:    { label: "Newcomer",    color: "text-slate-600 dark:text-slate-400",     bg: "bg-slate-100 dark:bg-slate-800",        emoji: "🌱", next: "Contributor at 3 reviews" },
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch current user's profile for Navbar
  let myProfile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    myProfile = data
  }

  // Try username lookup first, then fall back to ID
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .maybeSingle()

  if (!profile) {
    const { data: byId } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", params.username)
      .maybeSingle()
    profile = byId
  }

  if (!profile) notFound()

  const isOwner = user?.id === profile.id

  // Posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(username, avatar_url)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(24)

  // Counts
  const [{ count: totalPosts }, { count: adultStations }] = await Promise.all([
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("has_adult_changing_station", true),
  ])

  // Average rating
  const { data: avgData } = await supabase
    .from("posts")
    .select("rating")
    .eq("user_id", profile.id)

  const avgRating =
    avgData?.length
      ? (
          avgData.reduce((s, p) => s + (p.rating ?? 0), 0) / avgData.length
        ).toFixed(1)
      : null

  const badge       = BADGE_CONFIG[profile.reviewer_badge ?? "newcomer"] ?? BADGE_CONFIG.newcomer
  const flushBal    = profile.flush_balance ?? 0
  const referralUrl = `https://toilet-book.com/signup?ref=${profile.referral_code ?? ""}`
  const joinDate    = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  })

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={myProfile} />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">

        {/* Profile header */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 flex-shrink-0">
              <AvatarImage src={profile.avatar_url ?? ""} />
              <AvatarFallback className="text-2xl">
                {(profile.username ?? "?")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                  {profile.full_name || profile.username}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badge.bg} ${badge.color}`}
                >
                  {badge.emoji} {badge.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {profile.bio}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {joinDate}
                </span>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500 hover:text-sky-400"
                  >
                    {profile.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              {badge.next && (
                <p className="text-xs text-slate-400 mt-1.5">
                  Next: {badge.next}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
            {[
              { icon: <Star className="h-3.5 w-3.5 text-amber-400" />,         label: "Reviews",        value: fmt(totalPosts ?? 0) },
              { icon: <Coins className="h-3.5 w-3.5 text-sky-400" />,          label: "FLUSH pts",      value: fmt(flushBal) },
              { icon: <Trophy className="h-3.5 w-3.5 text-violet-400" />,      label: "Tokens",         value: fmt(flushBal * 10) },
              { icon: <Accessibility className="h-3.5 w-3.5 text-blue-400" />, label: "Adult stations", value: fmt(adultStations ?? 0) },
              { icon: <Users className="h-3.5 w-3.5 text-emerald-400" />,      label: "Referrals",      value: fmt(profile.referral_count ?? 0) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-1">{icon}</div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FLUSH + referral — owner only */}
        {isOwner && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* FLUSH balance */}
            <div className="rounded-2xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10 border border-sky-200 dark:border-sky-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4 text-sky-500" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Your FLUSH balance
                </p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {fmt(flushBal)}{" "}
                <span className="text-sm text-slate-400 font-normal">points</span>
              </p>
              <p className="text-sm text-sky-600 dark:text-sky-400 font-semibold mb-3">
                = {fmt(flushBal * 10)} FLUSH tokens at launch
              </p>
              <Link
                href="/points"
                className="text-xs text-sky-500 hover:text-sky-400"
              >
                See token details →
              </Link>
            </div>

            {/* Referral */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Your referral link
                </p>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Earn{" "}
                <strong className="text-emerald-500">+50 FLUSH points</strong>{" "}
                for every friend who signs up
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 mb-2">
                <code className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">
                  {referralUrl}
                </code>
                <CopyReferralButton url={referralUrl} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  {profile.referral_count ?? 0} friends referred
                </p>
                <Link
                  href="/referrals"
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Full referral page →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Toilet className="h-4 w-4 text-sky-500" />
            Reviews
            <span className="text-xs text-slate-400 font-normal">
              ({fmt(totalPosts ?? 0)})
            </span>
          </h2>
          {avgRating && (
            <span className="text-xs text-slate-400">
              Avg:{" "}
              <span className="text-amber-400 font-semibold">★ {avgRating}</span>
            </span>
          )}
        </div>

        {!posts?.length ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-16 text-center">
            <div className="text-4xl mb-3">🚽</div>
            <p className="text-slate-500 text-sm">No reviews yet</p>
            {isOwner && (
              <p className="text-xs text-slate-400 mt-2">
                Start reviewing bathrooms to earn FLUSH tokens!
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
