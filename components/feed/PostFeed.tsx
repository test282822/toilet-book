"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2, Wind } from "lucide-react"
import { PostCard } from "@/components/feed/PostCard"
import { createClient } from "@/lib/supabase/client"
import type { FeedPost } from "@/types"

const PAGE_SIZE = 12

interface PostFeedProps {
  initialPosts: FeedPost[]
  currentUserId?: string
}

export function PostFeed({ initialPosts, currentUserId }: PostFeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialPosts.length === PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const supabase = createClient()
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(id, username, full_name, avatar_url)")
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) throw error
      if (!data || data.length < PAGE_SIZE) setHasMore(false)

      if (data?.length) {
        let enriched = data as FeedPost[]
        if (currentUserId) {
          const ids = data.map((p) => p.id)
          const { data: likes } = await supabase
            .from("likes")
            .select("post_id")
            .eq("user_id", currentUserId)
            .in("post_id", ids)
          const likedSet = new Set((likes ?? []).map((l) => l.post_id))
          enriched = data.map((p) => ({ ...p, user_has_liked: likedSet.has(p.id) })) as FeedPost[]
        }
        setPosts((prev) => [...prev, ...enriched])
        setPage((p) => p + 1)
      }
    } catch (err) {
      console.error("loadMore error:", err)
    } finally {
      setLoading(false)
    }
  }, [loading, hasMore, page, currentUserId])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore() },
      { threshold: 0.1, rootMargin: "200px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30 mb-4">
          <Wind className="h-10 w-10 text-sky-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          No vibes yet
        </h2>
        <p className="text-slate-400 max-w-xs">
          Be the first to share your bathroom inspiration and get the community going!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={currentUserId} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="flex justify-center py-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more vibes...
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-slate-400">You&apos;ve seen all the vibes ✨</p>
        )}
      </div>
    </div>
  )
}
