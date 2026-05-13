import { Metadata } from "next"
import Link from "next/link"
import { Accessibility, Baby, Users, ShieldCheck, MapPin, ArrowRight, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Most Accessible Public Bathrooms — Adult Changing Stations, Family Rooms & More",
  description:
    "Find accessible public bathrooms near you — including adult changing stations, family bathrooms, gender-neutral facilities, and wheelchair-accessible restrooms. Community-verified accessibility data worldwide.",
  keywords: [
    "accessible public bathrooms",
    "adult changing station near me",
    "adult changing table public restroom",
    "family bathroom near me",
    "gender neutral bathroom near me",
    "wheelchair accessible bathroom",
    "accessible restroom finder",
    "changing places toilet",
    "disability bathroom finder",
    "ADA accessible bathroom",
    "accessible toilet map",
  ],
  openGraph: {
    title: "Most Accessible Public Bathrooms — Find Adult Changing Stations & Family Rooms",
    description:
      "Community-verified accessibility data for public restrooms worldwide. Find adult changing stations, family bathrooms, and gender-neutral facilities near you.",
    url: "https://toilet-book.com/most-accessible-public-bathrooms",
  },
  alternates: { canonical: "https://toilet-book.com/most-accessible-public-bathrooms" },
}

const FEATURES = [
  {
    icon: <Accessibility className="h-6 w-6 text-blue-500" />,
    title: "Adult Changing Stations",
    badge: "+25 FLUSH",
    desc: "Adult-sized changing tables for people with disabilities who need assistance with personal care. Critically underreported in standard mapping apps. Toilet Book users earn bonus FLUSH tokens for reporting these.",
    why: "An estimated 6 million Americans need adult changing facilities. Most apps don't track this at all.",
    filterKey: "adultStation",
  },
  {
    icon: <Baby className="h-6 w-6 text-sky-500" />,
    title: "Family Bathrooms",
    badge: "+15 FLUSH",
    desc: "Private single-room facilities suitable for parents with young children, caregivers assisting adults, or anyone who needs extra space and privacy.",
    why: "Families with young children and caregivers lose significant time searching for these. Most aren't listed anywhere.",
    filterKey: "familyBathroom",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-violet-500" />,
    title: "Gender Neutral Bathrooms",
    badge: "+15 FLUSH",
    desc: "Restrooms open to people of any gender. Increasingly available in modern venues, universities, and progressive businesses.",
    why: "Trans and non-binary individuals face real safety concerns in gendered restrooms. Having accurate location data matters.",
    filterKey: "genderNeutral",
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-500" />,
    title: "Wheelchair Accessible",
    badge: "Standard",
    desc: "ADA-compliant facilities with wider stalls, grab bars, and accessible fixtures. Required by law in the US for public buildings — but often poorly maintained or temporarily blocked.",
    why: "Legal requirement doesn't mean it's actually usable. Community verification is the only way to know for sure.",
    filterKey: null,
  },
]

const STATS = [
  { n: "6M+", label: "Americans who need adult changing facilities" },
  { n: "1 in 7", label: "people globally live with some form of disability" },
  { n: "68%",   label: "of parents report struggling to find family bathrooms" },
  { n: "47K+",  label: "toilets mapped on Toilet Book worldwide" },
]

const HOW_TO = [
  { step: "1", title: "Open the map", desc: 'Go to toilet-book.com/map or tap "Find toilets near me" on the homepage.' },
  { step: "2", title: "Apply filters", desc: 'Click Filters → check "Adult Station", "Family Bathroom", or "Gender Neutral" to show only matching locations.' },
  { step: "3", title: "Check the listing", desc: "Tap any pin to see verified facility details, reviews, and a direct link to Google Maps directions." },
  { step: "4", title: "Add missing ones", desc: "Found an accessible bathroom that's not on the map? Post a review — earn 15-25 FLUSH tokens for reporting accessibility features." },
]

export default function AccessibleBathroomsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-sm text-slate-500">Accessible Public Bathrooms</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-400 mb-4">
            <Accessibility className="h-3 w-3" /> Accessibility Guide · Worldwide
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Most Accessible Public Bathrooms
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Finding an adult changing station, family bathroom, or gender-neutral restroom shouldn&apos;t require a phone call
            or a gamble. Toilet Book is the only community platform that specifically tracks these features — verified by
            real people who&apos;ve been there.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {STATS.map(({ n, label }) => (
            <div key={label} className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{n}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What we track</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            These four features are missing from Google Maps, Apple Maps, and every other restroom finder. Toilet Book community members report and verify them — and earn bonus FLUSH tokens for doing so.
          </p>
          <div className="space-y-4">
            {FEATURES.map(({ icon, title, badge, desc, why }) => (
              <div key={title} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{desc}</p>
                    <div className="flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                      <Heart className="h-3 w-3 text-rose-400 mt-0.5 flex-shrink-0" />
                      {why}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to find */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to find accessible bathrooms</h2>
          <div className="space-y-3">
            {HOW_TO.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {step}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <MapPin className="h-4 w-4" />
              Open the accessibility map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Why this matters */}
        <div className="mb-12 rounded-2xl bg-slate-900 dark:bg-slate-800 p-6 text-white">
          <h2 className="text-lg font-bold mb-3">Why this matters beyond convenience</h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            For most people, finding a bathroom is an inconvenience. For millions of others, it&apos;s a genuine barrier to leaving the house.
            People with Crohn&apos;s disease, IBD, ostomies, mobility impairments, and parents of young children all
            plan their entire days around bathroom availability.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            During health outbreaks — norovirus, COVID, or any future large-scale event — knowing which public bathrooms
            are clean, maintained, and accessible becomes even more critical. Toilet Book is building the infrastructure
            that makes that possible.
          </p>
          <p className="text-sm text-slate-400">
            Every review you post contributes to a public database that helps real people make real decisions.
            Join the community and earn FLUSH tokens — redeemable for crypto in the future.
          </p>
        </div>

        {/* Related links */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Also on Toilet Book</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/best-toilets-in-florida" className="text-sky-500 hover:text-sky-400 transition-colors">Best bathrooms in Florida →</Link>
            <Link href="/map" className="text-sky-500 hover:text-sky-400 transition-colors">Global toilet map →</Link>
            <Link href="/points" className="text-sky-500 hover:text-sky-400 transition-colors">Earn FLUSH tokens →</Link>
            <Link href="/signup" className="text-sky-500 hover:text-sky-400 transition-colors">Join the community →</Link>
          </div>
        </div>

      </div>
    </div>
  )
}
