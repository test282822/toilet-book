"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface MobileHeroProps {
  isLoggedIn: boolean
  userId?: string
  stats: {
    totalPosts: number
    totalUsers: number
    totalAdultStations: number
  }
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function MobileHero({ isLoggedIn, userId, stats }: MobileHeroProps) {
  const router = useRouter()
  const heroRef = useRef<HTMLDivElement>(null)
  const toiletRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [flushed, setFlushed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const triggerHeight = window.innerHeight * 0.4
      const progress = Math.min(scrollY / triggerHeight, 1)
      setScrollProgress(progress)
      if (progress >= 1 && !flushed) setFlushed(true)
      if (progress < 0.1 && flushed) setFlushed(false)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [flushed])

  // Toilet spin + shrink + drop animation based on scroll
  const toiletScale = Math.max(0, 1 - scrollProgress * 1.1)
  const toiletRotate = scrollProgress * 720  // two full spins
  const toiletY = scrollProgress * 120       // drops down
  const toiletOpacity = Math.max(0, 1 - scrollProgress * 1.8)
  const heroOpacity = Math.max(0.2, 1 - scrollProgress * 0.8)
  const heroBlur = scrollProgress * 4

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          minHeight: "100svh",
          background: "linear-gradient(160deg, #020617 0%, #0c1a2e 40%, #0f0a1e 100%)",
          opacity: heroOpacity,
          filter: `blur(${heroBlur}px)`,
          transition: "filter 0.05s linear",
        }}
      >
        {/* Star field */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }, (_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: Math.random() * 2 + 0.5 + "px",
              height: Math.random() * 2 + 0.5 + "px",
              borderRadius: "50%",
              background: "#fff",
              left: (i * 1.7) % 100 + "%",
              top: (i * 1.3) % 100 + "%",
              animation: `tbTwinkle ${2 + (i % 4)}s ${(i % 5) * 0.8}s infinite ease-in-out`,
              opacity: 0.4,
            }} />
          ))}
        </div>

        {/* Glow blobs */}
        <div style={{ position: "absolute", top: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -40, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

        <style>{`
          @keyframes tbTwinkle { 0%,100%{opacity:.1;transform:scale(1)} 50%{opacity:.8;transform:scale(1.4)} }
          @keyframes tbPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
          @keyframes tbFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes tbScrollBounce { 0%,100%{transform:translateY(0);opacity:.6} 50%{transform:translateY(6px);opacity:1} }
        `}</style>

        {/* Top buttons — logged out only */}
        {!isLoggedIn && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: 10,
            padding: "52px 20px 16px",
            background: "linear-gradient(to bottom, rgba(2,6,23,0.8) 0%, transparent 100%)",
            zIndex: 10,
          }}>
            <Link href="/login" style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: "#e2e8f0",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
            }}>
              Sign in
            </Link>
            <Link href="/signup" style={{
              flex: 1,
              textAlign: "center",
              padding: "10px 0",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
              border: "none",
              textDecoration: "none",
              boxShadow: "0 4px 15px rgba(14,165,233,0.35)",
            }}>
              Create account
            </Link>
          </div>
        )}

        {/* Live badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          background: "rgba(56,189,248,0.1)",
          border: "1px solid rgba(56,189,248,0.25)",
          borderRadius: 20,
          padding: "4px 14px",
          fontSize: 12,
          color: "#38bdf8",
          marginBottom: 20,
          position: "relative",
          zIndex: 2,
          marginTop: isLoggedIn ? 0 : 60,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", animation: "tbPulse 2s infinite" }} />
          World's #1 toilet rating app
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 36,
          fontWeight: 500,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.15,
          marginBottom: 8,
          position: "relative",
          zIndex: 2,
          padding: "0 24px",
          letterSpacing: "-0.5px",
        }}>
          Find the{" "}
          <span style={{
            background: "linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            best toilet
          </span>
          <br />near you
        </h1>

        <p style={{ fontSize: 14, color: "#64748b", textAlign: "center", marginBottom: 32, padding: "0 32px", position: "relative", zIndex: 2, lineHeight: 1.6 }}>
          Real ratings. Real reviews. Adult changing stations mapped.
        </p>

        {/* ── BIG SPINNING TOILET ── */}
        <div
          ref={toiletRef}
          style={{
            fontSize: 100,
            lineHeight: 1,
            position: "relative",
            zIndex: 3,
            transform: `scale(${toiletScale}) rotate(${toiletRotate}deg) translateY(${toiletY}px)`,
            opacity: toiletOpacity,
            filter: flushed ? "blur(8px)" : "none",
            transition: "filter 0.2s",
            animation: scrollProgress < 0.05 ? "tbFloat 3s ease-in-out infinite" : "none",
            userSelect: "none",
          }}
        >
          🚽
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: 24,
          marginTop: 28,
          position: "relative",
          zIndex: 2,
          opacity: Math.max(0, 1 - scrollProgress * 3),
        }}>
          {[
            { emoji: "🚽", label: "Rated", value: stats.totalPosts },
            { emoji: "👥", label: "Members", value: stats.totalUsers },
            { emoji: "♿", label: "Stations", value: stats.totalAdultStations },
          ].map(({ emoji, label, value }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>
                {emoji} {formatCount(value)}
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: Math.max(0, 1 - scrollProgress * 5),
          zIndex: 2,
        }}>
          <span style={{ fontSize: 11, color: "#334155", letterSpacing: "0.1em" }}>SCROLL TO FLUSH</span>
          <div style={{ animation: "tbScrollBounce 1.5s ease-in-out infinite" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Logged-in: post button fixed at bottom */}
      {isLoggedIn && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }}>
          <Link href="/?post=true" style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 28px",
            borderRadius: 50,
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "#fff",
            fontWeight: 500,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 8px 30px rgba(14,165,233,0.45)",
          }}>
            <span style={{ fontSize: 18 }}>🚽</span>
            Rate a toilet
          </Link>
        </div>
      )}
    </>
  )
}
