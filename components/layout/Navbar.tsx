"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Droplets, Plus, LogIn, LogOut, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { NewPostModal } from "@/components/feed/NewPostModal"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"
import toast from "react-hot-toast"
import { Plus, Menu, X, LogIn, LogOut, User, Zap } from "lucide-react"

interface NavbarProps {
  profile: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out. See you soon!")
    router.push("/login")
    router.refresh()
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?"

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/25 group-hover:shadow-lg group-hover:shadow-sky-500/35 transition-all duration-200">
              <Droplets className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
              Toilet Book
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/points" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-colors">
  <Zap className="h-4 w-4 text-amber-400" />
  FLUSH
</Link>
            <ThemeToggle />
            {profile ? (
              <>
                <Button
                  size="sm"
                  onClick={() => setPostModalOpen(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
                <div className="relative group">
                  <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block">
                      {profile.username}
                    </span>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                    <Link
                      href={`/profile/${profile.username}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Join free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-4 pt-3 space-y-2">
            {profile ? (
              <>
                <button
                  onClick={() => { setPostModalOpen(true); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus className="h-4 w-4" />
                  New Post
                </button>
                <Link
                  href={`/profile/${profile.username}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Join free
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {profile && (
        <NewPostModal
          open={postModalOpen}
          onOpenChange={setPostModalOpen}
          userId={profile.id}
        />
      )}
    </>
  )
}
