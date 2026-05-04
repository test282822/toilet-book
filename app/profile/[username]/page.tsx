import { notFound } from "next/navigation"
import Image from "next/image"
import { Metadata } from "next"
import { Toilet, LinkIcon, Calendar } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import { PostCard } from "@/components/feed/PostCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server"
import type { FeedPost } from "@/types"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  return { title: `@${username}` }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("username", username).single()
  if (!profile) notFound()

  let currentProfile = null
  if (currentUser) {
    const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single()
    currentProfile = data
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(id, username, full_name, avatar_url)")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })

  let feedPosts = (posts ?? []) as FeedPost[]
  if (currentUser && feedPosts.length) {
    const ids = feedPosts.map((p) => p.id)
    const { data: likes } = await supabase
      .from("likes").select("post_id").eq("user_id", currentUser.id).in("post_id", ids)
    const likedSet = new Set((likes ?? []).map((l) => l.post_id))
    feedPosts = feedPosts.map((p) => ({ ...p, user_has_liked: likedSet.has(p.id) }))
  }

  const joinDate = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <Navbar profile={currentProfile} />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {/* Profile header */}
        <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-slate-900 shadow-xl">
            <AvatarImage src={profile.avatar_url ?? ""} />
            <AvatarFallback className="text-2xl">
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">@{profile.username}</p>

            {profile.bio && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md">
                {profile.bio}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Toilet className="h-3.5 w-3.5" />
                {feedPosts.length} review{feedPosts.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined {joinDate}
              </span>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sky-500 hover:text-sky-600"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Posts grid */}
        {feedPosts.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Toilet className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm mt-1">
              {currentUser?.id === profile.id
                ? "Share your first toilet review!"
                : `${profile.username} hasn't reviewed any toilets yet.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {feedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUser?.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
