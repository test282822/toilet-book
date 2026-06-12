import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { BusinessDashboard } from "@/components/business/BusinessDashboard"

export const dynamic = "force-dynamic"

export default async function BusinessPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get claimed venues
  const { data: claims } = await supabase
    .from("venue_claims")
    .select("*")
    .eq("user_id", user.id)
    .order("claimed_at", { ascending: false })

  // Get reviews for their claimed venues
  const toiletIds = (claims ?? []).map(c => c.toilet_id).filter(Boolean)
  let venueReviews: any[] = []
  if (toiletIds.length > 0) {
    const { data: reviews } = await supabase
      .from("posts")
      .select("*, profiles(username, avatar_url)")
      .in("toilet_id", toiletIds)
      .order("created_at", { ascending: false })
      .limit(30)
    venueReviews = reviews ?? []
  }

  // Aggregate stats across all venues
  const totalReviews = venueReviews.length
  const avgRating = venueReviews.length
    ? (venueReviews.reduce((s, r) => s + (r.rating ?? 0), 0) / venueReviews.length).toFixed(1)
    : "—"
  const needsResponse = venueReviews.filter(r => !r.business_response && (r.rating ?? 5) <= 3).length

  const data = {
    profile,
    claims: claims ?? [],
    venueReviews,
    stats: {
      totalVenues:   (claims ?? []).length,
      verifiedVenues:(claims ?? []).filter(c => c.status === "verified").length,
      totalReviews,
      avgRating,
      needsResponse,
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={profile} />
      <BusinessDashboard data={data} userId={user.id} />
    </div>
  )
}
