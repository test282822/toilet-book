"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2, Sparkles, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"
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
      <div className="relative overflow-hidden rounded-3xl border border-sky-200/60 dark:border-sky-800/40 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-16 px-6 text-center">
        {/* Blobs to match launch page energy */}
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-sky-200/40 dark:bg-sky-800/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-indigo-200/40 dark:bg-indigo-800/15 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm mx-auto mb-5 text-3xl">
            🚽
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Be the first review.{" "}
            <span className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Earn FLUZH.
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-7">
            No reviews yet — which means every bathroom on the map is up for grabs.
            Post the first one and earn <strong className="text-slate-700 dark:text-slate-200">+15 bonus FLUZH points</strong>.
          </p>

          {currentUserId ? (
            <button
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set("post", "true")
                window.history.pushState({}, "", url)
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Plus className="h-5 w-5" />
              Post the first review
            </button>
          ) : (
            <Link
              href="/signup?ref=empty-feed"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-sky-500/25 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-5 w-5" />
              Join Free — Earn FLUZH
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}

          <p className="text-xs text-slate-400 mt-5">
            47,000+ locations mapped worldwide. Zero rated yet. Yours could be first.
          </p>
        </div>
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

      <div ref={loaderRef} className="flex justify-center py-6">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more reviews...
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-slate-400">You&apos;ve seen all the reviews ✨</p>
        )}
      </div>
    </div>
  )
}
