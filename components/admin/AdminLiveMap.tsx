"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Globe, Star, UserPlus, Activity, Zap } from "lucide-react"

const SB_URL = "https://dltanpkvuxomubasfepm.supabase.co"
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsdGFucGt2dXhvbXViYXNmZXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzA0MDIsImV4cCI6MjA2MjI0NjQwMn0.OvKfrUk6NwOekM1XJ9MP7A_768VkjMu0tDhV7W5tKbc"
const HDR = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }

// US map bounds
const LAT_MIN = 24.5, LAT_MAX = 49.4
const LNG_MIN = -124.8, LNG_MAX = -66.9

function isUS(lat: number, lng: number) {
  return lat >= LAT_MIN && lat <= LAT_MAX && lng >= LNG_MIN && lng <= LNG_MAX
}

function toPct(lat: number, lng: number) {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100
  return { x, y }
}

function ratingColor(r?: number) {
  if (!r) return "#a78bfa"
  if (r >= 4) return "#10b981"
  if (r >= 3) return "#f59e0b"
  return "#ef4444"
}

function regionOf(lat: number, lng: number): string {
  if (lng < -103) return "west"
  if (lng < -90 && lat > 38) return "mw"
  if (lat < 35) return lat > 28 && lng > -97 ? "se" : "south"
  if (lng > -82) return "ne"
  return "south"
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

interface Pin {
  id: string
  x: number
  y: number
  color: string
  age: number
  name: string
  rating?: number
  source?: string
  createdAt: string
}

interface FeedItem {
  type: "post" | "signup"
  name?: string
  rating?: number
  source?: string
  createdAt: string
  lat?: number
  lng?: number
  isIntl?: boolean
}

export function AdminLiveMap() {
  const [pins, setPins]               = useState<Pin[]>([])
  const [usFeed, setUsFeed]           = useState<FeedItem[]>([])
  const [intlFeed, setIntlFeed]       = useState<FeedItem[]>([])
  const [regions, setRegions]         = useState({ west: 0, mw: 0, south: 0, se: 0, ne: 0 })
  const [hovered, setHovered]         = useState<Pin | null>(null)
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 })
  const [showIntl, setShowIntl]       = useState(false)
  const [totalPins, setTotalPins]     = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/posts?select=id,rating,store_name,source,created_at,location_lat,location_lng&order=created_at.desc&limit=100`,
        { headers: HDR }
      )
      if (!res.ok) return
      const data: any[] = await res.json()

      const newPins: Pin[] = []
      const newRegions = { west: 0, mw: 0, south: 0, se: 0, ne: 0 }
      const usItems: FeedItem[] = []
      const intlItems: FeedItem[] = []

      data.forEach((p, i) => {
        const hasGPS = p.location_lat && p.location_lng
        if (hasGPS && isUS(p.location_lat, p.location_lng)) {
          const { x, y } = toPct(p.location_lat, p.location_lng)
          newPins.push({
            id:        p.id,
            x, y,
            color:     ratingColor(p.rating),
            age:       Math.min(80, i * 1.2),
            name:      p.store_name || "Public toilet",
            rating:    p.rating,
            source:    p.source,
            createdAt: p.created_at,
          })
          const reg = regionOf(p.location_lat, p.location_lng) as keyof typeof newRegions
          newRegions[reg]++
          usItems.push({ type: "post", name: p.store_name, rating: p.rating, source: p.source, createdAt: p.created_at })
        } else if (hasGPS && !isUS(p.location_lat, p.location_lng)) {
          intlItems.push({ type: "post", name: p.store_name, rating: p.rating, source: p.source, createdAt: p.created_at, lat: p.location_lat, lng: p.location_lng, isIntl: true })
        } else {
          usItems.push({ type: "post", name: p.store_name, rating: p.rating, source: p.source, createdAt: p.created_at })
        }
      })

      setPins(newPins)
      setRegions(newRegions)
      setTotalPins(newPins.length)
      setUsFeed(usItems.slice(0, 14))
      setIntlFeed(intlItems.slice(0, 10))
    } catch {}
  }, [])

  // Age pins every 5s
  useEffect(() => {
    const id = setInterval(() => {
      setPins(prev => prev
        .map(p => ({ ...p, age: p.age + 3 }))
        .filter(p => p.age < 100)
      )
    }, 5000)
    return () => clearInterval(id)
  }, [])

  // Reload data every 60s
  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 60000)
    return () => clearInterval(id)
  }, [loadData])

  const handlePinEnter = (pin: Pin, e: React.MouseEvent) => {
    if (!mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left + 10,
      y: e.clientY - rect.top - 40,
    })
    setHovered(pin)
  }

  // HQ coordinates — Cocoa FL
  const hq = toPct(28.39, -80.70)

  return (
    <div className="space-y-4">

      {/* Map card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Live US activity map</h2>
            <span className="flex items-center gap-1.5 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              {totalPins} active pins
            </span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {[
              { color: "#10b981", label: "Clean (4-5★)" },
              { color: "#f59e0b", label: "Decent (3★)" },
              { color: "#ef4444", label: "Avoid (1-2★)" },
              { color: "#a78bfa", label: "New signup" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Map area */}
        <div
          ref={mapRef}
          className="relative select-none"
          style={{ background: "#0d1b2a" }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* US map image — public domain from Wikimedia */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Blank_US_Map_%28states_only%29.svg/1280px-Blank_US_Map_%28states_only%29.svg.png"
            alt="Blank US map with state outlines"
            className="w-full block"
            style={{ opacity: 0.7, filter: "saturate(0.3) brightness(0.55)" }}
          />

          {/* Pins layer — absolutely positioned over image */}
          <div className="absolute inset-0">
            {/* HQ marker */}
            <div
              className="absolute"
              style={{ left: `${hq.x}%`, top: `${hq.y}%`, transform: "translate(-50%,-100%)" }}
            >
              <div className="h-3 w-3 rounded-full bg-sky-400 border-2 border-white mx-auto shadow-lg" />
              <div className="text-xs text-sky-400 text-center mt-0.5 font-semibold" style={{ fontSize: 9 }}>HQ</div>
            </div>

            {/* Activity pins */}
            {pins.map(pin => (
              <div
                key={pin.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: "translate(-50%,-50%)",
                  opacity: Math.max(0.15, 1 - pin.age / 100),
                  zIndex: Math.round(100 - pin.age),
                }}
                onMouseEnter={e => handlePinEnter(pin, e)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring */}
                <div
                  className="absolute rounded-full border pointer-events-none"
                  style={{
                    borderColor: pin.color,
                    top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    animation: "pinRing 2.5s ease-out infinite",
                    width: 10, height: 10,
                  }}
                />
                {/* Dot */}
                <div
                  className="rounded-full border-2 border-white relative z-10"
                  style={{ width: 10, height: 10, background: pin.color }}
                />
              </div>
            ))}

            {/* Tooltip */}
            {hovered && (
              <div
                className="absolute bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white pointer-events-none z-50 shadow-xl"
                style={{ left: tooltipPos.x, top: tooltipPos.y, maxWidth: 180 }}
              >
                <p className="font-semibold truncate">{hovered.name}</p>
                <p className="text-slate-400 mt-0.5">
                  {hovered.rating ? "★".repeat(hovered.rating) + " " + hovered.rating + "/5" : "No rating"}
                </p>
                <p className="text-slate-500 mt-0.5">{timeAgo(hovered.createdAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Region breakdown */}
        <div className="grid grid-cols-5 border-t border-slate-800">
          {[
            { key: "west",  label: "West" },
            { key: "mw",    label: "Midwest" },
            { key: "south", label: "South" },
            { key: "se",    label: "Southeast" },
            { key: "ne",    label: "Northeast" },
          ].map(({ key, label }) => (
            <div key={key} className="text-center py-3 border-r border-slate-800 last:border-r-0">
              <p className="text-xl font-semibold text-white">{regions[key as keyof typeof regions]}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for pin ring animation */}
      <style>{`
        @keyframes pinRing {
          0%   { width: 10px; height: 10px; opacity: 0.8; }
          100% { width: 30px; height: 30px; opacity: 0; }
        }
      `}</style>

      {/* Feeds row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* US activity feed */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-white">Recent US activity</h2>
          </div>
          <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
            {usFeed.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-slate-500">No recent activity</div>
            ) : usFeed.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.type === "signup" ? "bg-violet-500/20" : "bg-sky-500/20"
                }`}>
                  {item.type === "signup"
                    ? <UserPlus className="h-3.5 w-3.5 text-violet-400" />
                    : <Star className="h-3.5 w-3.5 text-amber-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {item.name || "Public toilet review"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.rating ? "★".repeat(item.rating) + " · " : ""}
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
                {item.source?.includes("flip") && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 rounded-full px-2 py-0.5 flex-shrink-0">flip</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* International feed */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">International activity</h2>
            </div>
            {intlFeed.length > 0 && (
              <button
                onClick={() => setShowIntl(!showIntl)}
                className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showIntl ? "Show less" : "Show all"}
              </button>
            )}
          </div>

          {intlFeed.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Globe className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No international activity yet</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                When users outside the US post reviews with GPS enabled, they appear here — great for ad targeting
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {(showIntl ? intlFeed : intlFeed.slice(0, 8)).map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{item.name || "Public toilet review"}</p>
                    <p className="text-xs text-slate-500">
                      {item.lat && item.lng ? `${item.lat.toFixed(1)}, ${item.lng.toFixed(1)} · ` : ""}
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  {item.rating && (
                    <span className="text-xs text-amber-400 flex-shrink-0">{"★".repeat(item.rating)}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ad targeting tip */}
      <div className="rounded-xl bg-violet-500/8 border border-violet-500/20 px-5 py-4 flex items-start gap-3">
        <Zap className="h-4 w-4 text-violet-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-violet-400 mb-1">Ad targeting insight</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Regions with many pins but low total reviews are your best ad targets — they have awareness but need engagement.
            Areas with zero pins are untapped markets. Use the region counts above to guide Reddit, TikTok, or paid ad spend by state.
          </p>
        </div>
      </div>

    </div>
  )
}
