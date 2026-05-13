import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, Zap, TrendingUp, CheckCircle2, Mail, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "Spotlight Your Bathroom — Get Featured on Toilet Book",
  description:
    "Get your venue's bathroom featured on Toilet Book's map. Spotlight listings appear first in searches, earn a verified badge, and reach travelers actively looking for clean restrooms near them.",
}

const TIERS = [
  {
    name:     "Basic Listing",
    price:    "Free",
    period:   "",
    color:    "border-slate-200 dark:border-slate-700",
    badge:    "",
    features: [
      "Pin on the public map",
      "Community ratings visible",
      "Directions link",
      "Facility badges (accessible, family, etc.)",
    ],
    cta:      "Already live",
    ctaLink:  "/map",
    disabled: true,
  },
  {
    name:     "Verified",
    price:    "$9",
    period:   "/ month",
    color:    "border-sky-400 dark:border-sky-500",
    badge:    "Most popular",
    features: [
      "Everything in Basic",
      "✓ Verified badge on your listing",
      "Correct your facility data officially",
      "Respond to reviews publicly",
      "Remove your location if venue closes",
      "Priority support",
    ],
    cta:      "Get verified",
    ctaLink:  "mailto:toiletbookmain@gmail.com?subject=Verified Listing — Toilet Book",
    disabled: false,
  },
  {
    name:     "Spotlight",
    price:    "$29",
    period:   "/ month",
    color:    "border-violet-400 dark:border-violet-500",
    badge:    "Most visibility",
    features: [
      "Everything in Verified",
      "⚡ Spotlight pin — appears first in area searches",
      "Featured in nearby search results",
      "Banner photo on your listing",
      "\"Clean & Recommended\" badge",
      "Monthly visibility report",
      "First access to new features",
    ],
    cta:      "Get Spotlight",
    ctaLink:  "mailto:toiletbookmain@gmail.com?subject=Spotlight Listing — Toilet Book",
    disabled: false,
  },
]

const USE_CASES = [
  {
    icon: "🏪",
    title: "Retail & restaurants",
    desc: "Turn your clean bathroom into a competitive advantage. Travelers actively search for restrooms before choosing where to stop. Be the venue that shows up first.",
  },
  {
    icon: "🏨",
    title: "Hotels & hospitality",
    desc: "Showcase your lobby and public restroom standards to travelers planning their route. A Verified badge signals quality before they arrive.",
  },
  {
    icon: "🏛️",
    title: "Public facilities & parks",
    desc: "Government bodies and park services can verify their listings to ensure accurate accessibility data reaches people who need it most.",
  },
  {
    icon: "✈️",
    title: "Airports & transit hubs",
    desc: "Millions of travelers search for airport bathrooms before their flight. Spotlight your terminal facilities to reach them at the right moment.",
  },
]

const HOW_IT_WORKS = [
  { step: "1", text: "Email us at toiletbookmain@gmail.com with your venue name and address" },
  { step: "2", text: "We verify your ownership or management role (usually same day)" },
  { step: "3", text: "Your listing gets the badge and any selected features within 24 hours" },
  { step: "4", text: "Log in to respond to reviews and update your facility info anytime" },
]

export default function SpotlightPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="text-xl">🚽</span>Toilet Book
          </Link>
          <span className="text-xs text-violet-500 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-full px-3 py-1">For businesses</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 px-3 py-1 text-xs text-violet-700 dark:text-violet-400 mb-5">
            <Sparkles className="h-3 w-3" /> For venue owners & businesses
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Put your bathroom<br />on the map
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Toilet Book reaches travelers, families, and accessibility-conscious visitors who are actively
            looking for clean restrooms near them. Get your venue in front of them first.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-12">
          {[
            { n: "47K+", label: "Locations mapped" },
            { n: "1,733", label: "Florida locations" },
            { n: "Aug 28", label: "FLUSH token launch" },
          ].map(({ n, label }) => (
            <div key={label} className="text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-xl font-bold text-slate-900 dark:text-white">{n}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">Listing options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIERS.map(({ name, price, period, color, badge, features, cta, ctaLink, disabled }) => (
              <div key={name} className={`rounded-2xl border-2 ${color} bg-white dark:bg-slate-900 p-5 flex flex-col relative`}>
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-xs font-bold bg-gradient-to-r from-sky-500 to-violet-600 text-white px-3 py-1 rounded-full whitespace-nowrap">{badge}</span>
                  </div>
                )}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{price}</span>
                    <span className="text-slate-400 text-sm mb-1">{period}</span>
                  </div>
                </div>
                <ul className="space-y-2 flex-1 mb-5">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {disabled ? (
                  <div className="text-center text-xs text-slate-400 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">{cta}</div>
                ) : (
                  <a
                    href={ctaLink}
                    className="block text-center text-sm font-semibold py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white hover:opacity-90 transition-opacity"
                  >
                    {cta}
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-4">All plans billed monthly. Cancel anytime. Contact us for annual pricing.</p>
        </div>

        {/* Use cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Who this is for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">How to get listed</h2>
          <div className="space-y-3">
            {HOW_IT_WORKS.map(({ step, text }) => (
              <div key={step} className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{step}</div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Important note */}
        <div className="mb-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">About reviews</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Verified and Spotlight plans allow you to respond to reviews and correct factual errors.
            They do not allow removal of negative reviews. Community honesty is the foundation of
            Toilet Book — a platform that removes reviews on request would be worthless to users.
            The best way to improve your rating is to improve your bathroom.
          </p>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h2 className="text-xl font-bold text-white mb-2">Ready to get started?</h2>
          <p className="text-sm text-slate-400 mb-6">Email us with your venue name and address. We&apos;ll have you verified within 24 hours.</p>
          <a
            href="mailto:toiletbookmain@gmail.com?subject=Spotlight Listing Enquiry — Toilet Book"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            <Mail className="h-4 w-4" />
            toiletbookmain@gmail.com
          </a>
          <p className="text-xs text-slate-500 mt-4">We respond within 24 hours · No contracts · Cancel anytime</p>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Platform Rules</Link>
          <Link href="/contact"  className="hover:text-sky-400 transition-colors">Contact Us</Link>
          <Link href="/"         className="hover:text-sky-400 transition-colors">Back to Toilet Book</Link>
        </div>
      </div>
    </div>
  )
}
