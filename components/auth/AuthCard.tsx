"use client"
import Link from "next/link"
import { Toilet } from "lucide-react"

interface AuthCardProps {
  title: string
  subtitle: string
  footerText: string
  footerLink: string
  footerLinkText: string
  children: React.ReactNode
}

export function AuthCard({
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkText,
  children,
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0c1a2e 50%, #0f0a1e 100%)" }}>

      {/* Glow blobs */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg shadow-sky-500/30 group-hover:shadow-xl transition-all"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #6366f1)" }}>
              <Toilet className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Toilet Book
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border p-8 shadow-2xl"
          style={{
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(255,255,255,0.08)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}>

          {/* Card header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="mt-1.5 text-sm" style={{ color: "#94a3b8" }}>{subtitle}</p>
          </div>

          {children}

          {/* Footer link */}
          <p className="mt-6 text-center text-sm" style={{ color: "#64748b" }}>
            {footerText}{" "}
            <Link href={footerLink}
              className="font-semibold text-sky-400 hover:text-sky-300 transition-colors">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
