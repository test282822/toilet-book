import { Metadata } from "next"
import Link from "next/link"
import { MapPin, Star, Plane, ArrowRight, Trophy, Toilet } from "lucide-react"

export const metadata: Metadata = {
  title: "Best Airport Bathrooms in the World — Community Rated",
  description:
    "Find the best airport bathrooms worldwide — from Singapore Changi to Tampa International. Community-rated restrooms with cleanliness scores, accessibility info, and real traveler reviews. Rate yours and earn FLUSH tokens.",
  keywords: [
    "best airport bathrooms",
    "best airport restrooms",
    "cleanest airport bathrooms",
    "airport bathroom rating",
    "best airport toilets",
    "clean airport restrooms",
    "Tampa airport bathroom",
    "Singapore Changi airport bathroom",
    "airport restroom finder",
    "rate airport bathroom",
    "airport bathroom review",
  ],
  openGraph: {
    title: "Best Airport Bathrooms in the World — Community Rated",
    description: "Community-rated airport bathrooms worldwide. Find clean, accessible restrooms before your next flight.",
    url: "https://toilet-book.com/best-airport-bathrooms",
  },
  alternates: { canonical: "https://toilet-book.com/best-airport-bathrooms" },
}

const WORLD_CLASS = [
  {
    rank: 1,
    airport: "Singapore Changi Airport",
    code: "SIN",
    emoji: "🇸🇬",
    award: "World's Best Airport Bathroom 2025 — Skytrax",
    desc: "Changi set the global standard in 2025 — marble surfaces, automated fixtures, ambient spa lighting, and hospital-grade cleanliness maintained around the clock. Every detail from the Singaporean design touches to the sound masking technology makes this the benchmark every other airport is measured against.",
    features: ["Automated fixtures", "Adult changing areas", "Family rooms", "Nursing rooms", "Hourly cleaning"],
  },
  {
    rank: 2,
    airport: "Tokyo Haneda Airport",
    code: "HND",
    emoji: "🇯🇵",
    award: "World's Best Airport Bathroom 2026 — Skytrax",
    desc: "Japan's attention to hygiene and precision maintenance is nowhere more evident than at Haneda. Heated floors, automated sanitisation, warm water bidets at every stall, and cleaning schedules that run every 15 minutes during peak hours. The gold standard for cleanliness in the Americas.",
    features: ["Bidet toilets at every stall", "Heated floors", "15-min cleaning rotation", "Smart mirrors"],
  },
  {
    rank: 3,
    airport: "Tampa International Airport",
    code: "TPA",
    emoji: "🇺🇸",
    award: "America's Best Restroom 2022 — Cintas",
    desc: "The best airport bathroom in the United States — Airside C at TPA won America's Best Restroom Award in 2022. Each sink has its own sensor-activated soap, paper towel dispenser, and trash can. Florida-themed murals, natural stone, and a \"cockpit\" sink concept that travellers genuinely stop to photograph.",
    features: ["Individual sink stations", "Florida-themed design", "Spacious stalls", "Touchless everything"],
  },
  {
    rank: 4,
    airport: "Seoul Incheon Airport",
    code: "ICN",
    emoji: "🇰🇷",
    award: "Top 3 World Airport Washrooms 2025",
    desc: "Smart mirrors display your flight information while you freshen up. Korean design sensibilities — clean lines, quality materials, efficient layouts — combine with advanced sanitisation that maintains consistently high standards even at 70 million passengers a year.",
    features: ["Smart flight-info mirrors", "Korean design", "Advanced sanitisation", "Family zones"],
  },
]

const US_AIRPORTS = [
  { airport: "Baltimore-Washington International (BWI)", note: "America's Best Restroom 2023 winner — $55M renovation", rating: "★★★★★" },
  { airport: "Tampa International (TPA) — Airside C",    note: "America's Best Restroom 2022 — the gold standard",  rating: "★★★★★" },
  { airport: "Denver International (DEN) — Concourse C", note: "Floor-to-ceiling mountain views, new C gates extension", rating: "★★★★☆" },
  { airport: "Minneapolis-St Paul (MSP)",                note: "100+ renovated restrooms with regional art installations", rating: "★★★★☆" },
  { airport: "Orlando International (MCO)",              note: "Well-rated for a high-volume tourist airport",           rating: "★★★☆☆" },
  { airport: "Los Angeles International (LAX)",          note: "Overcrowded, under-cleaned — consistently lowest-rated", rating: "★★☆☆☆" },
]

const TIPS = [
  { emoji: "🕐", tip: "Use bathrooms immediately after boarding gates open — before the crowd arrives. Freshest cleaning happens between flights." },
  { emoji: "🗺️", tip: "Walk one gate further — bathrooms away from major intersections are consistently less crowded and better maintained." },
  { emoji: "♿", tip: "Airport family rooms are often unlocked even without a RADAR key in the US — worth checking if you need more space." },
  { emoji: "📱", tip: "Rate the airport bathroom on Toilet Book before you board — helps the next traveller on your exact flight route." },
  { emoji: "🌏", tip: "Asian airports set the global benchmark. If you're transiting Singapore, Tokyo, or Seoul — the bathrooms are genuinely worth the detour." },
  { emoji: "⏰", tip: "6am–8am at most US airports has the cleanest facilities — overnight crews finish and morning cleaning is fresh." },
]

export default function BestAirportBathroomsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Best Airport Bathrooms</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-3 py-1 text-xs text-sky-700 dark:text-sky-400 mb-4">
            <Plane className="h-3 w-3" /> Worldwide · Updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Best Airport Bathrooms in the World
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            You spend hours in airports. The bathroom break shouldn&apos;t be the worst part.
            Toilet Book maps and rates airport restrooms worldwide — so you know exactly what to expect before your next layover.
          </p>
        </div>

        {/* Map CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 mb-10 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold mb-1">Rate your airport bathroom</h2>
              <p className="text-sky-100 text-sm">Every review earns FLUSH tokens — redeemable for crypto at launch. Be the first to rate your departure airport.</p>
            </div>
            <Link href="/signup" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-sky-700 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-50 transition-colors">
              <Toilet className="h-4 w-4" />
              Rate & Earn FLUSH
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* World class */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">World class</h2>
          </div>
          <div className="space-y-5">
            {WORLD_CLASS.map((a) => (
              <div key={a.airport} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-2xl font-bold text-slate-300 dark:text-slate-600 w-8">#{a.rank}</span>
                  <span className="text-xl">{a.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{a.airport} <span className="text-slate-400 font-normal text-sm">({a.code})</span></p>
                    <p className="text-xs text-amber-500 font-medium">🏆 {a.award}</p>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{a.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {a.features.map(f => (
                      <span key={f} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* US Airports */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">US airport rankings</h2>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500">Airport</th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Note</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500">Rating</th>
                </tr>
              </thead>
              <tbody>
                {US_AIRPORTS.map((a, i) => (
                  <tr key={a.airport} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200 text-xs sm:text-sm">{a.airport}</td>
                    <td className="px-3 py-3 text-xs text-slate-400 hidden sm:table-cell">{a.note}</td>
                    <td className="px-5 py-3 text-right text-amber-400 text-xs">{a.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Based on award data and community submissions. Add your airport review to update these rankings.</p>
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Airport bathroom survival tips</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map(({ emoji, tip }) => (
              <div key={tip} className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-4 py-3">
                <span className="text-lg flex-shrink-0">{emoji}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-slate-900 dark:bg-slate-800 p-6 text-center mb-10">
          <div className="text-3xl mb-3">✈️</div>
          <h2 className="text-lg font-bold text-white mb-2">Just landed? Rate the bathroom.</h2>
          <p className="text-sm text-slate-400 mb-5">Takes 30 seconds. Helps every traveller on your route. Earns you FLUSH tokens — redeemable for crypto at launch August 28, 2026.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">
              <Star className="h-4 w-4" /> Join & Rate Your Airport
            </Link>
            <Link href="/map" className="inline-flex items-center gap-2 bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-slate-600 transition-colors">
              <MapPin className="h-4 w-4" /> Find Bathrooms Near Me
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Also on Toilet Book</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/best-toilets-in-florida" className="text-sky-500 hover:text-sky-400">Best bathrooms in Florida →</Link>
            <Link href="/most-accessible-public-bathrooms" className="text-sky-500 hover:text-sky-400">Accessible bathrooms →</Link>
            <Link href="/find-public-bathrooms-near-me" className="text-sky-500 hover:text-sky-400">Find bathrooms near me →</Link>
            <Link href="/points" className="text-sky-500 hover:text-sky-400">Earn FLUSH tokens →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
