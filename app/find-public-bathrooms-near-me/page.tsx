import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Navigation, Star, ArrowRight, Toilet, Coins, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Find Public Bathrooms Near Me — Free Toilet Finder Map",
  description:
    "Find public bathrooms near you instantly — free, no signup required. 47,000+ toilets mapped worldwide with cleanliness ratings, accessibility info, and directions. Rate bathrooms and earn FLUSH crypto rewards.",
  keywords: [
    "find public bathrooms near me",
    "public bathroom near me",
    "toilet near me",
    "restroom near me",
    "find a bathroom near me",
    "public toilet finder",
    "bathroom finder app",
    "free bathroom finder",
    "nearest public toilet",
    "clean bathroom near me",
    "open bathroom near me",
  ],
  openGraph: {
    title: "Find Public Bathrooms Near Me — Free Toilet Finder",
    description: "47,000+ public bathrooms mapped worldwide. Find clean, accessible restrooms near you — free, no account needed.",
    url: "https://toilet-book.com/find-public-bathrooms-near-me",
  },
  alternates: { canonical: "https://toilet-book.com/find-public-bathrooms-near-me" },
}

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: <Navigation className="h-5 w-5 text-sky-400" />,
    title: "Tap \"Find toilets near me\"",
    desc: "Your browser asks for location permission once. We never store your GPS coordinates — they're used only to centre the map.",
  },
  {
    step: "2",
    icon: <MapPin className="h-5 w-5 text-emerald-400" />,
    title: "See pins appear instantly",
    desc: "47,000+ bathroom locations load on the map around you — colour coded green (clean), amber (average), and red (avoid).",
  },
  {
    step: "3",
    icon: <Star className="h-5 w-5 text-amber-400" />,
    title: "Tap any pin for details",
    desc: "See the cleanliness rating, accessibility features, directions link, and reviews from people who've actually been there.",
  },
  {
    step: "4",
    icon: <Coins className="h-5 w-5 text-violet-400" />,
    title: "Rate it and earn FLUSH",
    desc: "Post a review and earn FLUSH tokens. Launching on Solana August 28, 2026 — start earning now.",
  },
]

const FILTERS = [
  { label: "⭐ Has reviews",       desc: "Only show bathrooms that real people have rated" },
  { label: "♿ Adult station",     desc: "Adult-sized changing tables for people with disabilities" },
  { label: "👨‍👩‍👧 Family bathroom", desc: "Private rooms for parents and caregivers" },
  { label: "⚧ Gender neutral",    desc: "Open to everyone regardless of gender" },
  { label: "💰 Free only",        desc: "Filter out pay-to-use facilities" },
]

const COMMON_SPOTS = [
  { place: "McDonald's",     note: "Generally clean, accessible, and open to non-customers in most states" },
  { place: "Starbucks",      note: "Clean and widely available — some require a code" },
  { place: "Target",         note: "Consistently well-maintained, family rooms often available" },
  { place: "Publix",         note: "Florida's best grocery store bathroom — clean and reliably stocked" },
  { place: "State Parks",    note: "Federally maintained — typically clean even in remote areas" },
  { place: "Public Libraries", note: "Free, clean, accessible, no purchase required" },
  { place: "Shopping Malls", note: "Climate controlled, regularly cleaned, usually accessible" },
  { place: "Hospitals",      note: "Technically public areas have clean bathrooms — ask at reception" },
]

export default function FindBathroomsNearMePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Find Bathrooms Near Me</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Find Public Bathrooms Near You
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8">
            47,000+ public toilets mapped worldwide — rated for cleanliness, accessibility, and comfort by real people.
            Free to use. No account required.
          </p>

          {/* Big CTA button */}
          <Link
            href="/map"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:opacity-90 transition-opacity shadow-xl shadow-sky-500/25 mb-4"
          >
            <Navigation className="h-5 w-5" />
            Find toilets near me now
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="text-xs text-slate-400">Free · No signup needed · Works worldwide</p>
        </div>

        {/* Map preview CTA */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 mb-12">
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-white font-semibold mb-2">Interactive toilet map</p>
              <p className="text-slate-400 text-sm mb-6">47,000+ locations · colour-coded by cleanliness rating</p>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                <MapPin className="h-4 w-4" /> Open the map
              </Link>
            </div>
            {/* Decorative pins */}
            {[
              { top: "20%", left: "15%", color: "#10b981" },
              { top: "40%", left: "60%", color: "#10b981" },
              { top: "65%", left: "30%", color: "#f59e0b" },
              { top: "30%", left: "80%", color: "#ef4444" },
              { top: "70%", left: "70%", color: "#10b981" },
            ].map((pin, i) => (
              <div
                key={i}
                className="absolute"
                style={{ top: pin.top, left: pin.left }}
              >
                <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ background: pin.color }} />
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
              <div key={step} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {step}
                  </div>
                  {icon}
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{title}</p>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Filter for what you need</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Not all bathrooms are created equal. Our map filters help you find exactly what you need — especially for accessibility requirements that other apps don&apos;t even track.</p>
          <div className="space-y-2">
            {FILTERS.map(({ label, desc }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 w-44 flex-shrink-0">{label}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common spots */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Best places to find a bathroom in a pinch</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">No app needed — these chains and places are your best bet when you need a bathroom fast and can&apos;t stop to check a map.</p>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {COMMON_SPOTS.map((s, i) => (
              <div key={s.place} className={`flex items-start gap-4 px-5 py-3.5 ${i < COMMON_SPOTS.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
                <span className="text-slate-800 dark:text-white font-semibold text-sm w-32 flex-shrink-0">{s.place}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{s.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <div className="mb-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Your location stays private</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">We use your GPS only to centre the map. We never store, sell, or share your location data. You can also browse the map manually without sharing your location at all.</p>
          </div>
        </div>

        {/* Join CTA */}
        <div className="rounded-2xl bg-slate-900 p-6 text-center">
          <div className="text-3xl mb-3">🚽</div>
          <h2 className="text-lg font-bold text-white mb-2">Rate a bathroom. Help the next person find it.</h2>
          <p className="text-sm text-slate-400 mb-5">Join Toilet Book for free — earn FLUSH tokens for every review you post. Tokens convert to real Solana crypto on August 28, 2026.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity">
            <Toilet className="h-4 w-4" /> Join Free & Start Earning
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Also on Toilet Book</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/best-toilets-in-florida" className="text-sky-500 hover:text-sky-400">Best bathrooms in Florida →</Link>
            <Link href="/most-accessible-public-bathrooms" className="text-sky-500 hover:text-sky-400">Accessible bathrooms →</Link>
            <Link href="/best-airport-bathrooms" className="text-sky-500 hover:text-sky-400">Best airport bathrooms →</Link>
            <Link href="/adult-changing-stations-near-me" className="text-sky-500 hover:text-sky-400">Adult changing stations →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
