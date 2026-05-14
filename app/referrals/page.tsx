import { redirect } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/Navbar"
import { ReferralClient } from "@/components/referrals/ReferralClient"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Referrals — Toilet Book",
  description: "Share your Toilet Book referral link and earn 50 FLUSH tokens for every friend who joins.",
  robots: { index: false, follow: false },
}

export default async function ReferralsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")

  // Get list of people they referred
  const { data: referred } = await supabase
    .from("profiles")
    .select("username, created_at, flush_balance, reviewer_badge")
    .eq("referred_by", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  // Their rank on leaderboard
  const { count: rankAbove } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gt("flush_balance", profile.flush_balance ?? 0)

  const rank = (rankAbove ?? 0) + 1

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={profile} />
      <ReferralClient
        profile={profile}
        referred={referred ?? []}
        rank={rank}
        userId={user.id}
      />
    </div>
  )
}
