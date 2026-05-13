import { Metadata } from "next"
import Link from "next/link"
import { Accessibility, MapPin, ArrowRight, Heart, Shield, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Adult Changing Stations Near Me — Find Changing Places Toilets",
  description:
    "Find adult changing stations and Changing Places toilets near you. The only community map tracking adult-sized changing tables in public restrooms worldwide. Report one and earn 25 FLUSH tokens.",
  keywords: [
    "adult changing station near me",
    "adult changing table near me",
    "changing places toilet near me",
    "adult changing facility",
    "adult changing room near me",
    "changing places bathroom",
    "disabled changing table adult",
    "RADAR key toilet near me",
    "accessible changing facility",
    "adult nappy change near me",
  ],
  openGraph: {
    title: "Adult Changing Stations Near Me — Community Verified Map",
    description: "The only community map tracking adult changing stations worldwide. Find one near you or report a new location.",
    url: "https://toilet-book.com/adult-changing-stations-near-me",
  },
  alternates: { canonical: "https://toilet-book.com/adult-changing-stations-near-me" },
}

const FACTS = [
  { n: "6M+",    label: "Americans who need adult changing facilities" },
  { n: "1 in 7", label: "People globally live with some form of disability" },
  { n: "250lbs", label: "Weight capacity of most adult changing tables" },
  { n: "+25",    label: "FLUSH tokens earned for reporting a station" },
]

const WHERE_TO_LOOK = [
  { place: "Theme parks",        note: "Disney World, Universal — some of the best in the US. Look for First Aid buildings.", found: "high" },
  { place: "Major airports",     note: "Family restrooms at large airports often have adult-sized tables. Ask at information desks.", found: "medium" },
  { place: "Shopping malls",     note: "Larger malls increasingly have dedicated accessible family rooms.", found: "medium" },
  { place: "State & national parks", note: "Federally required at newer visitor centres.", found: "medium" },
  { place: "Hospitals",          note: "Accessible changing rooms always available — ask at patient services.", found: "high" },
  { place: "Newer public buildings", note: "Required in many new US public construction since 2018 BABIES Act.", found: "medium" },
  { place: "Gas stations",       note: "Rare but growing — Buc-ee's locations in the South are notably good.", found: "low" },
  { place: "Restaurants",        note: "Uncommon — report any you find and earn 25 FLUSH bonus tokens.", found: "low" },
]

const WHAT_IS = [
  { q: "What is an adult changing station?", a: "A changing table sized for adults — typically 6ft long, 250lb capacity, with hoist ceiling track access, height-adjustable surface, and a privacy screen. Used by carers assisting people with disabilities, elderly individuals, or anyone who cannot use a standard toilet independently." },
  { q: "What's the difference from a RADAR key toilet?", a: "RADAR key toilets (UK) are locked accessible toilets opened with a standard key. Adult changing stations are a step beyond — they include the changing table and often a hoist. In the US these are sometimes called \"Changing Places\" facilities." },
  { q: "Are they required by law?", a: "In the US, the BABIES Act (2018) requires adult changing stations in federal buildings. Many states are adding requirements. Disney World and some major theme parks have voluntarily added them. Coverage is still patchy — which is exactly why Toilet Book tracks them." },
  { q: "How do I find one near me?", a: "Open the Toilet Book map, tap Filters, and enable \"Adult Station\". You'll see all community-reported locations near you. The data is crowdsourced and growing daily." },
]

export default function AdultChangingStationsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Adult Changing Stations</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs text-blue-700 dark:text-blue-400 mb-4">
            <Accessibility className="h-3 w-3" /> Accessibility · Worldwide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Adult Changing Stations Near Me
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-6">
            Adult changing stations are one of the most critically underreported public facilities in the world.
            Google Maps doesn&apos;t track them. Apple Maps doesn&apos;t track them. Toilet Book does — because the community does.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
          >
            <MapPin className="h-4 w-4" />
            Find adult changing stations near me
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {FACTS.map(({ n, label }) => (
            <div key={label} className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-4 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">{n}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Why this matters */}
        <div className="mb-12 rounded-2xl bg-slate-900 p-6">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-rose-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Why this matters</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-3">
                For carers and families supporting adults with disabilities, the absence of a changing station doesn&apos;t just cause inconvenience —
                it ends the outing. Parents and carers of adults with conditions like cerebral palsy, multiple sclerosis, or severe learning
                disabilities have had to change their family members on dirty toilet floors because no other option exists.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every adult changing station reported on Toilet Book gets a permanent pin on our map — visible to every carer,
                family member, and person who needs it. You can be the person who makes their next day out possible.
              </p>
            </div>
          </div>
        </div>

        {/* Where to find them */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Where to find adult changing stations</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Coverage varies significantly by location. Here&apos;s where you&apos;re most and least likely to find one.</p>
          <div className="space-y-2">
            {WHERE_TO_LOOK.map(({ place, note, found }) => (
              <div key={place} className="flex items-start gap-4 rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{place}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{note}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                  found === "high"   ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" :
                  found === "medium" ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" :
                                       "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400"
                }`}>
                  {found === "high" ? "Common" : found === "medium" ? "Varies" : "Rare"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Frequently asked questions</h2>
          <div className="space-y-4">
            {WHAT_IS.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">{q}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Earn CTA */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Know an adult changing station? Report it. Earn +25 FLUSH.
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Adult changing stations earn the highest bonus reward on Toilet Book — 25 FLUSH tokens per report,
                because they&apos;re the hardest to find and most important to document.
                That converts to 250 FLUSH tokens when the Solana token launches August 28, 2026.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
                  <Accessibility className="h-4 w-4" /> Join & Report a Station
                </Link>
                <Link href="/map" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                  <MapPin className="h-4 w-4" /> Find One Near Me
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-5 py-4 flex items-start gap-3 mb-10">
          <Shield className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 dark:text-slate-400">Your location is never stored. GPS is used only to centre the map. See our <Link href="/privacy" className="text-sky-400 hover:text-sky-300">privacy policy</Link>.</p>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Also on Toilet Book</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/most-accessible-public-bathrooms" className="text-sky-500 hover:text-sky-400">All accessible bathrooms →</Link>
            <Link href="/best-toilets-in-florida" className="text-sky-500 hover:text-sky-400">Best in Florida →</Link>
            <Link href="/find-public-bathrooms-near-me" className="text-sky-500 hover:text-sky-400">Find bathrooms near me →</Link>
            <Link href="/points" className="text-sky-500 hover:text-sky-400">Earn FLUSH tokens →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
