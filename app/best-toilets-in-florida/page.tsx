import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Star, Accessibility, Users, ArrowRight, Toilet } from "lucide-react"

export const metadata: Metadata = {
  title: "Best Public Bathrooms in Florida — Rated by Real People",
  description:
    "Find the best public bathrooms in Florida — from Miami to Jacksonville, Disney World to the Space Coast. Community-rated restrooms with accessibility info, cleanliness scores, and real reviews. Updated daily.",
  keywords: [
    "best public bathrooms Florida",
    "clean public restrooms Florida",
    "Florida public toilet finder",
    "best restrooms Florida",
    "public bathrooms near me Florida",
    "accessible bathrooms Florida",
    "clean bathrooms Orlando",
    "clean bathrooms Miami",
    "Tampa public restrooms",
    "Disney World restrooms",
    "Florida beach bathrooms",
  ],
  openGraph: {
    title: "Best Public Bathrooms in Florida — Rated by Real People",
    description:
      "Community-rated public restrooms across Florida. Find clean, accessible bathrooms near you — from Miami to the Panhandle.",
    url: "https://toilet-book.com/best-toilets-in-florida",
  },
  alternates: { canonical: "https://toilet-book.com/best-toilets-in-florida" },
}

// ── Region data — pulled from what we know about FL ──────────────
const FL_REGIONS = [
  {
    city:    "Orlando / Theme Parks",
    emoji:   "🎢",
    desc:    "Disney World, Universal, and EPCOT are known for maintaining some of the cleanest public restrooms in the US — staffed continuously and stocked throughout the day. Look for the Germany Restrooms at EPCOT and Magic Kingdom's Fantasyland facilities, which have earned consistent top marks on Toilet Book.",
    tips:    ["Disney parks restock every 30 minutes", "EPCOT Germany pavilion has adult changing stations", "Universal CityWalk restrooms are open to non-park visitors"],
    mapQuery: "Orlando Florida",
  },
  {
    city:    "Miami",
    emoji:   "🌊",
    desc:    "Miami Beach boardwalk facilities and Bayside Marketplace are community favourites. The city runs public restroom facilities along Ocean Drive and the beach access points at 5th, 10th, and 21st streets. South Pointe Park has consistently well-rated accessible facilities.",
    tips:    ["South Pointe Park — free, accessible, open 6am–11pm", "Bayside Marketplace has indoor climate-controlled facilities", "Many beach access points have outdoor showers too"],
    mapQuery: "Miami Florida",
  },
  {
    city:    "Tampa / St Pete",
    emoji:   "🏆",
    desc:    "Tampa International Airport's Airside C bathroom won America's Best Restroom Award in 2022 — the gold standard for airport facilities. The St Pete Pier public restrooms also rank highly for cleanliness and accessibility, with gender neutral options available.",
    tips:    ["TPA Airside C — best airport bathroom in the country (2022)", "St Pete Pier — waterfront, clean, wheelchair accessible", "Channelside District has well-maintained public facilities"],
    mapQuery: "Tampa Florida",
  },
  {
    city:    "Space Coast / Brevard County",
    emoji:   "🚀",
    desc:    "The Merritt Island area and Kennedy Space Center Visitor Complex maintain high standards. Cocoa Beach public beach access facilities have been rated well by the Toilet Book community. The Port Canaveral cruise terminal facilities are consistently clean due to high visitor volume.",
    tips:    ["Kennedy Space Center has extensive accessible facilities", "Cocoa Beach Pier has public restrooms open to non-diners", "Port Canaveral — 24hr facilities at the cruise terminal"],
    mapQuery: "Merritt Island Florida",
  },
  {
    city:    "Jacksonville",
    emoji:   "🌉",
    desc:    "Jacksonville Beach boardwalk restrooms are maintained by the city and rated well for beach facilities. The Riverside Arts Market area and Treaty Oak Park both have public facilities worth knowing about if you\'re exploring downtown Jacksonville.",
    tips:    ["Jax Beach boardwalk facilities open sunrise to sunset", "Treaty Oak Park — shaded, clean, accessible", "St Johns Town Center has indoor mall-grade facilities"],
    mapQuery: "Jacksonville Florida",
  },
  {
    city:    "Florida Keys",
    emoji:   "🏝️",
    desc:    "The Keys are notoriously short on public restrooms — plan accordingly. John Pennekamp Coral Reef State Park has the best-rated facilities in the upper Keys. Bahia Honda State Park in the middle Keys is consistently praised for cleanliness. Key West has a handful of public facilities near Mallory Square.",
    tips:    ["Bahia Honda State Park — best in the Keys", "Key West Mallory Square has public facilities nearby", "Many marinas have restrooms accessible to the public"],
    mapQuery: "Florida Keys",
  },
  {
    city:    "Panhandle / Pensacola",
    emoji:   "🏖️",
    desc:    "Gulf Islands National Seashore facilities are federally maintained and consistently clean. Pensacola Beach has well-rated public facilities along the main strip. Destin\'s Henderson Beach State Park is a community favourite for cleanliness.",
    tips:    ["Henderson Beach State Park — regularly rated 4+ stars", "Gulf Islands National Seashore facilities are well maintained", "Pensacola Beach main strip has facilities every half mile"],
    mapQuery: "Pensacola Florida",
  },
]

const TIPS = [
  { icon: "🕐", tip: "Visit theme park bathrooms in the first hour — they\'re freshest before peak crowds" },
  { icon: "📍", tip: "State park facilities are federally or state maintained — generally cleaner than city facilities" },
  { icon: "♿", tip: "Florida law requires accessible facilities at all public beaches — use Toilet Book to verify before you go" },
  { icon: "👶", tip: "Adult changing stations are required in new Florida public buildings — use our map filter to find them" },
  { icon: "🌡️", tip: "Indoor facilities at malls and visitor centres are climate controlled — important in Florida summers" },
  { icon: "⭐", tip: "The most reliable clean bathrooms in any Florida city: Publix, Target, and Starbucks are consistently well-rated" },
]

export default function BestBathroomsFloridaPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Best Bathrooms in Florida</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-3 py-1 text-xs text-sky-700 dark:text-sky-400 mb-4">
            <MapPin className="h-3 w-3" /> Florida · Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Best Public Bathrooms in Florida
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Florida gets 140 million visitors a year. Finding a clean, accessible public restroom shouldn&apos;t be a guessing game.
            Toilet Book has mapped <strong className="text-slate-700 dark:text-slate-200">1,700+ Florida restrooms</strong> — rated
            by real people who&apos;ve actually used them.
          </p>
        </div>

        {/* Live map CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 mb-10 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold mb-1">Find bathrooms near you right now</h2>
              <p className="text-sky-100 text-sm">Live map with 1,700+ Florida locations — filter by accessibility, cleanliness, and more</p>
            </div>
            <Link
              href="/map?lat=27.9944&lng=-81.7603&zoom=7"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-50 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Open Florida Map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Regions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">By region</h2>
          <div className="space-y-8">
            {FL_REGIONS.map((r) => (
              <div key={r.city} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{r.emoji}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{r.city}</h3>
                  </div>
                  <Link
                    href={`/map`}
                    className="text-xs text-sky-500 hover:text-sky-400 flex items-center gap-1 flex-shrink-0"
                  >
                    View on map <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{r.desc}</p>
                  <div className="space-y-1.5">
                    {r.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Star className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Florida bathroom tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3">
                <span className="text-lg flex-shrink-0">{icon}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accessibility section */}
        <div className="mb-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Accessibility className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Accessibility in Florida</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Florida law requires accessible restroom facilities at all public beaches and state parks.
            Toilet Book tracks adult changing stations, family bathrooms, and gender-neutral facilities — features
            that are especially hard to find when you need them most.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Adult changing stations", "Family bathrooms", "Gender neutral", "Wheelchair access"].map(f => (
              <span key={f} className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full">{f}</span>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
            Use the filter on our{" "}
            <Link href="/map" className="text-sky-500 hover:text-sky-400">interactive map</Link>
            {" "}to find accessible facilities near you.
          </p>
        </div>

        {/* CTA to join */}
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 p-6 text-center">
          <div className="text-3xl mb-3">🚽</div>
          <h2 className="text-lg font-bold text-white mb-2">Know a great Florida bathroom we haven&apos;t rated yet?</h2>
          <p className="text-sm text-slate-400 mb-5">
            Join Toilet Book, rate it, and earn FLUSH tokens — redeemable for crypto in the future.
            Every review helps travelers, families, and people with accessibility needs find the right bathroom.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              <Toilet className="h-4 w-4" /> Join & Rate a Bathroom
            </Link>
            <Link href="/map" className="inline-flex items-center gap-2 bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-600 transition-colors">
              <MapPin className="h-4 w-4" /> Browse the Florida Map
            </Link>
          </div>
        </div>

        {/* Internal links */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Also on Toilet Book</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/most-accessible-public-bathrooms" className="text-sky-500 hover:text-sky-400 transition-colors">Most accessible public bathrooms →</Link>
            <Link href="/map" className="text-sky-500 hover:text-sky-400 transition-colors">Global toilet map →</Link>
            <Link href="/points" className="text-sky-500 hover:text-sky-400 transition-colors">Earn FLUSH tokens →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
