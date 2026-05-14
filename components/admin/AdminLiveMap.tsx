"use client"
import { useState, useEffect, useRef } from "react"
import { MapPin, Users, Globe, Star, UserPlus } from "lucide-react"

// ── Helpers ──────────────────────────────────────────────────────
function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// ── Convert lat/lng to SVG x/y for continental US ────────────────
// US bounds: lat 24.5–49.4, lng -124.8 to -66.9
function latLngToSvg(lat: number, lng: number, W: number, H: number) {
  const minLat = 24.5, maxLat = 49.4
  const minLng = -124.8, maxLng = -66.9
  const x = ((lng - minLng) / (maxLng - minLng)) * W
  const y = ((maxLat - lat) / (maxLat - minLat)) * H
  return { x, y }
}

function isUSA(lat: number, lng: number): boolean {
  return lat >= 24.5 && lat <= 49.4 && lng >= -124.8 && lng <= -66.9
}

// ── Animated pin ─────────────────────────────────────────────────
function LivePin({ x, y, age, rating, type }: {
  x: number; y: number; age: number; rating?: number; type: "post" | "signup"
}) {
  const color = type === "signup"
    ? "#a78bfa"
    : rating && rating >= 4 ? "#10b981"
    : rating && rating >= 3 ? "#f59e0b"
    : "#ef4444"

  const opacity = Math.max(0.2, 1 - age / 100)

  return (
    <g transform={`translate(${x},${y})`} style={{ opacity }}>
      {/* Pulse ring */}
      <circle r="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4">
        <animate attributeName="r" from="4" to="16" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Pin dot */}
      <circle r="4" fill={color} stroke="white" strokeWidth="1" />
    </g>
  )
}

// ── US State outlines (simplified paths) ─────────────────────────
// Simplified state borders as SVG paths on a 960x600 viewBox
const US_STATES = [
  // These are approximate outlines for visual reference
  { name: "WA", d: "M90,45 L120,45 L125,80 L90,82 Z" },
  { name: "OR", d: "M90,82 L125,80 L122,118 L88,118 Z" },
  { name: "CA", d: "M88,118 L122,118 L118,200 L82,196 Z" },
  { name: "NV", d: "M122,118 L148,115 L145,185 L118,200 Z" },
  { name: "ID", d: "M122,80 L155,78 L155,118 L148,115 L122,118 Z" },
  { name: "MT", d: "M150,45 L230,45 L232,82 L152,82 Z" },
  { name: "WY", d: "M155,82 L220,82 L220,118 L155,118 Z" },
  { name: "UT", d: "M148,115 L182,115 L182,155 L145,155 Z" },
  { name: "AZ", d: "M145,155 L182,155 L180,200 L142,200 Z" },
  { name: "CO", d: "M182,115 L230,115 L230,152 L182,152 Z" },
  { name: "NM", d: "M182,152 L225,152 L225,195 L180,195 Z" },
  { name: "ND", d: "M230,45 L295,45 L295,78 L230,78 Z" },
  { name: "SD", d: "M230,78 L295,78 L295,112 L230,112 Z" },
  { name: "NE", d: "M230,112 L295,112 L296,140 L230,140 Z" },
  { name: "KS", d: "M230,140 L295,140 L295,162 L230,162 Z" },
  { name: "OK", d: "M230,162 L295,162 L295,185 L225,185 Z" },
  { name: "TX", d: "M225,185 L295,185 L295,240 L260,258 L225,220 Z" },
  { name: "MN", d: "M295,45 L345,45 L345,95 L295,95 Z" },
  { name: "IA", d: "M295,95 L348,95 L348,125 L295,125 Z" },
  { name: "MO", d: "M295,125 L348,125 L350,162 L295,162 Z" },
  { name: "AR", d: "M295,162 L348,162 L348,192 L295,192 Z" },
  { name: "LA", d: "M295,192 L345,192 L345,225 L295,228 Z" },
  { name: "MS", d: "M345,168 L375,168 L375,220 L345,220 Z" },
  { name: "AL", d: "M375,168 L405,168 L405,222 L375,222 Z" },
  { name: "TN", d: "M350,148 L415,148 L415,168 L350,162 Z" },
  { name: "KY", d: "M348,128 L415,128 L415,148 L348,148 Z" },
  { name: "WI", d: "M345,60 L385,58 L388,95 L345,95 Z" },
  { name: "IL", d: "M348,95 L388,95 L388,140 L348,140 Z" },
  { name: "IN", d: "M388,95 L415,95 L415,135 L388,135 Z" },
  { name: "MI", d: "M385,55 L425,52 L428,82 L388,85 Z" },
  { name: "OH", d: "M415,92 L452,90 L452,132 L415,132 Z" },
  { name: "WV", d: "M452,110 L480,108 L482,140 L452,140 Z" },
  { name: "VA", d: "M452,90 L500,88 L502,115 L452,115 Z" },
  { name: "NC", d: "M452,115 L520,112 L520,132 L452,132 Z" },
  { name: "SC", d: "M490,132 L525,128 L528,158 L490,158 Z" },
  { name: "GA", d: "M452,132 L492,132 L490,175 L452,175 Z" },
  { name: "FL", d: "M452,175 L492,175 L505,215 L478,240 L455,220 Z" },
  { name: "PA", d: "M452,82 L508,80 L508,110 L452,110 Z" },
  { name: "NY", d: "M508,55 L560,52 L560,88 L508,88 Z" },
  { name: "ME", d: "M580,38 L605,35 L608,62 L582,65 Z" },
  { name: "NH", d: "M570,55 L582,52 L582,78 L570,78 Z" },
  { name: "VT", d: "M558,52 L570,50 L570,78 L558,78 Z" },
  { name: "MA", d: "M560,72 L598,68 L598,82 L560,82 Z" },
  { name: "RI", d: "M598,72 L610,70 L610,82 L598,82 Z" },
  { name: "CT", d: "M575,82 L598,80 L598,95 L575,95 Z" },
  { name: "NJ", d: "M548,88 L565,86 L565,108 L548,108 Z" },
  { name: "DE", d: "M540,105 L552,103 L552,118 L540,118 Z" },
  { name: "MD", d: "M520,105 L552,103 L552,115 L520,115 Z" },
  { name: "DC", d: "M535,112 L540,110 L540,115 L535,115 Z" },
]

// ── City reference dots ───────────────────────────────────────────
const CITIES = [
  { name: "NYC",     lat: 40.71, lng: -74.01 },
  { name: "LA",      lat: 34.05, lng: -118.24 },
  { name: "Chicago", lat: 41.88, lng: -87.63 },
  { name: "Houston", lat: 29.76, lng: -95.37 },
  { name: "Miami",   lat: 25.77, lng: -80.19 },
  { name: "Seattle", lat: 47.61, lng: -122.33 },
  { name: "Orlando", lat: 28.54, lng: -81.38 },
  { name: "Denver",  lat: 39.74, lng: -104.98 },
  { name: "Atlanta", lat: 33.75, lng: -84.39 },
  { name: "Boston",  lat: 42.36, lng: -71.06 },
]

interface ActivityItem {
  type: "post" | "signup"
  username?: string
  store_name?: string
  rating?: number
  created_at: string
  lat?: number
  lng?: number
  country?: string
  source?: string
}

interface LivePin {
  id: string
  x: number
  y: number
  age: number
  rating?: number
  type: "post" | "signup"
  label: string
}

export function AdminLiveMap({ liveActivity, activityFeed, recentSignups }: {
  liveActivity: any[]
  activityFeed: ActivityItem[]
  recentSignups: any[]
}) {
  const W = 640
  const H = 400
  const [pins, setPins]           = useState<LivePin[]>([])
  const [hoveredPin, setHovered]  = useState<LivePin | null>(null)
  const [showIntl, setShowIntl]   = useState(false)
  const ageTimer = useRef<NodeJS.Timeout | null>(null)

  // Build initial pins from liveActivity
  useEffect(() => {
    if (!liveActivity?.length) return
    const initial: LivePin[] = liveActivity
      .filter(a => a.location_lat && a.location_lng && isUSA(a.location_lat, a.location_lng))
      .slice(0, 60)
      .map((a, i) => {
        const { x, y } = latLngToSvg(a.location_lat, a.location_lng, W, H)
        const age = Math.min(90, i * 1.5) // older = more faded
        return {
          id:     a.id,
          x, y, age,
          rating: a.rating,
          type:   "post" as const,
          label:  a.store_name || "Public Toilet",
        }
      })
    setPins(initial)
  }, [liveActivity])

  // Age pins over time — slowly fade oldest
  useEffect(() => {
    ageTimer.current = setInterval(() => {
      setPins(prev => prev
        .map(p => ({ ...p, age: p.age + 0.5 }))
        .filter(p => p.age < 100)
      )
    }, 3000)
    return () => { if (ageTimer.current) clearInterval(ageTimer.current) }
  }, [])

  // Separate US vs international activity
  const usActivity   = activityFeed.filter(a => !a.lat || !a.lng || isUSA(a.lat ?? 0, a.lng ?? 0))
  const intlActivity = activityFeed.filter(a => a.lat && a.lng && !isUSA(a.lat, a.lng))

  // Count pins by rough US region
  const regions = {
    "Northeast": pins.filter(p => p.x > 520 && p.y < 160).length,
    "Southeast": pins.filter(p => p.x > 420 && p.y >= 140).length,
    "Midwest":   pins.filter(p => p.x > 280 && p.x <= 420 && p.y < 180).length,
    "South":     pins.filter(p => p.x > 220 && p.x <= 380 && p.y >= 160).length,
    "West":      pins.filter(p => p.x <= 220).length,
  }

  return (
    <div className="space-y-4">

      {/* Map card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Live US Activity Map</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {pins.length} active pins
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Clean (4-5★)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />Decent (3★)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400 inline-block" />Avoid (1-2★)</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-400 inline-block" />Signup</span>
          </div>
        </div>

        {/* SVG map */}
        <div className="relative bg-slate-950 px-2 py-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ maxHeight: 420 }}
          >
            {/* Ocean background */}
            <rect width={W} height={H} fill="#0f172a" />

            {/* State fills */}
            {US_STATES.map(state => (
              <path
                key={state.name}
                d={state.d}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth="0.8"
              />
            ))}

            {/* City dots */}
            {CITIES.map(city => {
              const { x, y } = latLngToSvg(city.lat, city.lng, W, H)
              return (
                <g key={city.name}>
                  <circle cx={x} cy={y} r="2" fill="#475569" />
                  <text x={x + 3} y={y + 3} fontSize="7" fill="#64748b">{city.name}</text>
                </g>
              )
            })}

            {/* Florida highlight — our home base */}
            {(() => {
              const { x, y } = latLngToSvg(28.0, -81.5, W, H)
              return (
                <g>
                  <circle cx={x} cy={y} r="8" fill="#0ea5e9" opacity="0.15" />
                  <circle cx={x} cy={y} r="3" fill="#0ea5e9" opacity="0.6" />
                  <text x={x + 5} y={y - 4} fontSize="7" fill="#38bdf8">HQ</text>
                </g>
              )
            })()}

            {/* Live activity pins */}
            {pins.map(pin => (
              <g
                key={pin.id}
                onMouseEnter={() => setHovered(pin)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              >
                <LivePin
                  x={pin.x} y={pin.y}
                  age={pin.age}
                  rating={pin.rating}
                  type={pin.type}
                />
              </g>
            ))}

            {/* Hover tooltip */}
            {hoveredPin && (
              <g transform={`translate(${Math.min(hoveredPin.x + 8, W - 120)},${Math.max(hoveredPin.y - 28, 5)})`}>
                <rect x="0" y="0" width="115" height="28" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
                <text x="6" y="11" fontSize="8" fill="#94a3b8">{hoveredPin.label.substring(0, 18)}</text>
                <text x="6" y="22" fontSize="8" fill="#f59e0b">
                  {"★".repeat(hoveredPin.rating || 0)}{"☆".repeat(5 - (hoveredPin.rating || 0))}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Region breakdown */}
        <div className="px-5 py-3 border-t border-slate-800 grid grid-cols-5 gap-2">
          {Object.entries(regions).map(([region, count]) => (
            <div key={region} className="text-center">
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-xs text-slate-500">{region}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live activity feed + international split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent US activity */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Recent US activity</h2>
          </div>
          <div className="divide-y divide-slate-800/60">
            {usActivity.slice(0, 12).length === 0 ? (
              <div className="px-5 py-6 text-center text-xs text-slate-500">No recent US activity</div>
            ) : usActivity.slice(0, 12).map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  a.type === "signup" ? "bg-violet-500/20" : "bg-sky-500/20"
                }`}>
                  {a.type === "signup"
                    ? <UserPlus className="h-3.5 w-3.5 text-violet-400" />
                    : <Star className="h-3.5 w-3.5 text-amber-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {a.type === "signup"
                      ? `@${a.username || "user"} signed up`
                      : a.store_name || "Public Toilet review"
                    }
                  </p>
                  <p className="text-xs text-slate-500">
                    {a.type === "post" && a.rating && "★".repeat(a.rating) + " · "}
                    {a.lat && a.lng ? `${a.lat?.toFixed(2)}, ${a.lng?.toFixed(2)} · ` : ""}
                    {timeAgo(a.created_at)}
                  </p>
                </div>
                {a.source?.includes("flip") && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded-full flex-shrink-0">flip</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* International activity */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">International activity</h2>
            </div>
            <button
              onClick={() => setShowIntl(!showIntl)}
              className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              {showIntl ? "Show less" : "Show all"}
            </button>
          </div>

          {intlActivity.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Globe className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No international activity yet</p>
              <p className="text-xs text-slate-600 mt-1">When users outside the US post reviews with GPS, they appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {(showIntl ? intlActivity : intlActivity.slice(0, 10)).map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {a.store_name || "Public Toilet review"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {a.country || `${a.lat?.toFixed(1)}, ${a.lng?.toFixed(1)}`} · {timeAgo(a.created_at)}
                    </p>
                  </div>
                  {a.rating && (
                    <span className="text-xs text-amber-400 flex-shrink-0">{"★".repeat(a.rating)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Country summary */}
          {intlActivity.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/40">
              <p className="text-xs text-slate-500 mb-2">Top international areas</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  intlActivity.reduce((acc: any, a) => {
                    const key = a.country || "Unknown"
                    acc[key] = (acc[key] || 0) + 1
                    return acc
                  }, {})
                )
                .sort(([,a]: any, [,b]: any) => b - a)
                .slice(0, 6)
                .map(([country, count]) => (
                  <span key={country} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">
                    {country} ({count as number})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ad targeting note */}
      <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 px-5 py-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-violet-400 mb-1">Ad targeting insight</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Regions with pins but low review counts are your best ad targets — they show awareness but need engagement.
              Areas with zero pins are untapped markets. Use the region counts above to prioritise your Reddit, TikTok,
              or Facebook ad spend by state or metro area.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
