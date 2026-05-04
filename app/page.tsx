import { Suspense } from "react"
import { Toilet } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { PostFeed } from "@/components/feed/PostFeed"
import { getFeedPosts } from "@/lib/posts"
import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/layout/HeroSection"

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

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />
      <HeroSection stats={stats} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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
        <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
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
