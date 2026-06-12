"use client"
import { useState } from "react"
import {
  Building2, CheckCircle2, XCircle, Crown,
  UserPlus, Clock, Store
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const d = Math.floor(diff / 86400000)
  if (d < 1) return "today"
  if (d < 7) return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

export function AdminBusinessPanel({ pendingClaims, businessAccounts }: {
  pendingClaims:    any[]
  businessAccounts: any[]
}) {
  const [email, setEmail]       = useState("")
  const [plan, setPlan]         = useState("verified")
  const [bizName, setBizName]   = useState("")
  const [loading, setLoading]   = useState(false)
  const [claims, setClaims]     = useState(pendingClaims)
  const [accounts, setAccounts] = useState(businessAccounts)

  // ── Grant business plan by email ──
  const grantPlan = async () => {
    if (!email.trim()) { toast.error("Enter an email"); return }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("admin_set_business_plan", {
        target_email: email.trim(),
        new_plan:     plan,
        biz_name:     bizName.trim() || null,
      })
      if (error) throw error
      if (typeof data === "string" && data.startsWith("ERROR")) {
        toast.error(data)
      } else {
        toast.success(data || "Plan updated!")
        if (plan !== "none") {
          setAccounts([{ user_email: email, business_name: bizName, business_plan: plan, business_since: new Date().toISOString() }, ...accounts])
        }
        setEmail(""); setBizName("")
      }
    } catch (e: any) {
      toast.error(e.message || "Failed — check the migration ran")
    } finally {
      setLoading(false)
    }
  }

  // ── Approve / reject claim ──
  const reviewClaim = async (claimId: string, status: "verified" | "rejected") => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc("admin_review_claim", {
        claim_id:   claimId,
        new_status: status,
      })
      if (error) throw error
      if (typeof data === "string" && data.startsWith("ERROR")) {
        toast.error(data)
      } else {
        toast.success(`Claim ${status}`)
        setClaims(claims.filter(c => c.id !== claimId))
      }
    } catch (e: any) {
      toast.error(e.message || "Failed")
    }
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-indigo-500/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2 bg-indigo-500/5">
        <Building2 className="h-4 w-4 text-indigo-400" />
        <h2 className="text-sm font-semibold text-white">Business account management</h2>
        <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full px-2 py-0.5 ml-auto">
          Admin only
        </span>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Grant a plan ── */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" /> Grant business plan
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@email.com"
              className="sm:col-span-2 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={bizName}
              onChange={e => setBizName(e.target.value)}
              placeholder="Business name (optional)"
              className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={plan}
              onChange={e => setPlan(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="verified">Verified ($9)</option>
              <option value="spotlight">Spotlight ($29)</option>
              <option value="none">Remove plan</option>
            </select>
          </div>
          <button
            onClick={grantPlan}
            disabled={loading}
            className="mt-2 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold px-5 py-2 hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            {plan === "none" ? "Remove business plan" : "Grant plan"}
          </button>
        </div>

        {/* ── Pending claims ── */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Pending venue claims ({claims.length})
          </p>
          {claims.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No pending claims</p>
          ) : (
            <div className="space-y-2">
              {claims.map(c => (
                <div key={c.id} className="flex items-center gap-3 rounded-xl bg-slate-950 border border-slate-800 px-4 py-3">
                  <Store className="h-4 w-4 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.venue_name}</p>
                    <p className="text-xs text-slate-500">
                      @{c.username} · {c.user_email} · {c.plan} · {timeAgo(c.claimed_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => reviewClaim(c.id, "verified")}
                    className="flex items-center gap-1 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 hover:bg-emerald-500/25 transition-colors"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </button>
                  <button
                    onClick={() => reviewClaim(c.id, "rejected")}
                    className="flex items-center gap-1 text-xs bg-red-500/15 text-red-400 border border-red-500/30 rounded-lg px-2.5 py-1.5 hover:bg-red-500/25 transition-colors"
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Active business accounts ── */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5" /> Active business accounts ({accounts.length})
          </p>
          {accounts.length === 0 ? (
            <p className="text-xs text-slate-500 py-2">No business accounts yet — grant one above</p>
          ) : (
            <div className="space-y-1">
              {accounts.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-slate-950/60 px-4 py-2.5 border border-slate-800/60">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {a.business_name || a.username || a.user_email}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{a.user_email}</p>
                  </div>
                  <span className={`text-xs rounded-full px-2 py-0.5 flex-shrink-0 ${
                    a.business_plan === "spotlight"
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-sky-500/20 text-sky-400"
                  }`}>
                    {a.business_plan === "spotlight" ? "👑 Spotlight" : "✓ Verified"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
