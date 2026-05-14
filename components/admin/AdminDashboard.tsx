"use client"
import React, { useState, useEffect } from "react"
import { AdminLiveMap } from "@/components/admin/AdminLiveMap"
import {
  Users, Star, MapPin, Flag, TrendingUp, Toilet,
  Eye, AlertTriangle, Globe, Zap, Clock,
  CheckCircle2, Camera, Wallet, RefreshCw
} from "lucide-react"

const ADMIN_PASS = "flushmaster2026"

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function MetricCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string
  value: string | number; sub?: string; color: string
}) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
      <div className={`flex items-center gap-1.5 text-xs mb-2 ${color}`}>
        {icon}
        <span className="text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pass, setPass]   = useState("")
  const [error, setError] = useState("")

  const attempt = () => {
    if (pass === ADMIN_PASS) { onAuth() }
    else { setError("Wrong password"); setPass("") }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-5xl">🚽</span>
          <h1 className="text-xl font-bold text-white mt-3">Toilet Book Admin</h1>
          <p className="text-slate-400 text-sm mt-1">Stats & Live Dashboard</p>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <label className="text-xs text-slate-400 block mb-2">Admin password</label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500 mb-3"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
          <button onClick={attempt}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-3 text-sm hover:opacity-90 transition-opacity">
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminDashboard({ data }: { data: any }) {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem("tb_admin") === "1") setAuthed(true)
    } catch {}
  }, [])

  const handleAuth = () => {
    try { sessionStorage.setItem("tb_admin", "1") } catch {}
    setAuthed(true)
  }

  if (!authed) return <LoginGate onAuth={handleAuth} />

  const { metrics, recentPosts, topUsers, flaggedPosts } = data

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚽</span>
            <div>
              <p className="text-sm font-bold text-white">Toilet Book Admin</p>
              <p className="text-xs text-slate-500">Live stats — server rendered</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              Live
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">

        {/* Flagged alert */}
        {metrics.flaggedCount > 0 && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">{metrics.flaggedCount} flagged post{metrics.flaggedCount > 1 ? "s" : ""} need review</p>
              <p className="text-xs text-slate-400">Scroll down to see flagged content</p>
            </div>
          </div>
        )}

        {/* Core platform metrics */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Platform</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<Toilet className="h-3.5 w-3.5" />}  label="Total toilets"    value={fmt(metrics.totalToilets)}   sub="in database"    color="text-sky-400" />
            <MetricCard icon={<Star className="h-3.5 w-3.5" />}    label="Total reviews"    value={fmt(metrics.totalReviews)}   sub="all time"       color="text-amber-400" />
            <MetricCard icon={<Users className="h-3.5 w-3.5" />}   label="Registered users" value={fmt(metrics.totalUsers)}    sub="signed up"      color="text-violet-400" />
            <MetricCard icon={<MapPin className="h-3.5 w-3.5" />}  label="Reviewed pins"    value={fmt(metrics.reviewedPins)}  sub="on map"         color="text-emerald-400" />
          </div>
        </div>

        {/* Activity */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<Clock className="h-3.5 w-3.5" />}      label="Reviews today"     value={fmt(metrics.todayReviews)} sub="last 24 hours"  color="text-sky-400" />
            <MetricCard icon={<TrendingUp className="h-3.5 w-3.5" />} label="Reviews this week" value={fmt(metrics.weekReviews)}  sub="last 7 days"    color="text-emerald-400" />
            <MetricCard icon={<Zap className="h-3.5 w-3.5" />}        label="Flip phone posts"  value={fmt(metrics.flipPosts)}    sub="from RC2200L"   color="text-yellow-400" />
            <MetricCard icon={<Camera className="h-3.5 w-3.5" />}     label="Reviews with photo" value={fmt(metrics.withPhotos)}  sub="have an image"  color="text-pink-400" />
          </div>
        </div>

        {/* Accessibility + FLUSH */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Accessibility & FLUSH</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Adult stations"    value={fmt(metrics.adultStations)}   sub="reported"       color="text-blue-400" />
            <MetricCard icon={<Users className="h-3.5 w-3.5" />}        label="Family bathrooms"  value={fmt(metrics.familyBathrooms)} sub="reported"       color="text-teal-400" />
            <MetricCard icon={<Eye className="h-3.5 w-3.5" />}          label="Unrated toilets"   value={fmt(metrics.unratedToilets)}  sub="need a review"  color="text-orange-400" />
            <MetricCard icon={<Wallet className="h-3.5 w-3.5" />}       label="Whitelist wallets" value={fmt(metrics.whitelistCount)}  sub="FLUSH eligible" color="text-violet-400" />
          </div>
        </div>

        {/* Recent posts table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Recent posts</h2>
            </div>
            <span className="text-xs text-slate-500">Last 10</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-2.5">Venue</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">Rating</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">Source</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">📸</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">📍</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-2.5">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-slate-500 text-xs py-6">No posts yet</td></tr>
                ) : recentPosts.map((p: any, i: number) => (
                  <tr key={p.id || i}
                    className={`border-b border-slate-800/50 last:border-0 ${p.moderation_status === "flagged" ? "bg-red-950/20" : "hover:bg-slate-800/30"}`}>
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium text-white truncate max-w-[140px]">{p.store_name || "Public Toilet"}</p>
                      {p.moderation_status === "flagged" && <span className="text-xs text-red-400">⚠ flagged</span>}
                    </td>
                    <td className="px-2 py-3 text-center text-amber-400 text-xs">
                      {"★".repeat(p.rating || 0)}{"☆".repeat(5 - (p.rating || 0))}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${(p.source||"").includes("flip") ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700 text-slate-400"}`}>
                        {p.source || "web"}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center text-xs">
                      {p.image_url && !p.image_url.includes("android-chrome") ? "✅" : "—"}
                    </td>
                    <td className="px-2 py-3 text-center text-xs">
                      {p.location_lat ? "✅" : "—"}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400">{timeAgo(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagged content */}
        {flaggedPosts.length > 0 && (
          <div className="rounded-2xl bg-red-950/20 border border-red-800/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-red-800/40 flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-semibold text-red-300">Flagged content — needs review</h2>
            </div>
            <div className="p-4 space-y-2">
              {flaggedPosts.map((p: any, i: number) => (
                <div key={p.id || i} className="flex items-center justify-between rounded-lg bg-red-950/30 border border-red-800/30 px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-white">{p.store_name || "Public Toilet"}</p>
                    <p className="text-xs text-slate-400">{"★".repeat(p.rating || 0)} · {p.source || "web"} · {timeAgo(p.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top FLUSH earners */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Top FLUSH earners</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-2.5">#</th>
                <th className="text-left text-xs font-medium text-slate-500 px-3 py-2.5">Username</th>
                <th className="text-right text-xs font-medium text-slate-500 px-3 py-2.5">Balance</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-2.5">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-slate-500 text-xs py-6">No users yet</td></tr>
              ) : topUsers.map((u: any, i: number) => (
                <tr key={i} className="border-b border-slate-800/50 last:border-0">
                  <td className="px-5 py-3 text-xs text-slate-500">{i + 1}</td>
                  <td className="px-3 py-3 text-xs text-white font-medium">{u.username || "—"}</td>
                  <td className="px-3 py-3 text-right text-xs text-amber-400 font-semibold">{fmt(u.flush_balance)} pts</td>
                  <td className="px-5 py-3 text-right text-xs text-sky-400">{fmt((u.flush_balance || 0) * 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live activity map */}
        <AdminLiveMap />

        {/* Quick links */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Quick links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Search Console",   url: "https://search.google.com/search-console",         note: "Clicks, impressions, indexing" },
              { label: "Supabase dashboard", url: "https://supabase.com/dashboard",                 note: "Tables, auth, storage" },
              { label: "Vercel dashboard",  url: "https://vercel.com/dashboard",                    note: "Deploys, logs, analytics" },
              { label: "X / Twitter",       url: "https://twitter.com/search?q=toiletbook&f=live",  note: "Live mentions" },
              { label: "Reddit search",     url: "https://www.reddit.com/search/?q=toilet+book&sort=new", note: "Community mentions" },
              { label: "Solscan",           url: "https://solscan.io",                              note: "Verify FLUSH token post-launch" },
            ].map(({ label, url, note }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 hover:border-sky-500 transition-colors group">
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500">{note}</p>
                </div>
                <span className="text-slate-500 group-hover:text-sky-400 text-xs">→</span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 pb-4">
          Toilet Book Admin · {new Date().getFullYear()} · Refresh page to update stats
        </p>
      </div>
    </div>
  )
}
