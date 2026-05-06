"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { NewPostModal } from "@/components/feed/NewPostModal"

interface HeroProps {
  stats: {
    totalPosts: number
    totalUsers: number
    totalAdultStations: number
    totalFamilyBathrooms?: number
    totalGenderNeutral?: number
  }
  isLoggedIn: boolean
  userId?: string
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

const SAMPLE_CARDS = [
  {
    emoji: "✈️",
    bg: "rgba(14,165,233,0.12)",
    name: "Terminal B Restroom",
    location: "JFK Airport, NY",
    stars: 4,
    badges: [
      { label: "♿ Adult station", color: "rgba(16,185,129,0.2)", text: "#34d399" },
      { label: "👨‍👩‍👧 Family OK", color: "rgba(56,189,248,0.2)", text: "#38bdf8" },
    ],
  },
  {
    emoji: "🏨",
    bg: "rgba(99,102,241,0.12)",
    name: "The Grand Hotel",
    location: "Manhattan, NY",
    stars: 5,
    badges: [{ label: "🏆 Top rated", color: "rgba(129,140,248,0.2)", text: "#a5b4fc" }],
  },
  {
    emoji: "🍕",
    bg: "rgba(249,115,22,0.12)",
    name: "Joe's Pizzeria",
    location: "Brooklyn, NY",
    stars: 3,
    badges: [{ label: "👨‍👩‍👧 Family OK", color: "rgba(56,189,248,0.2)", text: "#38bdf8" }],
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          style={{
            width: 9,
            height: 9,
            background: s <= count ? "#fbbf24" : "#1e293b",
            clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          }}
        />
      ))}
    </div>
  )
}

function AnimatedCount({ target }: { target: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let cur = 0
    const step = Math.max(1, Math.ceil(target / 50))
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target)
      setVal(cur)
      if (cur >= target) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [target])
  return <span>{formatCount(val)}</span>
}

// ── Logged-IN hero ────────────────────────────────────────────────
function LoggedInHero({ userId }: { userId: string }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-sky-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-6 px-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              Welcome back 🚽
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              What toilet are you reviewing today?
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Post a Review
          </button>
        </div>
      </section>

      {/* Fixed floating pill button */}
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 50 }}>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 28px",
            borderRadius: 50,
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "#fff",
            fontWeight: 500,
            fontSize: 15,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(14,165,233,0.45)",
          }}
        >
          <span style={{ fontSize: 18 }}>🚽</span>
          Rate a toilet
        </button>
      </div>

      <NewPostModal open={modalOpen} onOpenChange={setModalOpen} userId={userId} />
    </>
  )
}

// ── Logged-OUT hero ───────────────────────────────────────────────
function LoggedOutHero({ stats }: { stats: HeroProps["stats"] }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      const dx = (e.clientX - rect.left) / rect.width - 0.5
      const dy = (e.clientY - rect.top) / rect.height - 0.5
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const f = [1.3, 0.7, 1.3][i] ?? 1
        card.style.transform = `perspective(700px) rotateX(${-dy * 10 * f}deg) rotateY(${dx * 14 * f}deg) translateY(-6px)`
      })
    }
    const handleLeave = () => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        const rx = [5, 2, 5][i] ?? 3
        const ry = [10, 0, -10][i] ?? 0
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`
      })
    }
    hero.addEventListener("mousemove", handleMove)
    hero.addEventListener("mouseleave", handleLeave)
    return () => {
      hero.removeEventListener("mousemove", handleMove)
      hero.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    size: Math.random() * 2.5 + 0.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
  }))

  return (
    <section
      ref={heroRef}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #020617 0%, #0c1a2e 45%, #0f0a1e 100%)",
        minHeight: 560,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px 48px",
      }}
    >
      {/* Glow blobs */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, right: -40, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Star field */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {stars.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#fff",
              left: `${s.left}%`,
              top: `${s.top}%`,
              animation: `tbTwinkle ${s.duration}s ${s.delay}s infinite ease-in-out`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes tbTwinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.9;transform:scale(1.4)} }
        @keyframes tbPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        .tb-card { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.09); border-radius:16px; padding:14px; width:168px; transition:transform .25s ease,border-color .2s; cursor:pointer; flex-shrink:0; }
        .tb-card:hover { border-color:rgba(56,189,248,.45); }
        .tb-badge { display:inline-block; font-size:9px; padding:2px 7px; border-radius:6px; margin-right:3px; margin-top:4px; line-height:1.6; }
        .tb-btn-primary { background:linear-gradient(135deg,#0ea5e9,#6366f1); border:none; border-radius:12px; padding:11px 26px; font-size:14px; font-weight:500; color:#fff; cursor:pointer; }
        .tb-btn-primary:hover { opacity:.88; }
        .tb-btn-outline { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:11px 26px; font-size:14px; color:#e2e8f0; cursor:pointer; }
        .tb-btn-outline:hover { background:rgba(255,255,255,.1); }
      `}</style>

      {/* Live badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#38bdf8", marginBottom: 20, position: "relative", zIndex: 2 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "tbPulse 2s infinite" }} />
        World&apos;s #1 toilet rating community
      </div>

      {/* Headline */}
      <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.12, marginBottom: 16, position: "relative", zIndex: 2, maxWidth: 600 }}>
        Find the{" "}
        <span style={{ background: "linear-gradient(90deg,#38bdf8,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          best toilet
        </span>{" "}
        near you
      </h1>

      {/* Subheading */}
      <p style={{ fontSize: 15, color: "#94a3b8", textAlign: "center", maxWidth: 440, lineHeight: 1.7, marginBottom: 32, position: "relative", zIndex: 2 }}>
        Real ratings. Real reviews. Discover clean, accessible bathrooms — including adult changing stations, family bathrooms and gender neutral restrooms everywhere you go.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 28, marginBottom: 40, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { emoji: "🚽", label: "Toilets rated",    value: stats.totalPosts },
          { emoji: "👥", label: "Members",           value: stats.totalUsers },
          { emoji: "♿", label: "Adult stations",    value: stats.totalAdultStations },
          { emoji: "👨‍👩‍👧", label: "Family bathrooms", value: stats.totalFamilyBathrooms ?? 0 },
          { emoji: "⚧",  label: "Gender neutral",   value: stats.totalGenderNeutral ?? 0 },
        ].map(({ emoji, label, value }, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
              <span style={{ fontSize: 15 }}>{emoji}</span>
              <AnimatedCount target={value} />
            </div>
            <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* 3D Cards */}
      <div style={{ display: "flex", gap: 14, marginBottom: 36, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {SAMPLE_CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el }}
            className="tb-card"
            style={{ transform: `perspective(700px) rotateX(${[5,2,5][i]}deg) rotateY(${[10,0,-10][i]}deg)` }}
          >
            <div style={{ width: "100%", height: 64, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 10 }}>
              {card.emoji}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#e2e8f0", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{card.name}</div>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>{card.location}</div>
            <StarRow count={card.stars} />
            <div>
              {card.badges.map((b, j) => (
                <span key={j} className="tb-badge" style={{ background: b.color, color: b.text }}>{b.label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="tb-btn-primary" onClick={() => router.push("/signup")}>
          Start rating toilets 🚽
        </button>
        <button className="tb-btn-outline" onClick={() => router.push("/login")}>
          Sign in
        </button>
      </div>
    </section>
  )
}

// ── Main export ───────────────────────────────────────────────────
export function MobileHero({ stats, isLoggedIn, userId }: HeroProps) {
  if (isLoggedIn && userId) return <LoggedInHero userId={userId} />
  return <LoggedOutHero stats={stats} />
}
