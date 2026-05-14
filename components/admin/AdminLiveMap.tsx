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
  // Map to SVG viewBox 960x600 coords
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 960
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 600
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
          {/* Inline SVG US map — no external deps */}
          <svg
            viewBox="0 0 960 600"
            className="w-full block"
            style={{ opacity: 0.75 }}
            aria-hidden="true"
          >
            {/* Ocean */}
            <rect width="960" height="600" fill="#0d1b2a"/>
            {/* Land mass — continental US rough outline */}
            <path fill="#1e3a4a" stroke="#2d5a6e" strokeWidth="1.5" d="
              M180,80 L220,60 L290,55 L360,50 L430,48 L500,50 L560,52
              L620,50 L680,48 L740,52 L790,58 L830,65 L860,75 L880,90
              L890,110 L885,130 L870,150 L865,170 L875,190 L880,210
              L870,230 L855,245 L840,255 L830,270 L825,285
              L840,295 L850,310 L845,325 L830,335 L810,340
              L790,335 L775,320 L760,310 L740,320 L720,330
              L700,340 L685,355 L680,375 L690,395 L700,415
              L695,435 L680,450 L660,460 L640,455 L620,440
              L600,430 L575,435 L555,450 L540,465 L530,480
              L515,490 L495,488 L480,478 L465,465 L450,455
              L435,450 L415,448 L395,452 L375,460 L355,468
              L335,470 L315,465 L295,455 L280,442 L265,428
              L250,415 L238,400 L228,385 L218,368 L210,350
              L200,332 L192,315 L185,298 L178,280 L172,262
              L165,244 L158,225 L152,205 L148,185 L145,165
              L142,145 L140,125 L142,108 L150,92 L165,83 Z
            "/>
            {/* Florida peninsula */}
            <path fill="#1e3a4a" stroke="#2d5a6e" strokeWidth="1.5" d="
              M640,455 L650,470 L658,488 L662,508 L658,528
              L648,545 L635,555 L620,558 L607,550 L598,535
              L592,518 L590,500 L595,482 L604,468 L615,458 Z
            "/>
            {/* Great Lakes rough */}
            <ellipse cx="640" cy="165" rx="18" ry="12" fill="#0d1b2a" opacity="0.8"/>
            <ellipse cx="680" cy="145" rx="22" ry="10" fill="#0d1b2a" opacity="0.8"/>
            <ellipse cx="720" cy="155" rx="14" ry="8"  fill="#0d1b2a" opacity="0.8"/>
            <ellipse cx="750" cy="140" rx="12" ry="7"  fill="#0d1b2a" opacity="0.8"/>
            {/* State grid lines — approximate */}
            {[
              "M420,48 L410,340", "M530,50 L518,340", "M640,50 L628,340",
              "M750,52 L738,300", "M290,55 L282,340",
              "M142,180 L860,175", "M145,260 L855,252", "M148,335 L840,330",
            ].map((d,i) => (
              <path key={i} d={d} fill="none" stroke="#1d4060" strokeWidth="0.6" opacity="0.6"/>
            ))}
            {/* City dots */}
            {[
              {x:780,y:220,label:"NYC"},{x:280,y:290,label:"LA"},{x:620,y:190,label:"CHI"},
              {x:480,y:370,label:"HOU"},{x:720,y:410,label:"MIA"},{x:208,y:148,label:"SEA"},
              {x:670,y:320,label:"ATL"},{x:310,y:200,label:"DEN"},{x:800,y:200,label:"BOS"},
            ].map(({x,y,label}) => (
              <g key={label}>
                <circle cx={x} cy={y} r="3" fill="#334d5c"/>
                <text x={x+5} y={y+4} fontSize="9" fill="#4a6778" fontFamily="monospace">{label}</text>
              </g>
            ))}
          </svg>

          {/* SVG overlay for pins — sits on top of map SVG using absolute positioning */}
          <svg
            viewBox="0 0 960 600"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            {/* HQ dot — Cocoa FL */}
            <circle cx={hq.x} cy={hq.y} r="6" fill="#38bdf8" stroke="white" strokeWidth="1.5" opacity="0.9"/>
            <circle cx={hq.x} cy={hq.y} r="12" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.4">
              <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x={hq.x + 8} y={hq.y - 8} fontSize="9" fill="#38bdf8" fontFamily="monospace" fontWeight="600">HQ</text>

            {/* Activity pins */}
            {pins.map(pin => (
              <g
                key={pin.id}
                opacity={Math.max(0.15, 1 - pin.age / 100)}
                style={{ pointerEvents: "all", cursor: "pointer" }}
                onMouseEnter={e => handlePinEnter(pin, e)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Pulse ring */}
                <circle cx={pin.x} cy={pin.y} r="5" fill="none" stroke={pin.color} strokeWidth="1.5" opacity="0">
                  <animate attributeName="r" from="5" to="18" dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.7" to="0" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                {/* Pin dot */}
                <circle cx={pin.x} cy={pin.y} r="5" fill={pin.color} stroke="white" strokeWidth="1.5"/>
              </g>
            ))}
          </svg>

          {/* HTML tooltip — positioned absolutely */}
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
