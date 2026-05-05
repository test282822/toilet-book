"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

export function SignupForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !email || !password) return
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      toast.error("Username: 3–20 chars, lowercase letters, numbers, underscores only")
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: "" },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) { toast.error(error.message); setLoading(false); return }

    // Show FLUSH bonus notification
    toast.success("🚽 Account created! +50 FLUSH tokens added to your balance.", {
      duration: 5000,
      style: {
        background: "#0f172a",
        color: "#fff",
        border: "1px solid rgba(56,189,248,0.3)",
      },
    })
    router.push("/login")
  }

  const inputClass = `
    w-full rounded-xl border px-4 py-2.5 text-sm text-white placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all
    bg-slate-800/60 border-slate-700/60 hover:border-slate-600
  `

  return (
    <form onSubmit={handleSignup} className="space-y-4">

      {/* FLUSH bonus badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 mb-2"
        style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
        <span style={{ color: "#38bdf8", fontSize: 13 }}>⚡ Join now and earn</span>
        <span className="font-bold text-sm" style={{ color: "#38bdf8" }}>+50 FLUSH tokens free</span>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-sm font-medium text-slate-300">
          Username
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="username"
            type="text"
            placeholder="flush_master"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className={inputClass}
            style={{ paddingLeft: "2.25rem" }}
            required
            autoComplete="username"
          />
        </div>
        <p className="text-xs" style={{ color: "#64748b" }}>3–20 chars, lowercase, underscores ok</p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-slate-300">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            style={{ paddingLeft: "2.25rem" }}
            required
            autoComplete="email"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-sm font-medium text-slate-300">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem" }}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-60"
        style={{
          background: loading ? "#1e3a5f" : "linear-gradient(135deg, #0ea5e9, #6366f1)",
          boxShadow: loading ? "none" : "0 4px 20px rgba(14,165,233,0.3)",
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </span>
        ) : (
          "Create account & claim 50 FLUSH 🚽"
        )}
      </button>

      <p className="text-center text-xs" style={{ color: "#475569" }}>
        By joining you agree to our{" "}
        <span className="text-sky-500 cursor-pointer hover:text-sky-400">Terms</span>{" "}
        &{" "}
        <span className="text-sky-500 cursor-pointer hover:text-sky-400">Privacy Policy</span>
      </p>
    </form>
  )
}
