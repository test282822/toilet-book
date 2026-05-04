"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

interface HeroProps {
  stats: {
    totalPosts: number
    totalUsers: number
    totalAdultStations: number
  }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`
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
    badges: [
      { label: "🏆 Top rated", color: "rgba(129,140,248,0.2)", text: "#a5b4fc" },
    ],
  },
  {
    emoji: "🍕",
    bg: "rgba(249,115,22,0.12)",
    name: "Joe's Pizzeria",
    location: "Brooklyn, NY",
    stars: 3,
    badges: [
      { label: "👨‍👩‍👧 Family OK", color: "rgba(56,189,248,0.2)", text: "#38bdf8" },
    ],
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
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
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

export function HeroSection({ stats }: HeroProps) {
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
        const factors = [1.3, 0.7, 1.3]
        const f = factors[i] ?? 1
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

  // generate stars once
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
      {/* ── Ambient glow blobs ── */}
      <div style={{ position: "absolute", top: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -60, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "40%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Star field ── */}
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
        @keyframes tbTwinkle {
          0%,100%{opacity:0.15;transform:scale(1)}
          50%{opacity:0.9;transform:scale(1.4)}
        }
        @keyframes tbPulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:0.4;transform:scale(0.7)}
        }
        @keyframes tbFloat {
          0%,100%{transform:translateY(0px)}
          50%{transform:translateY(-8px)}
        }
        .tb-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 14px;
          width: 168px;
          transition: transform 0.25s ease, border-color 0.2s;
          cursor: pointer;
          flex-shrink: 0;
        }
        .tb-card:hover {
          border-color: rgba(56,189,248,0.45);
        }
        .tb-badge {
          display:inline-block;
          font-size:9px;
          padding:2px 7px;
          border-radius:6px;
          margin-right:3px;
          margin-top:4px;
          line-height:1.6;
        }
      `}</style>

      {/* ── Live badge ── */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#38bdf8", marginBottom: 20, position: "relative", zIndex: 2 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", animation: "tbPulse 2s infinite" }} />
        World&apos;s #1 toilet rating community
      </div>

      {/* ── Headline ── */}
      <h1 style={{ fontSize: "clamp(30px, 5vw, 52px)", fontWeight: 500, color: "#fff", textAlign: "center", lineHeight: 1.12, marginBottom: 16, position: "relative", zIndex: 2, maxWidth: 600 }}>
        Find the{" "}
        <span style={{ background: "linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          best toilet
        </span>{" "}
        near you
      </h1>

      {/* ── Subheading ── */}
      <p style={{ fontSize: 15, color: "#94a3b8", textAlign: "center", maxWidth: 440, lineHeight: 1.7, marginBottom: 32, position: "relative", zIndex: 2 }}>
        Real ratings. Real reviews. Discover clean, accessible bathrooms — including adult changing stations — everywhere you go.
      </p>

      {/* ── Live stats ── */}
      <div style={{ display: "flex", gap: 32, marginBottom: 40, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { emoji: "🚽", label: "Toilets rated", value: stats.totalPosts },
          { emoji: "👥", label: "Members", value: stats.totalUsers },
          { emoji: "♿", label: "Adult stations", value: stats.totalAdultStations },
        ].map(({ emoji, label, value }, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 500, color: "#fff", display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>{emoji}</span>
              <AnimatedCount target={value} />
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{label}</div>
          </div>
        ))}
        {/* dividers */}
      </div>

      {/* ── 3D Cards ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 36, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {SAMPLE_CARDS.map((card, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el }}
            className="tb-card"
            style={{
              transform: `perspective(700px) rotateX(${[5, 2, 5][i]}deg) rotateY(${[10, 0, -10][i]}deg)`,
            }}
          >
            {/* icon */}
            <div style={{ width: "100%", height: 64, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 10 }}>
              {card.emoji}
            </div>
            {/* name */}
            <div style={{ fontSize: 11, fontWeight: 500, color: "#e2e8f0", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {card.name}
            </div>
            {/* location */}
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>{card.location}</div>
            {/* stars */}
            <StarRow count={card.stars} />
            {/* badges */}
            <div>
              {card.badges.map((b, j) => (
                <span key={j} className="tb-badge" style={{ background: b.color, color: b.text }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTAs ── */}
      <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => router.push("/signup")}
          style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)", border: "none", borderRadius: 12, padding: "11px 26px", fontSize: 14, fontWeight: 500, color: "#fff", cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Start rating toilets 🚽
        </button>
        <button
          onClick={() => router.push("/login")}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "11px 26px", fontSize: 14, color: "#e2e8f0", cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
        >
          Sign in
        </button>
      </div>
    </section>
  )
}
