"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Coins, Shield, Clock, CheckCircle2, AlertTriangle,
  ExternalLink, Copy, ChevronRight, Wallet, Users, Sparkles
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"

const LAUNCH_DATE  = new Date("2026-08-28T09:00:00-04:00") // 9am ET
const CUTOFF_DATE  = new Date("2026-08-21T23:59:59-04:00") // 7 days before
const TOKEN_SYMBOL = "FLUSH"
const TOTAL_SUPPLY = "1,000,000,000"
const CONVERSION   = 10 // 1 point = 10 tokens

// ── countdown hook ───────────────────────────────────────────────
function useCountdown(target: Date) {
  const [diff, setDiff] = useState(0)
  useEffect(() => {
    const tick = () => setDiff(Math.max(0, target.getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000)  / 60000)
  const seconds = Math.floor((diff % 60000)    / 1000)
  return { days, hours, minutes, seconds, launched: diff === 0 }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ── tokenomics data ──────────────────────────────────────────────
const TOKENOMICS = [
  { label: "Community rewards",   pct: 50, color: "#0ea5e9", note: "Distributed to app users at launch" },
  { label: "Platform reserve",    pct: 20, color: "#6366f1", note: "Future rewards & feature incentives" },
  { label: "Liquidity pool",      pct: 15, color: "#10b981", note: "Raydium DEX listing on launch day" },
  { label: "Team / development",  pct: 10, color: "#f59e0b", note: "12-month cliff, 24-month vest" },
  { label: "Marketing",           pct: 5,  color: "#ec4899", note: "Community growth & partnerships" },
]

const EARN_RATES = [
  { action: "Sign up",                    points: 50,  tokens: 500 },
  { action: "Post a review",              points: 10,  tokens: 100 },
  { action: "First review at a location", points: 15,  tokens: 150 },
  { action: "Report adult changing station", points: 25, tokens: 250 },
  { action: "Report family bathroom",     points: 15,  tokens: 150 },
  { action: "Report gender neutral",      points: 15,  tokens: 150 },
  { action: "Receive a like",             points: 2,   tokens: 20 },
  { action: "Refer a friend",             points: 50,  tokens: 500 },
]

export default function FlushTokenPage() {
  const { days, hours, minutes, seconds } = useCountdown(LAUNCH_DATE)
  const cutdown = useCountdown(CUTOFF_DATE)

  const [walletAddress, setWalletAddress] = useState("")
  const [submitting, setSubmitting]       = useState(false)
  const [registered, setRegistered]       = useState(false)
  const [flushBalance, setFlushBalance]   = useState<number | null>(null)
  const [userId, setUserId]               = useState<string | null>(null)

  // Load user's FLUSH balance
  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase
        .from("profiles")
        .select("flush_balance, sol_wallet_address")
        .eq("id", user.id)
        .single()
      if (profile) {
        setFlushBalance(profile.flush_balance ?? 0)
        if (profile.sol_wallet_address) {
          setWalletAddress(profile.sol_wallet_address)
          setRegistered(true)
        }
      }
    }
    load()
  }, [])

  const isValidSolanaAddress = (addr: string) =>
    /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim())

  const handleRegister = async () => {
    if (!userId) { toast.error("Sign in to register your wallet"); return }
    if (!isValidSolanaAddress(walletAddress)) { toast.error("That doesn't look like a valid Solana wallet address"); return }
    if ((flushBalance ?? 0) < 50) { toast.error("You need at least 50 FLUSH points to register. Sign up bonus is 50 points!"); return }
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ sol_wallet_address: walletAddress.trim() })
        .eq("id", userId)
      if (error) throw error
      setRegistered(true)
      toast.success("Wallet registered! You're on the whitelist 🚽")
    } catch {
      toast.error("Registration failed — please try again")
    } finally {
      setSubmitting(false)
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast.success("Copied!")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-semibold">
            <span className="text-xl">🚽</span>
            <span>Toilet Book</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1">
            <Coins className="h-3 w-3" />
            FLUSH Token Launch
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 space-y-16">

        {/* ── Hero ── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs text-violet-400 mb-6">
            <Sparkles className="h-3 w-3" />
            World&apos;s first community toilet rating token
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            FLUSH Token
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-2">
            Earn FLUSH points now by reviewing toilets. Convert them to real crypto on launch day.
          </p>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            1 Billion supply · Solana SPL · 1 point = 10 tokens · August 28, 2026
          </p>
        </div>

        {/* ── Countdown ── */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/20 p-8 text-center">
          <p className="text-sm text-slate-400 mb-6 uppercase tracking-wider">Token launch in</p>
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-6">
            <CountdownUnit value={days}    label="Days" />
            <span className="text-3xl font-bold text-slate-600 mb-4">:</span>
            <CountdownUnit value={hours}   label="Hours" />
            <span className="text-3xl font-bold text-slate-600 mb-4">:</span>
            <CountdownUnit value={minutes} label="Mins" />
            <span className="text-3xl font-bold text-slate-600 mb-4">:</span>
            <CountdownUnit value={seconds} label="Secs" />
          </div>
          <p className="text-xs text-slate-500">
            August 28, 2026 · 9:00 AM ET · Solana Mainnet
          </p>
          {!cutdown.launched && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2">
              <Clock className="h-3 w-3" />
              Whitelist closes in {cutdown.days}d {cutdown.hours}h — register before August 21
            </div>
          )}
        </div>

        {/* ── Whitelist registration ── */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500/10 to-violet-500/10 border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-5 w-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Whitelist Registration</h2>
                <p className="text-sm text-slate-400">Register your Solana wallet to receive your FLUSH tokens on launch day</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">

            {/* Balance display */}
            {flushBalance !== null && (
              <div className="flex items-center justify-between rounded-xl bg-slate-800 border border-slate-700 px-4 py-3">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Your current FLUSH balance</p>
                  <p className="text-2xl font-bold text-white">{flushBalance.toLocaleString()} <span className="text-sm text-slate-400 font-normal">points</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-0.5">Converts to</p>
                  <p className="text-xl font-bold text-sky-400">{(flushBalance * CONVERSION).toLocaleString()} <span className="text-sm font-normal">FLUSH</span></p>
                </div>
              </div>
            )}

            {registered ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-400 mb-1">You&apos;re on the whitelist!</p>
                    <p className="text-xs text-slate-400 mb-3">Your wallet is registered. You&apos;ll automatically receive your FLUSH tokens on August 28, 2026.</p>
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
                      <code className="text-xs text-slate-300 flex-1 truncate font-mono">{walletAddress}</code>
                      <button onClick={copyAddress} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : userId ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Solana wallet address
                    <span className="text-slate-500 font-normal ml-1">(from Phantom or Solflare)</span>
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={e => setWalletAddress(e.target.value)}
                    placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-1.5">
                    Don&apos;t have a wallet yet?{" "}
                    <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-0.5">
                      Get Phantom <ExternalLink className="h-3 w-3" />
                    </a>
                    {" "}— free, takes 2 minutes
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={submitting || !walletAddress}
                  className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {submitting ? "Registering..." : "Register wallet & join whitelist"}
                </button>
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-emerald-500" />
                  Your wallet address is stored securely. We never ask for your private key or seed phrase.
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-800 border border-slate-700 p-5 text-center">
                <p className="text-sm text-slate-400 mb-4">Sign in to register your wallet and join the whitelist</p>
                <div className="flex gap-3 justify-center">
                  <Link href="/login"  className="rounded-xl bg-slate-700 hover:bg-slate-600 px-5 py-2.5 text-sm font-medium text-white transition-colors">Sign in</Link>
                  <Link href="/signup" className="rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity">Join free</Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Earning rates ── */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">How to earn FLUSH</h2>
          <p className="text-sm text-slate-400 mb-5">Earn points now — they convert to tokens at launch. <strong className="text-white">1 point = 10 FLUSH tokens.</strong></p>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-400 px-5 py-3">Action</th>
                  <th className="text-right text-xs font-medium text-slate-400 px-3 py-3">Points</th>
                  <th className="text-right text-xs font-medium text-slate-400 px-5 py-3">FLUSH tokens</th>
                </tr>
              </thead>
              <tbody>
                {EARN_RATES.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800/60 last:border-0">
                    <td className="px-5 py-3 text-slate-300">{r.action}</td>
                    <td className="px-3 py-3 text-right text-amber-400 font-semibold">+{r.points}</td>
                    <td className="px-5 py-3 text-right text-sky-400 font-semibold">+{r.tokens.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Tokenomics ── */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Token distribution</h2>
          <p className="text-sm text-slate-400 mb-5">Total supply: {TOTAL_SUPPLY} FLUSH · Solana SPL · 6 decimals</p>
          <div className="space-y-3">
            {TOKENOMICS.map(({ label, pct, color, note }) => (
              <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-sm font-medium text-white">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
                </div>
                <p className="text-xs text-slate-500">{note} · {(pct * 10_000_000).toLocaleString()} FLUSH</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Timeline ── */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-5">Launch timeline</h2>
          <div className="space-y-0">
            {[
              { date: "Now",            label: "Earn FLUSH points",         desc: "Every review, report, and referral earns points that convert to tokens",       done: true },
              { date: "Aug 21, 2026",   label: "Whitelist closes",          desc: "Last day to register your Solana wallet address for launch day airdrop",       done: false },
              { date: "Aug 28, 2026",   label: "Token goes live on Solana", desc: "FLUSH SPL token deployed, points converted, airdrop distributed, Raydium listing",  done: false },
              { date: "Post-launch",    label: "Continue earning",          desc: "New reviews earn FLUSH tokens directly. Token tradeable on Raydium and Jupiter", done: false },
            ].map(({ date, label, desc, done }, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : "bg-slate-800 border border-slate-700"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-white" /> : <div className="h-2 w-2 rounded-full bg-slate-600" />}
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-slate-800 my-1" style={{ minHeight: 32 }} />}
                </div>
                <div className="pb-8">
                  <p className="text-xs text-sky-400 font-medium mb-0.5">{date}</p>
                  <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="rounded-xl bg-amber-500/8 border border-amber-500/20 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 leading-relaxed space-y-2">
              <p className="font-medium text-amber-400">Important disclaimer</p>
              <p>FLUSH tokens are utility tokens for use within the Toilet Book platform. They are not securities or investment instruments. FLUSH tokens have no guaranteed monetary value. Earning points or registering for the whitelist is not an investment and does not entitle you to any equity or profit share.</p>
              <p>The launch date, conversion ratio, and distribution method may be updated with reasonable notice. Do not spend money to acquire FLUSH tokens with an expectation of profit. Always keep your seed phrase safe — we cannot recover lost wallets.</p>
              <p>
                <Link href="/policies" className="text-sky-400 hover:text-sky-300 transition-colors">Full platform policies</Link>
                {" · "}
                <a href="mailto:toiletbookmain@gmail.com" className="text-sky-400 hover:text-sky-300 transition-colors">Contact us</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/"         className="hover:text-sky-400 transition-colors">Home</Link>
          <Link href="/map"      className="hover:text-sky-400 transition-colors">Map</Link>
          <Link href="/policies" className="hover:text-sky-400 transition-colors">Policies</Link>
          <Link href="/contact"  className="hover:text-sky-400 transition-colors">Contact</Link>
        </div>

      </div>
    </div>
  )
}
