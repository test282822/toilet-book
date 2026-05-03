import { createClient } from "@/lib/supabase/server"
import type { FeedPost } from "@/types"

const PAGE_SIZE = 12

export async function getFeedPosts(
  page = 0,
  userId?: string,
): Promise<FeedPost[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        id, username, full_name, avatar_url
      )
    `,
    )
    .eq("moderation_status", "approved")
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (error) {
    console.error("getFeedPosts error:", error)
    return []
  }

  if (!userId || !data?.length) {
    return (data ?? []).map((p) => ({ ...p, user_has_liked: false })) as FeedPost[]
  }

  // Fetch which posts the current user has liked
  const postIds = data.map((p) => p.id)
  const { data: likes } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", postIds)

  const likedSet = new Set((likes ?? []).map((l) => l.post_id))

  return data.map((p) => ({
    ...p,
    user_has_liked: likedSet.has(p.id),
  })) as FeedPost[]
}
