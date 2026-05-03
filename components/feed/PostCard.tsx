"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ExternalLink, Clock, Tag, Flag } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/feed/StarRating"
import { createClient } from "@/lib/supabase/client"
import { formatRelativeTime, getStoreDomain, cn } from "@/lib/utils"
import type { FeedPost } from "@/types"
import toast from "react-hot-toast"

interface PostCardProps {
  post: FeedPost
  currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked] = useState(post.user_has_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [reported, setReported] = useState(false)
  const [isReporting, setIsReporting] = useState(false)

  const profile = post.profiles
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?"

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Sign in to like posts")
      return
    }
    if (isLiking) return
    setIsLiking(true)

    const supabase = createClient()
    if (liked) {
      setLiked(false)
      setLikesCount((c) => Math.max(0, c - 1))
      const { error } = await supabase.from("likes").delete().match({ post_id: post.id, user_id: currentUserId })
      if (error) { setLiked(true); setLikesCount((c) => c + 1) }
    } else {
      setLiked(true)
      setLikesCount((c) => c + 1)
      const { error } = await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId })
      if (error) { setLiked(false); setLikesCount((c) => Math.max(0, c - 1)) }
    }
    setIsLiking(false)
  }

  const handleReport = async () => {
    if (!currentUserId) {
      toast.error("Sign in to report posts")
      return
    }
    if (isReporting || reported) return
    setIsReporting(true)

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, reason: "user_flagged" }),
      })
      const json = await res.json() as { ok?: boolean; error?: string }

      if (res.status === 409) {
        toast("You already reported this post", { icon: "ℹ️" })
        setReported(true)
        return
      }
      if (!res.ok) {
        toast.error(json.error ?? "Report failed")
        return
      }

      setReported(true)
      toast.success("Thanks — our team will review this post.")
    } catch {
      toast.error("Could not send report")
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <article className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-all duration-300 hover:-translate-y-0.5">
      {/* ── Image ─────────────────��───────────────────────────── */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
        )}
        <Image
          src={post.image_url}
          alt={post.caption ?? "Bathroom photo"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-[1.03]",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Like button */}
        <button
          onClick={handleLike}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200",
            liked
              ? "bg-red-500 text-white shadow-md shadow-red-500/30"
              : "bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-slate-300",
          )}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart className={cn("h-3.5 w-3.5 transition-transform", liked && "fill-current scale-110")} />
          <span>{likesCount}</span>
        </button>

        {/* Rating badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-1 shadow-sm">
          <StarRating value={post.rating} readonly size="sm" />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="p-4 space-y-3">
        {/* Author row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/profile/${profile?.username}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={profile?.avatar_url ?? ""} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {profile?.username ?? "unknown"}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(post.created_at)}
            </div>
            {/* Report button — only show to other users, not the post owner */}
            {currentUserId && currentUserId !== post.user_id && (
              <button
                onClick={handleReport}
                disabled={isReporting || reported}
                className={cn(
                  "rounded-lg p-1 transition-colors",
                  reported
                    ? "text-amber-400 cursor-default"
                    : "text-slate-300 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
                title={reported ? "Reported" : "Report this post"}
                aria-label={reported ? "Already reported" : "Report post"}
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Caption */}
        {post.caption && (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
            {post.caption}
          </p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Store link */}
        {post.store_url && (
          <a
            href={post.store_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all duration-200 group/link"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-blue-600">
              <ExternalLink className="h-3 w-3 text-white" />
            </div>
            <span>{post.store_name ?? getStoreDomain(post.store_url)}</span>
            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    </article>
  )
}
