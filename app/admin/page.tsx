"use client"
import React, { useState, useEffect, useCallback } from "react"
import {
  Users, Star, MapPin, RefreshCw, Loader2, Flag,
  TrendingUp, Toilet, Eye, AlertTriangle, Globe,
  Zap, Clock, CheckCircle2, XCircle
} from "lucide-react"

const SB_URL = "https://dltanpkvuxomubasfepm.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdGFucGt2dXhvbXViYXNmZXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzA0MDIsImV4cCI6MjA2MjI0NjQwMn0.OvKfrUk6NwOekM1XJ9MP7A_768VkjMu0tDhV7W5tKbc"
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }

// ── Change this to your chosen password ──────────────────
const ADMIN_PASS = "flushmaster2026"

async function sbCount(table: string, filter = ""): Promise<number> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?select=id${filter ? `&${filter}` : ""}&limit=1`, {
      headers: { ...HDR, Prefer: "count=exact" }
    })
    const cr = res.headers.get("content-range")
    return cr ? parseInt(cr.split("/")[1]) : 0
  } catch {
    return 0
  }
}

async function sbSelect<T>(table: string, params: string): Promise<T[]> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, { headers: HDR })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function fmt(n: number | null): string {
  if (n === null || n === undefined) return "—"
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toLocaleString()
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Login gate ───────────────────────────────────────────
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
          <button
            onClick={attempt}
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold py-3 text-sm hover:opacity-90 transition-opacity"
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Metric card ──────────────────────────────────────────
function MetricCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number | null; sub?: string; color: string
}) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
      <div className={`flex items-center gap-1.5 text-xs mb-2 ${color}`}>
        {icon}
        <span className="text-slate-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value ?? "—"}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Main dashboard ───────────────────────────────────────
function Dashboard() {
  const [loading, setLoading]         = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [metrics, setMetrics]         = useState<any>({})
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  const [flagged, setFlagged]         = useState<any[]>([])
  const [topUsers, setTopUsers]       = useState<any[]>([])
  const [flipPosts, setFlipPosts]     = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [
        totalToilets, totalReviews, totalUsers,
        adultStations, reviewedPins, todayReviews,
        weekReviews, flipCount, flaggedCount
      ] = await Promise.all([
        sbCount("toilets"),
        sbCount("posts"),
        sbCount("profiles"),
        sbCount("posts", "has_adult_changing_station=eq.true"),
        sbCount("toilets", "review_count=gt.0"),
        sbCount("posts", `created_at=gte.${new Date(Date.now()-86400000).toISOString()}`),
        sbCount("posts", `created_at=gte.${new Date(Date.now()-604800000).toISOString()}`),
        sbCount("posts", "source=ilike.flip%"),
        sbCount("posts", "moderation_status=eq.flagged").catch(() => 0),
      ])

      setMetrics({ totalToilets, totalReviews, totalUsers, adultStations, reviewedPins, todayReviews, weekReviews, flaggedCount })
      setFlipPosts(flipCount)

      // Recent posts
      const posts = await sbSelect<any>("posts",
        "select=id,rating,store_name,source,created_at,has_adult_changing_station,image_url,moderation_status,location_lat,location_lng&order=created_at.desc&limit=10"
      )
      setRecentPosts(posts)

      // Flagged content
      const flags = await sbSelect<any>("posts",
        "select=id,store_name,rating,created_at,source,moderation_status&order=created_at.desc&limit=5"
      ).then(d => d.filter((p: any) => p.moderation_status === "flagged"))
      setFlagged(flags)

      // Top users by FLUSH balance
      const users = await sbSelect<any>("profiles",
        "select=username,flush_balance,created_at&order=flush_balance.desc&limit=8"
      )
      setTopUsers(users)

      setLastUpdated(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [load])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚽</span>
            <div>
              <p className="text-sm font-bold text-white">Toilet Book Admin</p>
              <p className="text-xs text-slate-500">Live dashboard · Auto-refreshes every 60s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-slate-500 hidden sm:block">
                {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </div>
            <button onClick={load} disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">

        {/* Flagged content alert */}
        {metrics.flaggedCount > 0 && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">{metrics.flaggedCount} flagged post{metrics.flaggedCount > 1 ? "s" : ""} need review</p>
              <p className="text-xs text-slate-400">Scroll down to see flagged content</p>
            </div>
          </div>
        )}

        {/* Core metrics */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Platform overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<Toilet className="h-3.5 w-3.5" />}   label="Total toilets"    value={fmt(metrics.totalToilets)}  sub="in database"       color="text-sky-400" />
            <MetricCard icon={<Star className="h-3.5 w-3.5" />}     label="Total reviews"    value={fmt(metrics.totalReviews)}  sub="all time"          color="text-amber-400" />
            <MetricCard icon={<Users className="h-3.5 w-3.5" />}    label="Registered users" value={fmt(metrics.totalUsers)}   sub="signed up"         color="text-violet-400" />
            <MetricCard icon={<MapPin className="h-3.5 w-3.5" />}   label="Reviewed pins"    value={fmt(metrics.reviewedPins)} sub="on map"            color="text-emerald-400" />
          </div>
        </div>

        {/* Activity metrics */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Activity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard icon={<Clock className="h-3.5 w-3.5" />}       label="Reviews today"       value={fmt(metrics.todayReviews)} sub="last 24 hours"    color="text-sky-400" />
            <MetricCard icon={<TrendingUp className="h-3.5 w-3.5" />}  label="Reviews this week"   value={fmt(metrics.weekReviews)}  sub="last 7 days"      color="text-emerald-400" />
            <MetricCard icon={<Zap className="h-3.5 w-3.5" />}         label="Flip phone posts"    value={fmt(flipPosts)}            sub="from RC2200L"     color="text-yellow-400" />
            <MetricCard icon={<Flag className="h-3.5 w-3.5" />}        label="Flagged content"     value={metrics.flaggedCount ?? 0} sub="needs review"     color="text-red-400" />
          </div>
        </div>

        {/* Accessibility */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Accessibility data</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MetricCard icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Adult stations reported" value={fmt(metrics.adultStations)} color="text-blue-400" />
            <MetricCard icon={<Globe className="h-3.5 w-3.5" />}        label="Countries covered"        value="50+"                        color="text-teal-400" />
            <MetricCard icon={<Eye className="h-3.5 w-3.5" />}          label="Unrated locations"        value={metrics.totalToilets && metrics.reviewedPins ? fmt(metrics.totalToilets - metrics.reviewedPins) : "—"} sub="opportunity" color="text-orange-400" />
          </div>
        </div>

        {/* Recent posts */}
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
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">Photo</th>
                  <th className="text-center text-xs font-medium text-slate-500 px-2 py-2.5">GPS</th>
                  <th className="text-right text-xs font-medium text-slate-500 px-5 py-2.5">Time</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td colSpan={6} className="px-5 py-3">
                        <div className="h-3 animate-pulse bg-slate-800 rounded w-3/4" />
                      </td>
                    </tr>
                  ))
                ) : recentPosts.map((p, i) => (
                  <tr key={p.id || i} className={`border-b border-slate-800/50 last:border-0 ${p.moderation_status === "flagged" ? "bg-red-950/20" : ""}`}>
                    <td className="px-5 py-3">
                      <p className="text-xs font-medium text-white truncate max-w-[140px]">{p.store_name || "Public Toilet"}</p>
                      {p.moderation_status === "flagged" && (
                        <span className="text-xs text-red-400">⚠ flagged</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className="text-amber-400 text-xs">{"★".repeat(p.rating)}{"☆".repeat(5-p.rating)}</span>
                    </td>
                    <td className="px-2 py-3 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${(p.source || "").includes("flip") ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700 text-slate-400"}`}>
                        {p.source || "web"}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center text-xs">
                      {p.image_url && !p.image_url.includes("android-chrome") ? (
                        <span className="text-emerald-400">📸</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-center text-xs">
                      {p.location_lat ? (
                        <span className="text-emerald-400">📍</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-400">{timeAgo(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagged content */}
        {flagged.length > 0 && (
          <div className="rounded-2xl bg-red-950/20 border border-red-800/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-red-800/40 flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-semibold text-red-300">Flagged content — needs review</h2>
            </div>
            <div className="p-4 space-y-2">
              {flagged.map((p, i) => (
                <div key={p.id || i} className="flex items-center justify-between rounded-lg bg-red-950/30 border border-red-800/30 px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-white">{p.store_name || "Public Toilet"}</p>
                    <p className="text-xs text-slate-400">{"★".repeat(p.rating)} · {p.source || "web"} · {timeAgo(p.created_at)}</p>
                  </div>
                  <a
                    href={`${SB_URL.replace('.supabase.co','')}/project/default/editor`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Review →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top users */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Top FLUSH earners</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-2.5">Username</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-2.5">Balance</th>
                <th className="text-right text-xs font-medium text-slate-500 px-5 py-2.5">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((u, i) => (
                <tr key={i} className="border-b border-slate-800/50 last:border-0">
                  <td className="px-5 py-3 text-xs text-white font-medium">{u.username || "—"}</td>
                  <td className="px-5 py-3 text-right text-xs text-amber-400 font-semibold">{fmt(u.flush_balance)} pts</td>
                  <td className="px-5 py-3 text-right text-xs text-sky-400">{fmt((u.flush_balance || 0) * 10)} FLUSH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Google Search Console note */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Google Search Console</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Search Console",  url: "https://search.google.com/search-console", note: "Clicks, impressions, indexing" },
              { label: "URL Inspection",  url: "https://search.google.com/search-console/inspect", note: "Request new page indexing" },
              { label: "Sitemap",         url: "https://search.google.com/search-console/sitemaps", note: "Submit toilet-book.com/sitemap.xml" },
              { label: "Coverage report", url: "https://search.google.com/search-console/index", note: "See indexed vs excluded pages" },
            ].map(({ label, url, note }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 hover:border-sky-500 transition-colors group">
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-sky-400 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500">{note}</p>
                </div>
                <span className="text-slate-500 group-hover:text-sky-400 transition-colors text-xs">→</span>
              </a>
            ))}
          </div>
        </div>

        {/* Social mentions note */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Toilet Book mentions — check these</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Reddit search",   url: "https://www.reddit.com/search/?q=toilet+book&sort=new", note: "r/solana, r/travel, r/disability" },
              { label: "X / Twitter",     url: "https://twitter.com/search?q=toiletbook&f=live",        note: "Live mentions + hashtags" },
              { label: "Google Alerts",   url: "https://alerts.google.com",                              note: "Set up 'Toilet Book' alert" },
              { label: "Solscan FLUSH",   url: "https://solscan.io",                                     note: "Verify token after launch" },
            ].map(({ label, url, note }) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 hover:border-violet-500 transition-colors group">
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-violet-400 transition-colors">{label}</p>
                  <p className="text-xs text-slate-500">{note}</p>
                </div>
                <span className="text-slate-500 group-hover:text-violet-400 transition-colors text-xs">→</span>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 pb-4">
          Toilet Book Admin · {new Date().getFullYear()} · Auto-refreshes every 60s
        </p>
      </div>
    </div>
  )
}

// ── Page export ──────────────────────────────────────────
export default function AdminStatsPage() {
  const [authed, setAuthed] = useState(false)

  // Check session storage so you don't have to re-enter password on refresh
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("tb_admin") === "1") {
      setAuthed(true)
    }
  }, [])

  const handleAuth = () => {
    sessionStorage.setItem("tb_admin", "1")
    setAuthed(true)
  }

  if (!authed) return <LoginGate onAuth={handleAuth} />
  return <ErrorBoundary><Dashboard /></ErrorBoundary>
}

class ErrorBoundary extends React.Component<{children: React.ReactNode},{error:string|null}> {
  constructor(props: any) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e: any) { return { error: e?.message || "Unknown error" } }
  render() {
    if (this.state.error) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">🚽</div>
          <h2 className="text-white font-bold mb-2">Dashboard error</h2>
          <p className="text-slate-400 text-sm mb-4">{this.state.error}</p>
          <button onClick={() => this.setState({error:null})}
            className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm">Try again</button>
        </div>
      </div>
    )
    return this.props.children
  }
}
