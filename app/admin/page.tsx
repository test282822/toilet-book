import { createClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export const dynamic = "force-dynamic"

// ── Pull all stats server-side — same method as homepage ──────────
async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalToilets },
    { count: unratedToilets },
    { count: totalReviews },
    { count: totalUsers },
    { count: adultStations },
    { count: familyBathrooms },
    { count: genderNeutral },
    { count: reviewedPins },
    { count: todayReviews },
    { count: weekReviews },
    { count: flipPosts },
    { count: withPhotos },
    { count: whitelistCount },
  ] = await Promise.all([
    supabase.from("toilets").select("*",  { count: "exact", head: true }),
    supabase.from("toilets").select("*",  { count: "exact", head: true }).eq("review_count", 0),
    supabase.from("posts").select("*",    { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*",    { count: "exact", head: true }).eq("has_adult_changing_station", true),
    supabase.from("posts").select("*",    { count: "exact", head: true }).eq("has_family_bathroom", true),
    supabase.from("posts").select("*",    { count: "exact", head: true }).eq("has_gender_neutral", true),
    supabase.from("toilets").select("*",  { count: "exact", head: true }).gt("review_count", 0),
    supabase.from("posts").select("*",    { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
    supabase.from("posts").select("*",    { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 604800000).toISOString()),
    supabase.from("posts").select("*",    { count: "exact", head: true }).ilike("source", "flip%"),
    supabase.from("posts").select("*",    { count: "exact", head: true }).not("image_url", "ilike", "%android-chrome%"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).not("sol_wallet_address", "is", null),
  ])

  // Recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select("id, rating, store_name, source, created_at, has_adult_changing_station, image_url, moderation_status, location_lat, location_lng")
    .order("created_at", { ascending: false })
    .limit(10)

  // Live activity — last 100 posts with GPS for map pins
  const { data: liveActivity } = await supabase
    .from("posts")
    .select("id, rating, store_name, created_at, location_lat, location_lng, source, country")
    .not("location_lat", "is", null)
    .not("location_lng", "is", null)
    .order("created_at", { ascending: false })
    .limit(100)

  // Recent signups for activity feed
  const { data: recentSignups } = await supabase
    .from("profiles")
    .select("id, username, created_at")
    .order("created_at", { ascending: false })
    .limit(20)

  // Top users by flush balance
  const { data: topUsers } = await supabase
    .from("profiles")
    .select("username, flush_balance, created_at")
    .order("flush_balance", { ascending: false })
    .limit(8)

  // Flagged posts
  const { data: flaggedPosts } = await supabase
    .from("posts")
    .select("id, store_name, rating, created_at, source")
    .eq("moderation_status", "flagged")
    .order("created_at", { ascending: false })
    .limit(20)

  // Merge activity into timeline events
  const activityFeed = [
    ...(recentSignups ?? []).map((u: any) => ({
      type: "signup", username: u.username, created_at: u.created_at,
      lat: null, lng: null, country: null
    })),
    ...(recentPosts ?? []).map((p: any) => ({
      type: "post", username: null, store_name: p.store_name,
      rating: p.rating, created_at: p.created_at,
      lat: p.location_lat, lng: p.location_lng,
      country: p.country, source: p.source
    })),
  ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 30)

  return {
    metrics: {
      totalToilets:    totalToilets    ?? 0,
      unratedToilets:  unratedToilets  ?? 0,
      totalReviews:    totalReviews    ?? 0,
      totalUsers:      totalUsers      ?? 0,
      adultStations:   adultStations   ?? 0,
      familyBathrooms: familyBathrooms ?? 0,
      genderNeutral:   genderNeutral   ?? 0,
      reviewedPins:    reviewedPins    ?? 0,
      todayReviews:    todayReviews    ?? 0,
      weekReviews:     weekReviews     ?? 0,
      flipPosts:       flipPosts       ?? 0,
      withPhotos:      withPhotos      ?? 0,
      whitelistCount:  whitelistCount  ?? 0,
      flaggedCount:    flaggedPosts?.length ?? 0,
    },
    recentPosts:   recentPosts   ?? [],
    topUsers:      topUsers      ?? [],
    flaggedPosts:  flaggedPosts  ?? [],
    liveActivity:  liveActivity  ?? [],
    activityFeed:  activityFeed,
    recentSignups: recentSignups ?? [],
  }
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if logged-in account is an admin
  let isAdminAccount = false
  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle()
    isAdminAccount = me?.is_admin === true
  }

  const data = await getAdminStats()

  // Business management data — only fetched for admin accounts
  let pendingClaims: any[] = []
  let businessAccounts: any[] = []
  if (isAdminAccount) {
    const [{ data: claims }, { data: accounts }] = await Promise.all([
      supabase.rpc("admin_get_pending_claims"),
      supabase.rpc("admin_get_business_accounts"),
    ])
    pendingClaims    = claims   ?? []
    businessAccounts = accounts ?? []
  }

  return (
    <AdminDashboard
      data={{ ...data, pendingClaims, businessAccounts }}
      isAdminAccount={isAdminAccount}
    />
  )
}
