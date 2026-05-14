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
    recentPosts:  recentPosts  ?? [],
    topUsers:     topUsers     ?? [],
    flaggedPosts: flaggedPosts ?? [],
  }
}

export default async function AdminPage() {
  const data = await getAdminStats()
  return <AdminDashboard data={data} />
}
