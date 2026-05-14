"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Toilet, Plus, LogIn, LogOut, User, Menu, X, MapPin, ShoppingBag, Zap, ChevronDown, Star, Accessibility, Plane, Navigation, Building2, Sparkles, Mail, Users, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { NewPostModal } from "@/components/feed/NewPostModal"
import { createClient } from "@/lib/supabase/client"
import type { Profile } from "@/types"
import toast from "react-hot-toast"

interface NavbarProps { profile: Profile | null }

import { Suspense } from "react"

function NavbarInner({ profile }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const searchParams = useSearchParams()

  // Auto-open post modal when ?post=true in URL
  useEffect(() => {
    if (searchParams.get("post") === "true" && profile) {
      setPostModalOpen(true)
      // Clean the URL without reload
      const url = new URL(window.location.href)
      url.searchParams.delete("post")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams, profile])
  const [showBestBy, setShowBestBy] = useState(false)
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? "?"

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Signed out. See you soon! 🚽")
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/25 group-hover:shadow-lg transition-all duration-200">
              <Toilet className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent dark:from-sky-400 dark:to-blue-400">
              Toilet Book
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden sm:flex items-center gap-1">

            {/* Map link */}
            <Link
              href="/map"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-sky-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800/50 transition-all"
            >
              <MapPin className="h-4 w-4" />
              Map
            </Link>

            {/* Leaderboard */}
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-sky-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800/50 transition-all"
            >
              <span className="text-base">🏆</span>
              Leaderboard
            </Link>

            {/* Best by dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowBestBy(!showBestBy)}
                onBlur={() => setTimeout(() => setShowBestBy(false), 150)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-sky-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800/50 transition-all"
              >
                <Star className="h-4 w-4" />
                Best by
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${showBestBy ? "rotate-180" : ""}`} />
              </button>
              {showBestBy && (
                <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Guides & Top Lists</p>
                  </div>
                  <div className="py-1">
                    {[
                      { href: "/find-public-bathrooms-near-me",    icon: <Navigation className="h-4 w-4 text-sky-500" />,         label: "Find bathrooms near me",         sub: "Free · No signup needed" },
                      { href: "/best-toilets-in-florida",          icon: <MapPin className="h-4 w-4 text-emerald-500" />,         label: "Best in Florida",                sub: "1,700+ rated locations" },
                      { href: "/best-airport-bathrooms",           icon: <Plane className="h-4 w-4 text-indigo-500" />,           label: "Best airport bathrooms",         sub: "Worldwide rankings" },
                      { href: "/most-accessible-public-bathrooms", icon: <Accessibility className="h-4 w-4 text-blue-500" />,     label: "Most accessible bathrooms",      sub: "Adult stations, family rooms" },
                      { href: "/adult-changing-stations-near-me",  icon: <Accessibility className="h-4 w-4 text-violet-500" />,   label: "Adult changing stations",        sub: "Near me · Earn +25 FLUSH" },
                    ].map(({ href, icon, label, sub }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setShowBestBy(false)}
                      >
                        <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                          {icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
                          <p className="text-xs text-slate-400">{sub}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 px-3 py-2 space-y-1">
                    <Link
                      href="/spotlight"
                      className="flex items-center gap-2 text-xs text-violet-500 hover:text-violet-400 transition-colors"
                      onClick={() => setShowBestBy(false)}
                    >
                      <Sparkles className="h-3 w-3" />
                      Get your venue featured → Spotlight
                    </Link>
                    <Link
                      href="/referrals"
                      className="flex items-center gap-2 text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
                      onClick={() => setShowBestBy(false)}
                    >
                      <Gift className="h-3 w-3" />
                      Refer friends → earn FLUSH
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shop link */}
            <Link
              href="/shop"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-sky-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800/50 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            <ThemeToggle />

            {profile ? (
              <>
                {/* Post button */}
                <Button size="sm" onClick={() => setPostModalOpen(true)} className="gap-1.5 ml-1">
                  <Plus className="h-4 w-4" />
                  Rate a Toilet
                </Button>

                {/* Profile dropdown */}
                <div className="relative group ml-1">
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
                  <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">

                    {/* Profile link */}
                    <Link
                      href={profile.username ? `/profile/${profile.username}` : `/profile/${profile.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>

                    {/* Referrals */}
                    <Link
                      href="/referrals"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Users className="h-4 w-4 text-emerald-500" />
                      Referrals
                    </Link>

                    {/* Email digest */}
                    <Link
                      href="/email-digest"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Mail className="h-4 w-4 text-sky-500" />
                      Email digest
                    </Link>

                    {/* FLUSH tokens */}
                    <Link
                      href="/points"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>FLUSH Tokens</span>
                      {profile.flush_balance != null && profile.flush_balance > 0 && (
                        <span className="ml-auto text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full">
                          {(profile.flush_balance ?? 0).toLocaleString()}
                        </span>
                      )}
                    </Link>

                    {/* Map */}
                    <Link
                      href="/map"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <MapPin className="h-4 w-4 text-sky-500" />
                      Toilet Map
                    </Link>

                    {/* Shop */}
                    <Link
                      href="/shop"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <ShoppingBag className="h-4 w-4 text-sky-500" />
                      Merch Shop
                    </Link>

                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />

                    {/* Sign out */}
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
                <Button variant="outline" size="sm" asChild className="ml-1">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Join free 🚽</Link>
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
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

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-4 pt-3 space-y-1">
            {profile ? (
              <>
                {/* Rate button */}
                <button
                  onClick={() => { setPostModalOpen(true); setMenuOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white"
                >
                  <Plus className="h-4 w-4" />
                  Rate a Toilet
                </button>

                {/* Profile */}
                <Link
                  href={profile.username ? `/profile/${profile.username}` : `/profile/${profile.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>

                {/* FLUSH */}
                <Link
                  href="/points"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Zap className="h-4 w-4 text-amber-400" />
                  FLUSH Tokens
                  {profile.flush_balance != null && profile.flush_balance > 0 && (
                    <span className="ml-auto text-xs font-semibold text-amber-500">
                      {(profile.flush_balance ?? 0).toLocaleString()}
                    </span>
                  )}
                </Link>

                {/* Map */}
                <Link
                  href="/map"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <MapPin className="h-4 w-4 text-sky-500" />
                  Toilet Map
                </Link>

                {/* Shop */}
                <Link
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ShoppingBag className="h-4 w-4 text-sky-500" />
                  Merch Shop
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="text-base">🏆</span>
                  Leaderboard
                </Link>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Best by section */}
                <div className="px-4 py-1.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best by...</p>
                </div>
                {[
                  { href: "/find-public-bathrooms-near-me",    icon: <Navigation className="h-4 w-4 text-sky-500" />,       label: "Find bathrooms near me" },
                  { href: "/best-toilets-in-florida",          icon: <MapPin className="h-4 w-4 text-emerald-500" />,       label: "Best in Florida" },
                  { href: "/best-airport-bathrooms",           icon: <Plane className="h-4 w-4 text-indigo-500" />,         label: "Best airport bathrooms" },
                  { href: "/most-accessible-public-bathrooms", icon: <Accessibility className="h-4 w-4 text-blue-500" />,   label: "Most accessible" },
                  { href: "/adult-changing-stations-near-me",  icon: <Accessibility className="h-4 w-4 text-violet-500" />, label: "Adult changing stations" },
                  { href: "/spotlight",                        icon: <Sparkles className="h-4 w-4 text-violet-400" />,      label: "Get your venue featured" },
                  { href: "/referrals",                        icon: <Gift className="h-4 w-4 text-emerald-400" />,         label: "Refer friends — earn FLUSH" },
                ].map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Sign out */}
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
                {/* Map — visible to logged out users too */}
                <Link
                  href="/map"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <MapPin className="h-4 w-4 text-sky-500" />
                  Toilet Map
                </Link>

                {/* Shop */}
                <Link
                  href="/shop"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ShoppingBag className="h-4 w-4 text-sky-500" />
                  Merch Shop
                </Link>
                <Link
                  href="/leaderboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span className="text-base">🏆</span>
                  Leaderboard
                </Link>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Best by section */}
                <div className="px-4 py-1.5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Best by...</p>
                </div>
                {[
                  { href: "/find-public-bathrooms-near-me",    icon: <Navigation className="h-4 w-4 text-sky-500" />,       label: "Find bathrooms near me" },
                  { href: "/best-toilets-in-florida",          icon: <MapPin className="h-4 w-4 text-emerald-500" />,       label: "Best in Florida" },
                  { href: "/best-airport-bathrooms",           icon: <Plane className="h-4 w-4 text-indigo-500" />,         label: "Best airport bathrooms" },
                  { href: "/most-accessible-public-bathrooms", icon: <Accessibility className="h-4 w-4 text-blue-500" />,   label: "Most accessible" },
                  { href: "/adult-changing-stations-near-me",  icon: <Accessibility className="h-4 w-4 text-violet-500" />, label: "Adult changing stations" },
                  { href: "/spotlight",                        icon: <Sparkles className="h-4 w-4 text-violet-400" />,      label: "Get your venue featured" },
                  { href: "/referrals",                        icon: <Gift className="h-4 w-4 text-emerald-400" />,         label: "Refer friends — earn FLUSH" },
                ].map(({ href, icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

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
                  Join free 🚽
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

export function Navbar({ profile }: NavbarProps) {
  return (
    <Suspense fallback={null}>
      <NavbarInner profile={profile} />
    </Suspense>
  )
}