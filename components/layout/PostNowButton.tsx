"use client"
import { Plus, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function PostNowButton() {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to home with ?post=true — Navbar picks this up and opens modal
    router.push("/?post=true")
  }

  return (
    <button
      onClick={handleClick}
      className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:opacity-90 active:scale-[0.98] transition-all"
    >
      <span className="absolute inset-0 rounded-xl bg-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity" />
      <Plus className="h-4 w-4" />
      Rate a toilet — earn FLUSH
      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}
