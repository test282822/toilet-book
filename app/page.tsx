import { Suspense } from "react"
import { Toilet, Users, Star, Accessibility } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { PostFeed } from "@/components/feed/PostFeed"
import { getFeedPosts } from "@/lib/posts"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalPosts },
    { count: totalUsers },
    { count: totalAdultStations },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("has_adult_changing_station", true),
  ])

  return {
    totalPosts: totalPosts ?? 0,
    totalUsers: totalUsers ?? 0,
    totalAdultStations: totalAdultStations ?? 0,
  }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`
  return n.toString()
}

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    profile = data
  }

  const [initialPosts, stats] = await Promise.all([
    getFeedPosts(0, user?.id),
    getStats(),
  ])

  const statItems = [
    {
      icon: Toilet,
      label: "Toilets rated",
      value: formatCount(stats.totalPosts),
      color: "text-sky-500",
    },
    {
      icon: Users,
      label: "Community members",
      value: formatCount(stats.totalUsers),
      color: "text-blue-500",
    },
    {
      icon: Accessibility,
      label: "Adult changing stations",
      value: formatCount(stats.totalAdultStations),
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-200/40 dark:bg-sky-800/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-blue-200/40 dark:bg-blue-800/20 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400 mb-4">
            <Toilet className="h-3 w-3" />
            The world&apos;s #1 toilet rating community
          </div>

          {/* headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            Find the{" "}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              best toilet
            </span>{" "}
            near you
          </h1>

          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Real ratings, real reviews. Discover clean, accessible, and
            family-friendly bathrooms — including adult changing stations.
          </p>

          {/* ── Live stats ── */}
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {statItems.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <div className={`flex items-center justify-center gap-1 text-2xl font-bold text-slate-800 dark:text-white`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                  {value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feed ── */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Latest Reviews
          </h2>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">
            Updated live
          </span>
        </div>
        <Suspense fallback={<FeedSkeleton />}>
          <PostFeed initialPosts={initialPosts} currentUserId={user?.id} />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-8 text-center">
        <p className="text-sm text-slate-400 flex items-center justify-center gap-1.5">
          <Toilet className="h-4 w-4 text-sky-400" />
          Toilet Book — rating the world&apos;s restrooms, one flush at a time
        </p>
      </footer>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-24 rounded animate-pulse bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded animate-pulse bg-slate-100 dark:bg-slate-800" />
              <div className="h-3 w-3/4 rounded animate-pulse bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
