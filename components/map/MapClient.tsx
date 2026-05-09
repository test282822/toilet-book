"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { MapPin, Filter, X, Loader2, ZoomIn } from "lucide-react"

interface Toilet {
  id: string
  name: string | null
  venue_type: string | null
  address: string | null
  city: string | null
  location_lat: number
  location_lng: number
  avg_overall: number
  review_count: number
  has_adult_changing_station: boolean
  has_family_bathroom: boolean
  has_gender_neutral: boolean
  fee: boolean
}

interface Filters {
  adultStation:   boolean
  familyBathroom: boolean
  genderNeutral:  boolean
  freeOnly:       boolean
  ratedOnly:      boolean
}

// Zoom level where pins start appearing (~200 mile radius view)
const MIN_ZOOM_FOR_PINS = 8
// Max pins to load per viewport fetch
const MAX_PINS_PER_VIEW = 500

function getPinColor(avg: number, count: number): string {
  if (count === 0) return '#64748b'
  if (avg >= 4)   return '#10b981'
  if (avg >= 3)   return '#f59e0b'
  return '#ef4444'
}

export default function MapPage() {
  const mapRef        = useRef<HTMLDivElement>(null)
  const leafletMap    = useRef<any>(null)
  const markersLayer  = useRef<any>(null)
  const fetchTimeout  = useRef<any>(null)
  const isFirstLoad   = useRef(true)

  const [loading, setLoading]         = useState(false)
  const [pinCount, setPinCount]       = useState(0)
  const [zoomLevel, setZoomLevel]     = useState(2)
  const [showFilters, setShowFilters] = useState(false)
  const [selected, setSelected]       = useState<Toilet | null>(null)
  const [filters, setFilters]         = useState<Filters>({
    adultStation:   false,
    familyBathroom: false,
    genderNeutral:  false,
    freeOnly:       false,
    ratedOnly:      false,
  })
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  // ── Fetch toilets for current viewport ────────────────────────
  const fetchViewport = useCallback(async (map: any, L: any) => {
    const zoom = map.getZoom()
    setZoomLevel(zoom)

    // Don't load pins when too zoomed out
    if (zoom < MIN_ZOOM_FOR_PINS) {
      if (markersLayer.current) markersLayer.current.clearLayers()
      setPinCount(0)
      return
    }

    const bounds = map.getBounds()
    const sw     = bounds.getSouthWest()
    const ne     = bounds.getNorthEast()

    setLoading(true)

    const supabase = createClient()
    const f = filtersRef.current

    let query = supabase
      .from('toilets')
      .select('id, name, venue_type, address, city, location_lat, location_lng, avg_overall, review_count, has_adult_changing_station, has_family_bathroom, has_gender_neutral, fee')
      .gte('location_lat', sw.lat)
      .lte('location_lat', ne.lat)
      .gte('location_lng', sw.lng)
      .lte('location_lng', ne.lng)
      .limit(MAX_PINS_PER_VIEW)

    if (f.adultStation)   query = query.eq('has_adult_changing_station', true)
    if (f.familyBathroom) query = query.eq('has_family_bathroom', true)
    if (f.genderNeutral)  query = query.eq('has_gender_neutral', true)
    if (f.freeOnly)       query = query.eq('fee', false)
    if (f.ratedOnly)      query = query.gt('review_count', 0)

    const { data: toilets, error } = await query

    setLoading(false)

    if (error || !toilets) return

    // Clear and redraw markers
    if (markersLayer.current) {
      markersLayer.current.clearLayers()
    } else {
      markersLayer.current = L.layerGroup().addTo(map)
    }

    setPinCount(toilets.length)

    toilets.forEach((toilet: Toilet) => {
      const color = getPinColor(toilet.avg_overall, toilet.review_count)

      const icon = L.divIcon({
        html: `<div style="
          width:24px;height:24px;
          background:${color};
          border:2px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,0.35);
          cursor:pointer;
          display:flex;align-items:center;justify-content:center;
        "><span style="transform:rotate(45deg);font-size:10px;line-height:1;">🚽</span></div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -28],
      })

      const marker = L.marker([toilet.location_lat, toilet.location_lng], { icon })
      marker.on('click', () => setSelected(toilet))
      markersLayer.current.addLayer(marker)
    })
  }, [])

  // ── Debounced viewport fetch (fires after map stops moving) ───
  const scheduleViewportFetch = useCallback((map: any, L: any) => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current)
    fetchTimeout.current = setTimeout(() => fetchViewport(map, L), 400)
  }, [fetchViewport])

  // ── Init map ──────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      leafletMap.current = map

      // Auto-center on user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            map.setView([pos.coords.latitude, pos.coords.longitude], 12)
            fetchViewport(map, L)
          },
          () => {} // silent fail — stay on world view
        )
      }

      // Fetch on move end and zoom end
      map.on('moveend',  () => scheduleViewportFetch(map, L))
      map.on('zoomend',  () => scheduleViewportFetch(map, L))

      // Update zoom display on zoom
      map.on('zoom', () => setZoomLevel(map.getZoom()))
    })

    return () => {
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current)
    }
  }, [fetchViewport, scheduleViewportFetch])

  // Re-fetch when filters change
  useEffect(() => {
    if (!leafletMap.current) return
    import('leaflet').then((L) => fetchViewport(leafletMap.current, L))
  }, [filters, fetchViewport])

  const toggleFilter = (key: keyof Filters) =>
    setFilters(prev => ({ ...prev, [key]: !prev[key] }))

  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const tooZoomedOut = zoomLevel < MIN_ZOOM_FOR_PINS

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />

      {/* ── Top bar ── */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 1000, flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ fontSize: 20 }}>🚽</span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>Toilet Book</span>
        </Link>

        <div style={{ flex: 1 }} />

        {/* Status indicator */}
        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
          {loading ? (
            <>
              <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite', color: '#38bdf8' }} />
              <span style={{ color: '#38bdf8' }}>Loading...</span>
            </>
          ) : tooZoomedOut ? (
            <>
              <ZoomIn style={{ width: 12, height: 12 }} />
              <span>Zoom in to see toilets</span>
            </>
          ) : (
            <span>{pinCount.toLocaleString()} toilets in view</span>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 8,
            background: activeFilterCount > 0 ? '#0ea5e9' : 'rgba(255,255,255,0.08)',
            border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer',
          }}
        >
          <Filter style={{ width: 14, height: 14 }} />
          {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div style={{ background: '#1e293b', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', zIndex: 999, flexShrink: 0 }}>
          {[
            { key: 'adultStation',   label: '♿ Adult Station' },
            { key: 'familyBathroom', label: '👨‍👩‍👧 Family Bathroom' },
            { key: 'genderNeutral',  label: '⚧ Gender Neutral' },
            { key: 'freeOnly',       label: '💰 Free Only' },
            { key: 'ratedOnly',      label: '⭐ Has Reviews' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key as keyof Filters)}
              style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
                background: filters[key as keyof Filters] ? '#0ea5e9' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${filters[key as keyof Filters] ? '#0ea5e9' : 'rgba(255,255,255,0.1)'}`,
                color: '#fff',
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setFilters({ adultStation: false, familyBathroom: false, genderNeutral: false, freeOnly: false, ratedOnly: false })}
            style={{ padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Map ── */}
      <div ref={mapRef} style={{ flex: 1, zIndex: 1 }} />

      {/* ── Zoom in prompt (shown when too zoomed out) ── */}
      {tooZoomedOut && !loading && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(15,23,42,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: '20px 28px',
          textAlign: 'center', zIndex: 1000,
          backdropFilter: 'blur(12px)',
          pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🚽</div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
            Zoom in to find toilets
          </div>
          <div style={{ color: '#64748b', fontSize: 12 }}>
            Pinch to zoom or use the + button
          </div>
        </div>
      )}

      {/* ── Selected toilet panel ── */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: 20, left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(380px, calc(100vw - 32px))',
          background: '#0f172a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: 16, zIndex: 1000,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                {selected.name || 'Public Toilet'}
              </div>
              {selected.city && <div style={{ fontSize: 12, color: '#64748b' }}>{selected.city}</div>}
              {selected.address && <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{selected.address}</div>}
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            {selected.review_count > 0 ? (
              <>
                <div style={{ fontSize: 24, fontWeight: 700, color: getPinColor(selected.avg_overall, selected.review_count) }}>
                  {selected.avg_overall.toFixed(1)}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ fontSize: 12, color: s <= Math.round(selected.avg_overall) ? '#fbbf24' : '#1e293b' }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    {selected.review_count} review{selected.review_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: '#475569' }}>No reviews yet — be the first! 🚽</div>
            )}
            {selected.fee && (
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 10 }}>
                💰 Paid
              </div>
            )}
          </div>

          {/* Facility badges */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
            {selected.has_adult_changing_station && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>♿ Adult station</span>
            )}
            {selected.has_family_bathroom && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>👨‍👩‍👧 Family bathroom</span>
            )}
            {selected.has_gender_neutral && (
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(129,140,248,0.15)', color: '#a5b4fc' }}>⚧ Gender neutral</span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={`https://www.google.com/maps?q=${selected.location_lat},${selected.location_lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, textAlign: 'center', padding: '8px 0',
                borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', textDecoration: 'none',
              }}
            >
              📍 Directions
            </a>
            <Link
              href="/signup"
              style={{
                flex: 1, textAlign: 'center', padding: '8px 0',
                borderRadius: 10, fontSize: 13, fontWeight: 500,
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#fff', textDecoration: 'none',
              }}
            >
              ⭐ Rate it
            </Link>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 20, right: 16, zIndex: 1000,
        background: 'rgba(15,23,42,0.92)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '10px 12px', fontSize: 11, color: '#94a3b8',
      }}>
        <div style={{ marginBottom: 5, fontWeight: 600, color: '#fff', fontSize: 12 }}>Pin colors</div>
        {[
          { color: '#10b981', label: 'Excellent (4+)' },
          { color: '#f59e0b', label: 'Decent (3–4)' },
          { color: '#ef4444', label: 'Avoid (<3)' },
          { color: '#64748b', label: 'Not yet rated' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .leaflet-container { background: #1e293b; }
      `}</style>
    </div>
  )
}
