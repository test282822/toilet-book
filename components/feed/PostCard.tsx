"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart, Clock, Flag,
  Accessibility, Users, ShieldCheck,
  Droplets, Wind, Lock, Baby, ParkingCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarRating } from "@/components/feed/StarRating"
import { createClient } from "@/lib/supabase/client"
import { formatRelativeTime, cn } from "@/lib/utils"
import type { FeedPost } from "@/types"
import toast from "react-hot-toast"

interface PostCardProps {
  post: FeedPost
  currentUserId?: string
}

// ── Rating label map ─────────────────────────────────────────────
const RATING_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Avoid",      color: "text-red-500" },
  2: { label: "Below avg",  color: "text-orange-500" },
  3: { label: "Decent",     color: "text-amber-500" },
  4: { label: "Pretty good",color: "text-emerald-500" },
  5: { label: "Spotless ✨",  color: "text-sky-500" },
}

// ── Facility badge config ─────────────────────────────────────────
function getFacilityBadges(post: FeedPost) {
  const badges = []

  if (post.has_adult_changing_station)
    badges.push({ icon: <Accessibility className="h-3 w-3" />, label: "Adult station", color: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" })
  if (post.has_family_bathroom)
    badges.push({ icon: <Users className="h-3 w-3" />, label: "Family room", color: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" })
  if (post.has_gender_neutral)
    badges.push({ icon: <ShieldCheck className="h-3 w-3" />, label: "Gender neutral", color: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" })
  if (post.is_family_friendly)
    badges.push({ icon: <Baby className="h-3 w-3" />, label: "Family friendly", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" })

  // derive extra signals from rating patterns / venue type
  if (post.rating >= 4)
    badges.push({ icon: <Droplets className="h-3 w-3" />, label: "Clean", color: "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300" })
  if (post.rating <= 2)
    badges.push({ icon: <Wind className="h-3 w-3" />, label: "Smelly", color: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" })
  if (post.store_name)
    badges.push({ icon: <Lock className="h-3 w-3" />, label: "Venue restroom", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" })
  if (post.address)
    badges.push({ icon: <ParkingCircle className="h-3 w-3" />, label: "Location tagged", color: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300" })

  return badges.slice(0, 5) // max 5 badges per card
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [liked, setLiked]         = useState(post.user_has_liked)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking]   = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [reported, setReported]   = useState(false)
  const [isReporting, setIsReporting] = useState(false)

  const profile  = post.profiles
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?"
  const ratingMeta = RATING_LABELS[post.rating] ?? RATING_LABELS[3]
  const badges   = getFacilityBadges(post)

  const handleLike = async () => {
    if (!currentUserId) { toast.error("Sign in to like posts"); return }
    if (isLiking) return
    setIsLiking(true)
    const supabase = createClient()
    if (liked) {
      setLiked(false); setLikesCount(c => Math.max(0, c - 1))
      await supabase.from("likes").delete().match({ post_id: post.id, user_id: currentUserId })
    } else {
      setLiked(true); setLikesCount(c => c + 1)
      await supabase.from("likes").insert({ post_id: post.id, user_id: currentUserId })
    }
    setIsLiking(false)
  }

  const handleReport = async () => {
    if (!currentUserId) { toast.error("Sign in to report posts"); return }
    if (isReporting || reported) return
    setIsReporting(true)
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, reason: "user_flagged" }),
      })
      const json = await res.json() as { ok?: boolean; error?: string }
      if (res.status === 409) { toast("Already reported", { icon: "ℹ️" }); setReported(true); return }
      if (!res.ok) { toast.error(json.error ?? "Report failed"); return }
      setReported(true)
      toast.success("Thanks — our team will review this.")
    } catch {
      toast.error("Could not send report")
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <article className="group rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-all duration-300 hover:-translate-y-0.5">

      {/* ── Photo ── */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700" />
        )}
        <Image
          src={post.image_url}
          alt={post.store_name ?? "Toilet photo"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn("object-cover transition-all duration-500 group-hover:scale-[1.03]", imgLoaded ? "opacity-100" : "opacity-0")}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Like button */}
        <button
          onClick={handleLike}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200",
            liked ? "bg-red-500 text-white shadow-md shadow-red-500/30" : "bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-slate-300"
          )}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <Heart className={cn("h-3.5 w-3.5 transition-transform", liked && "fill-current scale-110")} />
          <span>{likesCount}</span>
        </button>

        {/* Star rating pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-1 shadow-sm">
          <StarRating value={post.rating} readonly size="sm" />
          <span className={cn("text-xs font-semibold", ratingMeta.color)}>{ratingMeta.label}</span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-4 space-y-3">

        {/* User + time + report */}
        <div className="flex items-center justify-between">
          <Link href={`/profile/${profile?.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="h-7 w-7">
              <AvatarImage src={profile?.avatar_url ?? ""} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {profile?.username ?? "anonymous"}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(post.created_at)}
            </div>
            {currentUserId && currentUserId !== post.user_id && (
              <button
                onClick={handleReport}
                disabled={isReporting || reported}
                className={cn("rounded-lg p-1 transition-colors", reported ? "text-amber-400 cursor-default" : "text-slate-300 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800")}
                title={reported ? "Reported" : "Report"}
              >
                <Flag className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Venue name / location */}
        {(post.store_name || post.address) && (
          <div className="space-y-0.5">
            {post.store_name && (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{post.store_name}</p>
            )}
            {post.address && (
              <p className="text-xs text-slate-400 truncate">{post.address}</p>
            )}
          </div>
        )}

        {/* ── Facility badges — replace open caption ── */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {badges.map(({ icon, label, color }) => (
              <span key={label} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", color)}>
                {icon}
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Google Maps link if available */}
        {post.google_maps_url && (
          <a
            href={post.google_maps_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-blue-600">
              <span className="text-white text-xs">📍</span>
            </div>
            <span>View on Google Maps</span>
          </a>
        )}

      </div>
    </article>
  )
}
