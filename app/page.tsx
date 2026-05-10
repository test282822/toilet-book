import { Suspense } from "react"
import Link from "next/link"
import {
  Toilet, MapPin, Star, Users, Sparkles,
  ArrowRight, Navigation, ChevronRight, Coins
} from "lucide-react"
import { Navbar }    from "@/components/layout/Navbar"
import { PostFeed }  from "@/components/feed/PostFeed"
import { getFeedPosts } from "@/lib/posts"
import { createClient } from "@/lib/supabase/server"
import { HeroSection }  from "@/components/layout/HeroSection"
import { MobileHero }   from "@/components/layout/MobileHero"

export const dynamic = "force-dynamic"

// ── pull live stats ───────────────────────────────────────────────
async function getStats() {
  const supabase = await createClient()
  const [
    { count: totalToilets },
    { count: unratedToilets },
    { count: totalReviews },
    { count: totalUsers },
    { count: adultStations },
  ] = await Promise.all([
    supabase.from("toilets").select("*", { count: "exact", head: true }),
    supabase.from("toilets").select("*", { count: "exact", head: true }).eq("review_count", 0),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("has_adult_changing_station", true),
  ])
  return {
    // New names used in homepage sections
    totalToilets:      totalToilets  ?? 0,
    unratedToilets:    unratedToilets ?? 0,
    totalReviews:      totalReviews  ?? 0,
    totalUsers:        totalUsers    ?? 0,
    adultStations:     adultStations ?? 0,
    // Legacy names expected by MobileHero and HeroSection
    totalPosts:        totalReviews  ?? 0,
    totalAdultStations: adultStations ?? 0,
    totalFamilyBathrooms: 0,
    totalGenderNeutral: 0,
  }
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K+"
  return n.toLocaleString()
}

// ── example review prompts ────────────────────────────────────────
const PROMPTS = [
  { emoji: "🍽️", text: "Your favourite restaurant's bathroom" },
  { emoji: "🚫", text: "The #1 bathroom you'll never use again" },
  { emoji: "✈️", text: "Best airport bathroom you've found" },
  { emoji: "🏖️", text: "Cleanest beach bathroom on your travels" },
  { emoji: "🏆", text: "The hidden gem toilet nobody talks about" },
  { emoji: "😱", text: "The most disgusting public toilet you've survived" },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }
  const [initialPosts, stats] = await Promise.all([
    getFeedPosts(0, user?.id),
    getStats(),
  ])

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={profile} />

      {/* ── Mobile hero ── */}
      <div className="block md:hidden">
        <MobileHero isLoggedIn={!!user} userId={user?.id} stats={stats} />
      </div>

      {/* ── Desktop hero ── */}
      <div className="hidden md:block">
        <HeroSection stats={stats} userId={user?.id} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          NEW HERO BANNER — replaces old "bathroom vibe" copy
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-800/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-200/40 dark:bg-indigo-800/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* ── Left — copy ── */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50/80 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-900/30 dark:text-sky-400 mb-5">
                <Sparkles className="h-3 w-3" />
                World&apos;s first community toilet rating platform with crypto rewards
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight">
                Help everyone find{" "}
                <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                  the perfect public toilet
                </span>
              </h1>

              {/* Sub */}
              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 mb-3">
                Rate your favourite restaurant&apos;s bathroom. Warn the world about the one you&apos;ll never use again.
                Join Toilet Book — earn <strong className="text-slate-700 dark:text-slate-200">FLUSH tokens</strong> redeemable for crypto in the future.
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-lg mx-auto lg:mx-0 mb-8">
                We&apos;re building a global community-powered toilet database — block by block, flush by flush.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="h-4 w-4" />
                  Join Free &amp; Earn FLUSH
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Navigation className="h-4 w-4 text-sky-500" />
                  Find toilets near me
                </Link>
              </div>
            </div>

            {/* ── Right — live stats + unrated CTA ── */}
            <div className="flex-shrink-0 w-full lg:w-80 space-y-3">

              {/* Live stat cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Toilet className="h-4 w-4 text-sky-500" />,  label: "Toilets listed",  value: fmtNum(stats.totalToilets) },
                  { icon: <Star   className="h-4 w-4 text-amber-400" />, label: "Reviews posted",  value: fmtNum(stats.totalReviews) },
                  { icon: <Users  className="h-4 w-4 text-violet-500" />,label: "Community members",value: fmtNum(stats.totalUsers) },
                  { icon: <Coins  className="h-4 w-4 text-emerald-500" />,label: "Adult stations found", value: fmtNum(stats.adultStations) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-center shadow-sm">
                    <div className="flex justify-center mb-1">{icon}</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">{value}</div>
                    <div className="text-xs text-slate-400 leading-tight mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* ── UNRATED CTA — the big opportunity card ── */}
              <Link
                href="/map"
                className="group flex items-center justify-between rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50 p-4 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                      {fmtNum(stats.unratedToilets)} toilets need a review!
                    </span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                    These locations are on the map but have no rating yet. Be the first — earn FLUSH tokens for every first review.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-amber-400 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          REVIEW PROMPT IDEAS — give users inspiration
      ══════════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-6 px-4 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center mb-4">
            What will you review first?
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
            {PROMPTS.map(({ emoji, text }) => (
              <Link
                key={text}
                href={user ? "/" : "/signup"}
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all whitespace-nowrap shadow-sm"
              >
                <span>{emoji}</span>
                {text}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CRYPTO / MISSION STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 py-8 px-4">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">
              Help build a global community toilet rating system
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Every review you post grows a public database that benefits travelers, families, and accessibility needs worldwide. Earn FLUSH tokens now — redeemable for real crypto in the future.
            </p>
          </div>
          <Link
            href="/points"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-opacity shadow-lg shadow-sky-500/20"
          >
            <Coins className="h-4 w-4" />
            See how FLUSH works
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEED
      ══════════════════════════════════════════════════════════ */}
      <main
        className="flex-1 mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"
        style={{ paddingBottom: user ? "100px" : undefined }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Latest Reviews</h2>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full px-2.5 py-1">Updated live</span>
        </div>
        <Suspense fallback={<FeedSkeleton />}>
          <PostFeed initialPosts={initialPosts} currentUserId={user?.id} />
        </Suspense>
      </main>

      {/* ── Footer desktop ── */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 hidden md:block">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600">
                <Toilet className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Toilet Book</p>
                <p className="text-xs text-slate-400">Rating the world&apos;s restrooms, one flush at a time</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Explore</p>
                <Link href="/map"    className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Toilet Map</Link>
                <Link href="/shop"   className="text-slate-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">Merch Shop</Link>
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
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Toilet Book · toilet-book.com · All rights reserved</p>
            <a href="mailto:toiletbookmain@gmail.com" className="text-xs text-slate-400 hover:text-sky-500 transition-colors">toiletbookmain@gmail.com</a>
          </div>
        </div>
      </footer>

      {/* ── Footer mobile ── */}
      <footer className="block md:hidden border-t border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 px-4 py-6">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400 mb-3">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Rules</Link>
          <Link href="/terms"    className="hover:text-sky-400 transition-colors">Terms</Link>
          <Link href="/privacy"  className="hover:text-sky-400 transition-colors">Privacy</Link>
          <Link href="/contact"  className="hover:text-sky-400 transition-colors">Contact</Link>
          <Link href="/map"      className="hover:text-sky-400 transition-colors">Map</Link>
          <Link href="/shop"     className="hover:text-sky-400 transition-colors">Shop</Link>
        </div>
        <p className="text-center text-xs text-slate-500">© {new Date().getFullYear()} Toilet Book · All rights reserved</p>
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
