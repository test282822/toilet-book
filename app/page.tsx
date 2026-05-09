import { Suspense } from "react"
import { Toilet } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { PostFeed } from "@/components/feed/PostFeed"
import { getFeedPosts } from "@/lib/posts"
import { createClient } from "@/lib/supabase/server"
import { HeroSection } from "@/components/layout/HeroSection"
import { MobileHero } from "@/components/layout/MobileHero"

export const dynamic = "force-dynamic"

async function getStats() {
  const supabase = await createClient()
  const [
    { count: totalPosts },
    { count: totalUsers },
    { count: totalAdultStations },
    { count: totalFamilyBathrooms },
    { count: totalGenderNeutral },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("has_adult_changing_station", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("has_family_bathroom", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("has_gender_neutral", true),
  ])
  return {
    totalPosts:           totalPosts ?? 0,
    totalUsers:           totalUsers ?? 0,
    totalAdultStations:   totalAdultStations ?? 0,
    totalFamilyBathrooms: totalFamilyBathrooms ?? 0,
    totalGenderNeutral:   totalGenderNeutral ?? 0,
  }
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }
  const [initialPosts, stats] = await Promise.all([getFeedPosts(0, user?.id), getStats()])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />

      {/* Mobile hero */}
      <div className="block md:hidden">
        <MobileHero isLoggedIn={!!user} userId={user?.id} stats={stats} />
      </div>

      {/* Desktop hero */}
      <div className="hidden md:block">
        <HeroSection stats={stats} userId={user?.id} />
      </div>

      {/* Feed */}
      <main
        className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        style={{ paddingBottom: user ? "100px" : undefined }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Latest Reviews</h2>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">
            Updated live
          </span>
        </div>
        <Suspense fallback={<FeedSkeleton />}>
          <PostFeed initialPosts={initialPosts} currentUserId={user?.id} />
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 hidden md:block">

        {/* Top row — brand + tagline */}
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600">
                <Toilet className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Toilet Book</p>
                <p className="text-xs text-slate-400">Rating the world&apos;s restrooms, one flush at a time</p>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Explore</p>
                <Link href="/map"  className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Toilet Map</Link>
                <Link href="/shop" className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Merch Shop</Link>
                <Link href="/points" className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">FLUSH Tokens</Link>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Account</p>
                <Link href="/signup" className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Join Free</Link>
                <Link href="/login"  className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Sign In</Link>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Legal & Help</p>
                <Link href="/policies" className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Platform Rules</Link>
                <Link href="/terms"    className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Terms of Service</Link>
                <Link href="/privacy"  className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Privacy Policy</Link>
                <Link href="/contact"  className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Toilet Book · toilet-book.com · All rights reserved
            </p>
            <div className="flex gap-4 text-xs text-slate-400">
              <a href="mailto:toiletbookmain@gmail.com" className="hover:text-sky-500 transition-colors">
                toiletbookmain@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile footer — minimal */}
      <footer className="block md:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 px-4 py-6">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400 mb-3">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Rules</Link>
          <Link href="/terms"    className="hover:text-sky-400 transition-colors">Terms</Link>
          <Link href="/privacy"  className="hover:text-sky-400 transition-colors">Privacy</Link>
          <Link href="/contact"  className="hover:text-sky-400 transition-colors">Contact</Link>
          <Link href="/map"      className="hover:text-sky-400 transition-colors">Map</Link>
          <Link href="/shop"     className="hover:text-sky-400 transition-colors">Shop</Link>
        </div>
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Toilet Book · All rights reserved
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
            <div className="h-3 w-full rounded animate-pulse bg-slate-100 dark:bg-slate-800" />
            <div className="h-3 w-3/4 rounded animate-pulse bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  )
}
