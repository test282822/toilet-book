"use client"
import { useState } from "react"
import Link from "next/link"
import {
  Building2, Star, MessageSquare, TrendingUp, Plus,
  CheckCircle2, Clock, AlertTriangle, Settings, BarChart3,
  Crown, Store, Reply, Eye, MapPin, Megaphone, Mail,
  CreditCard, ExternalLink, Sparkles
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toLocaleString()
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1) return "today"
  if (d < 7) return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

type Tab = "overview" | "venues" | "reviews" | "promote" | "settings"

export function BusinessDashboard({ data, userId }: { data: any; userId: string }) {
  const { profile, claims, venueReviews, stats } = data
  const [tab, setTab] = useState<Tab>("overview")
  const [responding, setResponding] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const plan = profile?.business_plan ?? "none"

  const isBusiness = profile?.is_business || plan !== "none"

  // ── Not a business yet — upsell ──
  if (!isBusiness) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Toilet Book for Business</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Claim your venue, respond to reviews, and stand out on the map. Turn your clean bathroom into a competitive advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Verified */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-sky-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Verified</h2>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">$9<span className="text-sm text-slate-400 font-normal">/mo</span></p>
            <ul className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Verified badge on your listing</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Respond to reviews</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Correct facility info</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Basic analytics</li>
            </ul>
          </div>

          {/* Spotlight */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-300 dark:border-violet-700 p-6 relative">
            <span className="absolute top-3 right-3 text-xs bg-violet-500 text-white rounded-full px-2 py-0.5">Popular</span>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-violet-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Spotlight</h2>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">$29<span className="text-sm text-slate-400 font-normal">/mo</span></p>
            <ul className="space-y-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Everything in Verified</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Featured pin on the map</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Appear first in area searches</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />Advanced analytics + competitor view</li>
            </ul>
          </div>
        </div>

        <Link
          href="/spotlight"
          className="block w-full text-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-3.5 text-sm hover:opacity-90 transition-opacity"
        >
          Get started — claim your venue
        </Link>
        <p className="text-center text-xs text-slate-400 mt-3">
          Community reviews stay honest. Paid plans never remove or hide negative reviews.
        </p>
      </div>
    )
  }

  // ── Submit business response ──
  const submitResponse = async (postId: string) => {
    if (!responseText.trim()) return
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("posts")
        .update({
          business_response: responseText,
          business_response_at: new Date().toISOString(),
          business_response_by: userId,
        })
        .eq("id", postId)
      if (error) throw error
      toast.success("Response posted!")
      setResponding(null)
      setResponseText("")
    } catch {
      toast.error("Could not post response")
    }
  }

  const planBadge = plan === "spotlight"
    ? { label: "Spotlight", icon: <Crown className="h-3.5 w-3.5" />, color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40" }
    : { label: "Verified",  icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-sky-700 dark:text-sky-300", bg: "bg-sky-100 dark:bg-sky-900/40" }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {profile?.business_name || "Business Dashboard"}
            </h1>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${planBadge.bg} ${planBadge.color}`}>
              {planBadge.icon} {planBadge.label} plan
            </span>
          </div>
        </div>
        <Link
          href="/spotlight"
          className="flex items-center gap-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Claim a venue
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        {([
          { id: "overview", label: "Overview",  icon: <BarChart3 className="h-4 w-4" /> },
          { id: "venues",   label: "My Venues", icon: <Store className="h-4 w-4" /> },
          { id: "reviews",  label: "Reviews",   icon: <MessageSquare className="h-4 w-4" /> },
          { id: "promote",  label: "Promote",   icon: <Megaphone className="h-4 w-4" /> },
          { id: "settings", label: "Settings",  icon: <Settings className="h-4 w-4" /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === id
                ? "border-sky-500 text-sky-600 dark:text-sky-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Store className="h-4 w-4 text-sky-400" />,        label: "Claimed venues",  value: fmt(stats.totalVenues) },
              { icon: <Star className="h-4 w-4 text-amber-400" />,       label: "Total reviews",   value: fmt(stats.totalReviews) },
              { icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,label: "Avg rating",      value: stats.avgRating },
              { icon: <AlertTriangle className="h-4 w-4 text-orange-400" />,label: "Need response",  value: fmt(stats.needsResponse) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-xs text-slate-400">{label}</span></div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {stats.needsResponse > 0 && (
            <div className="rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">{stats.needsResponse} review{stats.needsResponse > 1 ? "s" : ""} need a response</p>
                  <p className="text-xs text-slate-500">Responding to negative reviews shows you care</p>
                </div>
              </div>
              <button onClick={() => setTab("reviews")} className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline">View →</button>
            </div>
          )}

          {/* Quick actions */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Respond to reviews",   desc: "Reply to customer feedback",      icon: <Reply className="h-4 w-4 text-sky-400" />,     action: () => setTab("reviews") },
                { label: "Claim another venue",  desc: "Add more locations you manage",   icon: <Plus className="h-4 w-4 text-emerald-400" />,  href: "/spotlight" },
                { label: "Promote your venue",   desc: "Spotlight ads + featured pins",   icon: <Megaphone className="h-4 w-4 text-violet-400" />, action: () => setTab("promote") },
                { label: "Update facility info", desc: "Correct hours, accessibility",    icon: <MapPin className="h-4 w-4 text-amber-400" />,  action: () => setTab("venues") },
              ].map(({ label, desc, icon, action, href }) => {
                const inner = (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-sky-400 transition-colors cursor-pointer">
                    {icon}
                    <div className="flex-1"><p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
                  </div>
                )
                return href
                  ? <Link key={label} href={href}>{inner}</Link>
                  : <div key={label} onClick={action}>{inner}</div>
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── VENUES ── */}
      {tab === "venues" && (
        <div className="space-y-3">
          {claims.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-16 text-center">
              <Store className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">No venues claimed yet</p>
              <Link href="/spotlight" className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-600 transition-colors">
                <Plus className="h-4 w-4" /> Claim your first venue
              </Link>
            </div>
          ) : claims.map((claim: any) => (
            <div key={claim.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">🚽</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{claim.venue_name}</p>
                    <p className="text-xs text-slate-400">Claimed {timeAgo(claim.claimed_at)}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  claim.status === "verified" ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" :
                  claim.status === "pending"  ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" :
                  "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                }`}>
                  {claim.status === "verified" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {claim.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── REVIEWS ── */}
      {tab === "reviews" && (
        <div className="space-y-3">
          {venueReviews.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-16 text-center">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No reviews on your venues yet</p>
            </div>
          ) : venueReviews.map((review: any) => (
            <div key={review.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">{review.store_name || "Your venue"}</p>
                  <p className="text-amber-400 text-sm">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                </div>
                <span className="text-xs text-slate-400">{timeAgo(review.created_at)}</span>
              </div>
              {review.caption && <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{review.caption}</p>}

              {review.business_response ? (
                <div className="rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 px-4 py-3">
                  <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1 flex items-center gap-1"><Reply className="h-3 w-3" /> Your response</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.business_response}</p>
                </div>
              ) : responding === review.id ? (
                <div className="space-y-2">
                  <textarea
                    value={responseText}
                    onChange={e => setResponseText(e.target.value)}
                    placeholder="Write a professional response..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => submitResponse(review.id)} className="bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-sky-600">Post response</button>
                    <button onClick={() => { setResponding(null); setResponseText("") }} className="text-slate-500 px-3 py-1.5 text-xs">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setResponding(review.id)} className="flex items-center gap-1.5 text-sm text-sky-600 dark:text-sky-400 hover:underline">
                  <Reply className="h-3.5 w-3.5" /> Respond to this review
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PROMOTE ── */}
      {tab === "promote" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-800 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone className="h-5 w-5 text-violet-500" />
              <h2 className="font-bold text-slate-900 dark:text-white">Promote your venue</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Spotlight venues appear first in area searches and get a highlighted pin on the map. Perfect for cafes, restaurants, gas stations, and retail wanting to advertise clean facilities.
            </p>
            {plan !== "spotlight" ? (
              <Link href="/spotlight" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90">
                <Crown className="h-4 w-4" /> Upgrade to Spotlight — $29/mo
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-xl text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Spotlight active — your venues are featured
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Sparkles className="h-4 w-4 text-amber-400" />,  title: "Featured map pin",      desc: "Highlighted, larger pin that stands out from standard listings" },
              { icon: <Eye className="h-4 w-4 text-sky-400" />,        title: "Top of search",          desc: "Appear first when users search bathrooms in your area" },
              { icon: <BarChart3 className="h-4 w-4 text-violet-400" />,title: "Competitor insights",   desc: "See how your ratings compare to nearby venues" },
              { icon: <Mail className="h-4 w-4 text-emerald-400" />,    title: "Review alerts",          desc: "Get notified instantly when someone reviews your venue" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-2 mb-1">{icon}<p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p></div>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab === "settings" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Settings className="h-4 w-4" /> Business settings</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div><p className="text-sm text-slate-700 dark:text-slate-300">Business name</p><p className="text-xs text-slate-400">{profile?.business_name || "Not set"}</p></div>
                <button className="text-xs text-sky-500 hover:underline">Edit</button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div><p className="text-sm text-slate-700 dark:text-slate-300">Current plan</p><p className="text-xs text-slate-400">{planBadge.label} — {plan === "spotlight" ? "$29" : "$9"}/mo</p></div>
                <Link href="/spotlight" className="text-xs text-sky-500 hover:underline">Change</Link>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div><p className="text-sm text-slate-700 dark:text-slate-300">Email review alerts</p><p className="text-xs text-slate-400">Get notified of new reviews</p></div>
                <button className="text-xs text-sky-500 hover:underline">Manage</button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div><p className="text-sm text-slate-700 dark:text-slate-300">Billing</p><p className="text-xs text-slate-400">Manage subscription & payment</p></div>
                <button className="flex items-center gap-1 text-xs text-sky-500 hover:underline"><CreditCard className="h-3 w-3" /> Manage</button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Need help?</h2>
            <p className="text-xs text-slate-400 mb-3">Our team is here to help you get the most out of your business listing.</p>
            <a href="mailto:toiletbookmain@gmail.com" className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:underline">
              <Mail className="h-3.5 w-3.5" /> toiletbookmain@gmail.com
            </a>
          </div>
        </div>
      )}

    </div>
  )
}
